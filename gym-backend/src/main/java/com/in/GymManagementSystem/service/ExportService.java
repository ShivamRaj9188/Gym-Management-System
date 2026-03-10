package com.in.GymManagementSystem.service;

public interface ExportService {
    byte[] exportMembersToExcel();

    byte[] exportMembersToPdf();
}
