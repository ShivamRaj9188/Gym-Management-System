package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.PlanDTO;
import java.util.List;

public interface PlanService {
    List<PlanDTO> getAllPlans();
    List<PlanDTO> getActivePlans();
    PlanDTO getPlanById(Long id);
    PlanDTO createPlan(PlanDTO planDTO);
    PlanDTO updatePlan(Long id, PlanDTO planDTO);
    void deletePlan(Long id);
}
