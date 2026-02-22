package com.in.GymManagementSystem.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.in.GymManagementSystem.dto.AttendanceDTO;
import com.in.GymManagementSystem.services.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceDTO>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByMember(memberId));
    }

    @PostMapping
    public ResponseEntity<AttendanceDTO> createAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.createAttendance(attendanceDTO));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<AttendanceDTO> checkOut(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.checkOut(id));
    }
}
