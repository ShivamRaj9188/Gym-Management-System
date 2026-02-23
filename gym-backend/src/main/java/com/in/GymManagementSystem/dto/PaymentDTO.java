package com.in.GymManagementSystem.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    private Long memberId;
    private String memberName;
    private Long planId;
    private String planName;
    private Double amount;
    private LocalDate paymentDate;
    private String status;
    private String paymentMethod;
    private LocalDate dueDate;
}
