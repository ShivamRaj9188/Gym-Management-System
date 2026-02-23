package com.in.GymManagementSystem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Long planId;
    private String planName;
    private boolean active;
}
