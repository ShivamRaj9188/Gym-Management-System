package com.in.GymManagementSystem.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.in.GymManagementSystem.dto.HomeDashboardDTO;
import com.in.GymManagementSystem.service.HomeService;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/dashboard")
    public HomeDashboardDTO getDashboard() {
        return homeService.getDashboardData();
    }
}