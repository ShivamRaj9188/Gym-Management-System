package com.in.GymManagementSystem;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.in.GymManagementSystem.entity.Plan;
import com.in.GymManagementSystem.entity.Trainer;
import com.in.GymManagementSystem.entity.User;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.PlanRepository;
import com.in.GymManagementSystem.repository.TrainerRepository;
import com.in.GymManagementSystem.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(
            UserRepository userRepository,
            PlanRepository planRepository,
            MemberRepository memberRepository,
            TrainerRepository trainerRepository) {
        return args -> {
            // Initialize admin user
            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = User.builder()
                        .username("admin")
                        .password("admin123")
                        .role("ADMIN")
                        .build();

                userRepository.save(admin);
            }

            // Initialize plans
            if (planRepository.count() == 0) {
                Plan basic = Plan.builder()
                        .name("Basic")
                        .description("Basic gym access")
                        .durationMonths(1)
                        .price(1000.0)
                        .active(true)
                        .build();

                Plan premium = Plan.builder()
                        .name("Premium")
                        .description("Gym access + Personal trainer")
                        .durationMonths(3)
                        .price(2500.0)
                        .active(true)
                        .build();

                Plan elite = Plan.builder()
                        .name("Elite")
                        .description("Full access + Diet planning")
                        .durationMonths(6)
                        .price(4000.0)
                        .active(true)
                        .build();

                planRepository.save(basic);
                planRepository.save(premium);
                planRepository.save(elite);
            }

            // Initialize trainers
            if (trainerRepository.count() == 0) {
                Trainer trainer1 = Trainer.builder()
                        .name("John Smith")
                        .specialization("Weightlifting")
                        .email("john@gym.com")
                        .phone("9876543210")
                        .build();

                Trainer trainer2 = Trainer.builder()
                        .name("Sarah Johnson")
                        .specialization("Yoga & Cardio")
                        .email("sarah@gym.com")
                        .phone("9876543211")
                        .build();

                trainerRepository.save(trainer1);
                trainerRepository.save(trainer2);
            }
        };
    }
}
