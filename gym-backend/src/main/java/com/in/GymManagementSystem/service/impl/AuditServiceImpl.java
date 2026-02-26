package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.entity.AuditLog;
import com.in.GymManagementSystem.repository.AuditLogRepository;
import com.in.GymManagementSystem.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void log(String action, String entityType, Long entityId, String performedBy, String details) {
        AuditLog entry = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .performedBy(performedBy)
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }
}
