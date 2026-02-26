package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.AttendanceDTO;
import com.in.GymManagementSystem.entity.Attendance;
import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.repository.AttendanceRepository;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.services.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<AttendanceDTO> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByMember(Long memberId) {
        return attendanceRepository.findByMemberId(memberId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
        Member member = memberRepository.findById(attendanceDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        LocalDate attendanceDate = attendanceDTO.getDate() != null ? attendanceDTO.getDate() : LocalDate.now();
        if (attendanceDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Attendance cannot be marked for past dates.");
        }
        if (attendanceRepository.existsByMemberIdAndDate(attendanceDTO.getMemberId(), attendanceDate)) {
            throw new IllegalArgumentException("Attendance for this member and date already exists.");
        }

        Attendance attendance = Attendance.builder()
                .member(member)
                .date(attendanceDate)
                .checkIn(attendanceDTO.getCheckIn() != null ? attendanceDTO.getCheckIn() : LocalTime.now())
                .checkOut(attendanceDTO.getCheckOut())
                .build();

        attendance = attendanceRepository.save(attendance);
        return convertToDTO(attendance);
    }

    @Override
    @Transactional
    public AttendanceDTO checkOut(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        if (attendance.getDate() != null && attendance.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Attendance checkout is only allowed for today.");
        }
        if (attendance.getCheckOut() != null) {
            throw new IllegalArgumentException("Attendance already checked out.");
        }

        attendance.setCheckOut(LocalTime.now());
        attendance = attendanceRepository.save(attendance);
        return convertToDTO(attendance);
    }

    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));
        attendanceRepository.delete(attendance);
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .memberId(attendance.getMember().getId())
                .memberName(attendance.getMember().getName())
                .date(attendance.getDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .build();
    }
}
