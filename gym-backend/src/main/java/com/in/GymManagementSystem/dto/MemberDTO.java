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
public class MemberDTO {
    private Long id;
    @NotBlank(message = "Member name is required.")
    @Pattern(regexp = ValidationPatterns.NAME_REGEX, message = "Member name must be 2-60 letters and can include single spaces, apostrophes, or hyphens.")
    private String name;
    @NotBlank(message = "Member email is required.")
    @Email(message = "Member email must be valid.")
    @Pattern(regexp = ValidationPatterns.EMAIL_REGEX, message = "Member email format is invalid.")
    private String email;
    @NotBlank(message = "Member phone is required.")
    @Pattern(regexp = ValidationPatterns.PHONE_REGEX, message = "Member phone must be a valid 10-digit number starting with 6-9.")
    private String phone;
    private Long planId;
    private String planName;
    private boolean active;
}
