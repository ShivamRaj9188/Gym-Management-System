package com.in.GymManagementSystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDTO {
    private Long id;
    private String name;
    private String description;
    private Integer durationMonths;
    private Double price;
    private boolean active;
}
