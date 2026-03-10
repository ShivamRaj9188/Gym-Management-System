package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.AdminUserDTO;
import com.in.GymManagementSystem.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<AdminUserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "username") String sort) {
        size = Math.min(size, 100);
        return ResponseEntity.ok(adminUserService.getAllUsersPaged(PageRequest.of(page, size, Sort.by(sort))));
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
