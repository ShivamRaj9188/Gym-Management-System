package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.AttendanceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceDTO> getAllAttendance();

    Page<AttendanceDTO> getAllAttendancePaged(Pageable pageable);

    List<AttendanceDTO> getAttendanceByDate(LocalDate date);

    List<AttendanceDTO> getAttendanceByMember(Long memberId);

    AttendanceDTO createAttendance(AttendanceDTO attendanceDTO);

    AttendanceDTO checkOut(Long id);

    void deleteAttendance(Long id);
}
