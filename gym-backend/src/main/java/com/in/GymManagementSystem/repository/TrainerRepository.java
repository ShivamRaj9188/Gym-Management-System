package com.in.GymManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.in.GymManagementSystem.entity.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    boolean existsByPhoneAndIdNot(String phone, Long id);
}
