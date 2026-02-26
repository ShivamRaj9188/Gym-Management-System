package com.in.GymManagementSystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDTO {
    private Long id;
    @NotBlank(message = "Plan name is required.")
    private String name;
    private String description;
    private Integer durationMonths;
    private Double price;
    private boolean active;
}
