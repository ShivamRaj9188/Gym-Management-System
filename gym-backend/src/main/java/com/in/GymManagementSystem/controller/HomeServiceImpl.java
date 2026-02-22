package com.in.GymManagementSystem.service.impl;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.in.GymManagementSystem.dto.HomeDashboardDTO;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.TrainerRepository;
import com.in.GymManagementSystem.repository.AttendanceRepository;
import com.in.GymManagementSystem.repository.PaymentRepository;
import com.in.GymManagementSystem.services.HomeService;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final AttendanceRepository attendanceRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public HomeDashboardDTO getDashboardData() {

        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.countByActiveTrue();
        long totalTrainers = trainerRepository.count();

        long todayAttendance = attendanceRepository.countByDate(LocalDate.now());
        Double revenue = paymentRepository.getTotalRevenue();
        double totalRevenue = revenue != null ? revenue : 0.0;

        return new HomeDashboardDTO(
                totalMembers,
                activeMembers,
                totalTrainers,
                todayAttendance,
                totalRevenue
        );
    }
}