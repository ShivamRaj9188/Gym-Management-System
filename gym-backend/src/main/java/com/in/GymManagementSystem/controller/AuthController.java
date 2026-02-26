package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.entity.User;
import com.in.GymManagementSystem.repository.UserRepository;
import com.in.GymManagementSystem.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class AuthController {

    private static final int MIN_USERNAME_LENGTH = 3;
    private static final int MAX_USERNAME_LENGTH = 20;
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 64;
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9._]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        User user = userOptional.get();
        if (!"ADMIN".equalsIgnoreCase(user.getRole()) && !user.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Account is not verified yet"));
        }

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

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "username", user.getUsername(),
                "role", role,
                "token", token
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        String normalizedUsername = username.trim();
        String validationError = validateSignupInput(normalizedUsername, password);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(Map.of("message", validationError));
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
                "verified", String.valueOf(newUser.isVerified())
        ));
    }

    private String validateSignupInput(String username, String password) {
        if (username.isBlank() || password.isBlank()) {
            return "Username and password are required";
        }

        if (username.length() < MIN_USERNAME_LENGTH || username.length() > MAX_USERNAME_LENGTH) {
            return "Username must be between 3 and 20 characters";
        }

        if (!USERNAME_PATTERN.matcher(username).matches()) {
            return "Username can only contain letters, numbers, dot, and underscore";
        }

        if (password.length() < MIN_PASSWORD_LENGTH || password.length() > MAX_PASSWORD_LENGTH) {
            return "Password must be between 8 and 64 characters";
        }

        if (password.chars().anyMatch(Character::isWhitespace)) {
            return "Password must not contain spaces";
        }

        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return "Password must include uppercase, lowercase, number, and special character";
        }

        return null;
    }
}
