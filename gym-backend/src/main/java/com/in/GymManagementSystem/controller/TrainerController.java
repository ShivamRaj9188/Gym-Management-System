package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.TrainerDTO;
import com.in.GymManagementSystem.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    @GetMapping
    public ResponseEntity<List<TrainerDTO>> getAllTrainers() {
        return ResponseEntity.ok(trainerService.getAllTrainers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerDTO> getTrainerById(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainerById(id));
    }

    @PostMapping
    public ResponseEntity<TrainerDTO> createTrainer(@Valid @RequestBody TrainerDTO trainerDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainerService.createTrainer(trainerDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerDTO> updateTrainer(@PathVariable Long id, @Valid @RequestBody TrainerDTO trainerDTO) {
        return ResponseEntity.ok(trainerService.updateTrainer(id, trainerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }
}
