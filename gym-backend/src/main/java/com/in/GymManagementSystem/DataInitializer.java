package com.in.GymManagementSystem;

import com.in.GymManagementSystem.entity.User;
import com.in.GymManagementSystem.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = User.builder()
                        .username("admin")
                        .password("admin123")
                        .role("ADMIN")
                        .build();

                userRepository.save(admin);
            }
        };
    }
}