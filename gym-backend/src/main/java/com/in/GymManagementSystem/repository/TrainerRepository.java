package com.in.GymManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.in.GymManagementSystem.entity.Trainer;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
}