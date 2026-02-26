package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import com.in.GymManagementSystem.validation.ValidationPatterns;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerDTO {
    private Long id;
    @NotBlank(message = "Trainer name is required.")
    @Pattern(regexp = ValidationPatterns.NAME_REGEX, message = "Trainer name must be 2-60 letters and can include single spaces, apostrophes, or hyphens.")
    private String name;
    @NotBlank(message = "Trainer specialization is required.")
    @Pattern(regexp = ValidationPatterns.SPECIALIZATION_REGEX, message = "Trainer specialization must be 2-80 letters and can include single spaces, apostrophes, or hyphens.")
    private String specialization;
    @NotBlank(message = "Trainer email is required.")
    @Email(message = "Trainer email must be valid.")
    @Pattern(regexp = ValidationPatterns.EMAIL_REGEX, message = "Trainer email format is invalid.")
    private String email;
    @NotBlank(message = "Trainer phone is required.")
    @Pattern(regexp = ValidationPatterns.PHONE_REGEX, message = "Trainer phone must be a valid 10-digit number starting with 6-9.")
    private String phone;
    private Integer memberCount;
}
