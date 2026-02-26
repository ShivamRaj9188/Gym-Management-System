package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.AdminUserDTO;
import com.in.GymManagementSystem.entity.User;
import com.in.GymManagementSystem.exception.ResourceNotFoundException;
import com.in.GymManagementSystem.repository.UserRepository;
import com.in.GymManagementSystem.service.AdminUserService;
import com.in.GymManagementSystem.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @Override
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public AdminUserDTO verifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return toDto(user);
        }

        user.setVerified(true);
        userRepository.save(user);

        auditService.log("VERIFY_USER", "User", id, currentUsername(),
                "Verified user: " + user.getUsername());

        return toDto(user);
    }

    @Override
    @Transactional
    public AdminUserDTO unverifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return toDto(user);
        }

        user.setVerified(false);
        userRepository.save(user);

        auditService.log("UNVERIFY_USER", "User", id, currentUsername(),
                "Unverified user: " + user.getUsername());

        return toDto(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Cannot delete admin user");
        }

        String deletedUsername = user.getUsername();
        userRepository.delete(user);

        auditService.log("DELETE_USER", "User", id, currentUsername(),
                "Deleted user: " + deletedUsername);
    }

    private AdminUserDTO toDto(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .verified(user.isVerified())
                .build();
    }

    private String currentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }
}
