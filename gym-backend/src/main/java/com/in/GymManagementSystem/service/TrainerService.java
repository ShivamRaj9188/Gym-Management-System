package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.TrainerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TrainerService {
    List<TrainerDTO> getAllTrainers();

    Page<TrainerDTO> getAllTrainersPaged(Pageable pageable);

    TrainerDTO getTrainerById(Long id);

    TrainerDTO createTrainer(TrainerDTO trainerDTO);

    TrainerDTO updateTrainer(Long id, TrainerDTO trainerDTO);

    void deleteTrainer(Long id);
}
