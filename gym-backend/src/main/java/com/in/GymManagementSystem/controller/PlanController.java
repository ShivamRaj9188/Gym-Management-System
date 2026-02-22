package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.PlanDTO;
import com.in.GymManagementSystem.services.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public ResponseEntity<List<PlanDTO>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @GetMapping("/active")
    public ResponseEntity<List<PlanDTO>> getActivePlans() {
        return ResponseEntity.ok(planService.getActivePlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanDTO> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }

    @PostMapping
    public ResponseEntity<PlanDTO> createPlan(@RequestBody PlanDTO planDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(planDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanDTO> updatePlan(@PathVariable Long id, @RequestBody PlanDTO planDTO) {
        return ResponseEntity.ok(planService.updatePlan(id, planDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
