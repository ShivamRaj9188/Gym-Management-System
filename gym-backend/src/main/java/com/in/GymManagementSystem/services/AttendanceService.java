package com.in.GymManagementSystem.services;

import com.in.GymManagementSystem.dto.AttendanceDTO;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceDTO> getAllAttendance();
    List<AttendanceDTO> getAttendanceByDate(LocalDate date);
    List<AttendanceDTO> getAttendanceByMember(Long memberId);
    AttendanceDTO createAttendance(AttendanceDTO attendanceDTO);
    AttendanceDTO checkOut(Long id);
    void deleteAttendance(Long id);
}
