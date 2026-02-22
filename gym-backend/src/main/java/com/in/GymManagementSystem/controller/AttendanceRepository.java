package com.in.GymManagementSystem.repository;

import com.in.GymManagementSystem.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByMemberId(Long memberId);
    long countByDate(LocalDate date);
}
