package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.LoginRequest;
import com.in.GymManagementSystem.dto.SignupRequest;
import com.in.GymManagementSystem.entity.RefreshToken;
import com.in.GymManagementSystem.entity.User;
import com.in.GymManagementSystem.repository.UserRepository;
import com.in.GymManagementSystem.security.JwtUtil;
import com.in.GymManagementSystem.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * OWASP: Authentication controller with typed DTOs, rate limiting, and refresh
 * token support.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        String username = request.getUsername().trim();
        String password = request.getPassword();

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        User user = userOptional.get();
        if (!"ADMIN".equalsIgnoreCase(user.getRole()) && !user.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Account is not verified yet"));
        }

        // OWASP: Migrate legacy plain-text passwords to BCrypt on successful match
        if (user.getPassword() != null && !user.getPassword().startsWith("$2")) {
            if (user.getPassword().equals(password)) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            }
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        String role = user.getRole() == null ? "USER" : user.getRole();
        String token = jwtUtil.generateToken(user.getUsername(), role);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("username", user.getUsername());
        response.put("role", role);
        response.put("token", token);
        response.put("refreshToken", refreshToken.getToken());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {
        String normalizedUsername = request.getUsername().trim();
        String password = request.getPassword();

        if (password.chars().anyMatch(Character::isWhitespace)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must not contain spaces"));
        }

        Optional<User> existingUser = userRepository.findByUsername(normalizedUsername);
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists"));
        }

        if ("admin".equalsIgnoreCase(normalizedUsername)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists"));
        }

        User newUser = User.builder()
                .username(normalizedUsername)
                .password(passwordEncoder.encode(password))
                .role("USER")
                .verified(false)
                .build();

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Signup successful",
                "username", newUser.getUsername(),
                "role", newUser.getRole(),
                "verified", String.valueOf(newUser.isVerified())));
    }

    /**
     * Refresh access token using a valid refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String requestRefreshToken = request.get("refreshToken");
        if (requestRefreshToken == null || requestRefreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token is required"));
        }

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(token -> {
                    if (refreshTokenService.isExpired(token)) {
                        refreshTokenService.deleteByUserId(token.getUser().getId());
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "Refresh token expired. Please login again."));
                    }

                    User user = token.getUser();
                    String role = user.getRole() == null ? "USER" : user.getRole();
                    String newAccessToken = jwtUtil.generateToken(user.getUsername(), role);

                    Map<String, String> response = new HashMap<>();
                    response.put("token", newAccessToken);
                    response.put("refreshToken", requestRefreshToken);
                    response.put("message", "Token refreshed");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid refresh token")));
    }

    /**
     * Admin-only: Reset another user's password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        // Only admin can reset passwords
        String currentUser;
        try {
            currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        Optional<User> adminUser = userRepository.findByUsername(currentUser);
        if (adminUser.isEmpty() || !"ADMIN".equalsIgnoreCase(adminUser.get().getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only admins can reset passwords"));
        }

        String targetUsername = request.get("username");
        String newPassword = request.get("newPassword");

        if (targetUsername == null || newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username and newPassword (min 8 chars) are required"));
        }

        Optional<User> targetUser = userRepository.findByUsername(targetUsername);
        if (targetUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = targetUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Invalidate existing refresh tokens
        refreshTokenService.deleteByUserId(user.getId());

        return ResponseEntity.ok(Map.of("message", "Password reset successful for " + targetUsername));
    }
}
