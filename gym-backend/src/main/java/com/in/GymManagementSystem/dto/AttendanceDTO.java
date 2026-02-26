package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "Member is required.")
    private Long memberId;
    private String memberName;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
}
