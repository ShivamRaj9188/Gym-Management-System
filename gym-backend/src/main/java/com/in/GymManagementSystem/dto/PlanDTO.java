package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import com.in.GymManagementSystem.validation.ValidationPatterns;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDTO {
    private Long id;
    @NotBlank(message = "Plan name is required.")
    @Pattern(regexp = ValidationPatterns.PLAN_NAME_REGEX, message = "Plan name must be 2-60 letters and can include single spaces, apostrophes, or hyphens.")
    private String name;
    private String description;
    @NotNull(message = "Plan duration is required.")
    @Min(value = 1, message = "Plan duration must be at least 1 month.")
    @Max(value = 60, message = "Plan duration cannot exceed 60 months.")
    private Integer durationMonths;
    @NotNull(message = "Plan price is required.")
    @DecimalMin(value = "1000.0", inclusive = true, message = "Plan price must be at least 1000.")
    private Double price;
    private boolean active;
}
