package com.in.GymManagementSystem.services;

import com.in.GymManagementSystem.dto.TrainerDTO;
import java.util.List;

public interface TrainerService {
    List<TrainerDTO> getAllTrainers();
    TrainerDTO getTrainerById(Long id);
    TrainerDTO createTrainer(TrainerDTO trainerDTO);
    TrainerDTO updateTrainer(Long id, TrainerDTO trainerDTO);
    void deleteTrainer(Long id);
}
