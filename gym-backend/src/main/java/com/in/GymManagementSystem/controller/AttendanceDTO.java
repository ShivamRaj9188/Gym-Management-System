package com.in.GymManagementSystem.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDTO {
    private Long id;
    private Long memberId;
    private String memberName;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
}
