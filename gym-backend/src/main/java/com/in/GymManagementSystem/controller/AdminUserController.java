package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.AdminUserDTO;
import com.in.GymManagementSystem.entity.User;
import com.in.GymManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        List<AdminUserDTO> users = userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<AdminUserDTO> verifyUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(toDto(user));
        }

        user.setVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok(toDto(user));
    }

    @PutMapping("/{id}/unverify")
    public ResponseEntity<AdminUserDTO> unverifyUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(toDto(user));
        }

        user.setVerified(false);
        userRepository.save(user);
        return ResponseEntity.ok(toDto(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().build();
        }

        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }

    private AdminUserDTO toDto(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .verified(user.isVerified())
                .build();
    }
}
