package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.entity.AuditLog;
import com.in.GymManagementSystem.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only endpoint for viewing the audit trail.
 * Access restricted by SecurityConfig to ROLE_ADMIN.
 */
@RestController
@RequestMapping("/api/admin/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAuditLog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        size = Math.min(size, 100); // cap page size
        Page<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
        return ResponseEntity.ok(logs);
    }
}
