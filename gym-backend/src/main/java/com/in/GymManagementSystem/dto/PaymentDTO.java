package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import com.in.GymManagementSystem.validation.ValidationPatterns;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long id;
    @NotNull(message = "Member is required.")
    private Long memberId;
    private String memberName;
    @NotNull(message = "Plan is required.")
    private Long planId;
    private String planName;
    @NotNull(message = "Amount is required.")
    @Positive(message = "Amount must be greater than zero.")
    private Double amount;
    @NotNull(message = "Payment date is required.")
    private LocalDate paymentDate;
    @NotBlank(message = "Payment status is required.")
    @Pattern(regexp = ValidationPatterns.PAYMENT_STATUS_REGEX, message = "Payment status must be one of: PENDING, PAID, FAILED.")
    private String status;
    @Pattern(regexp = ValidationPatterns.PAYMENT_METHOD_REGEX, message = "Payment method must be one of: CASH, CARD, UPI.")
    private String paymentMethod;
    private LocalDate dueDate;
}
