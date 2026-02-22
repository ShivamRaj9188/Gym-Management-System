package com.in.GymManagementSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(
    basePackages = "com.in.GymManagementSystem.repository",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = {".*PaymentRepository", ".*AttendanceRepository"}
    )
)
@ComponentScan(
    basePackages = "com.in.GymManagementSystem",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = {".*PaymentController", ".*AttendanceController", ".*PaymentService.*", ".*AttendanceService.*"}
    )
)
public class GymManagementSystemApplicationMinimal {

	public static void main(String[] args) {
		System.out.println("===========================================");
		System.out.println("  MINIMAL MODE: Payment & Attendance OFF");
		System.out.println("  Features: Member, Trainer, Plan, Auth");
		System.out.println("===========================================");
		SpringApplication.run(GymManagementSystemApplicationMinimal.class, args);
	}

}
