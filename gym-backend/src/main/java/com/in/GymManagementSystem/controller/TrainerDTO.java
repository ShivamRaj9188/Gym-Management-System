package com.in.GymManagementSystem.dto;

import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerDTO {
    private Long id;
    private String name;
    private String specialization;
    private String email;
    private String phone;
    private Integer memberCount;
}
