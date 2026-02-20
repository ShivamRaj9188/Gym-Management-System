package com.in.GymManagementSystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HomeDashboardDTO {

    private long totalMembers;
    private long activeMembers;
    private long totalTrainers;
    private long todayAttendance;   // future
    private double totalRevenue;    // future
}