package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.AdminUserDTO;
import com.in.GymManagementSystem.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<AdminUserDTO> verifyUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.verifyUser(id));
    }

    @PutMapping("/{id}/unverify")
    public ResponseEntity<AdminUserDTO> unverifyUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.unverifyUser(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
