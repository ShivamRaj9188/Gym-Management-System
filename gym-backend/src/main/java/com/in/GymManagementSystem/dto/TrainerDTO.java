package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerDTO {
    private Long id;
    @NotBlank(message = "Trainer name is required.")
    private String name;
    private String specialization;
    @NotBlank(message = "Trainer email is required.")
    @Email(message = "Trainer email must be valid.")
    private String email;
    private String phone;
    private Integer memberCount;
}
