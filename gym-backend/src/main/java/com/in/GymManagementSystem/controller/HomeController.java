package com.in.GymManagementSystem.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.in.GymManagementSystem.dto.HomeDashboardDTO;
import com.in.GymManagementSystem.services.HomeService;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/dashboard")
    public HomeDashboardDTO getDashboard() {
        return homeService.getDashboardData();
    }
}