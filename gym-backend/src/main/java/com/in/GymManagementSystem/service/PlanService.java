package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.PlanDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PlanService {
    Page<PlanDTO> getAllPlansPaged(Pageable pageable);

    List<PlanDTO> getAllPlans();

    List<PlanDTO> getActivePlans();

    PlanDTO getPlanById(Long id);

    PlanDTO createPlan(PlanDTO planDTO);

    PlanDTO updatePlan(Long id, PlanDTO planDTO);

    void deletePlan(Long id);
}
