package com.in.GymManagementSystem.service;

/**
 * Service for recording audit trail entries.
 */
public interface AuditService {
    void log(String action, String entityType, Long entityId, String performedBy, String details);
}
