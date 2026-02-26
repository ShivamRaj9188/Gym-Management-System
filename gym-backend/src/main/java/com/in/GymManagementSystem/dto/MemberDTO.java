package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDTO {
    private Long id;
    @NotBlank(message = "Member name is required.")
    private String name;
    @NotBlank(message = "Member email is required.")
    @Email(message = "Member email must be valid.")
    private String email;
    private String phone;
    private Long planId;
    private String planName;
    private boolean active;
}
