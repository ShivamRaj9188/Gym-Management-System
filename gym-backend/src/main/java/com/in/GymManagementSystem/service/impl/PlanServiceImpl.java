package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.PlanDTO;
import com.in.GymManagementSystem.entity.Plan;
import com.in.GymManagementSystem.exception.ResourceNotFoundException;
import com.in.GymManagementSystem.repository.PlanRepository;
import com.in.GymManagementSystem.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;

    @Override
    public List<PlanDTO> getAllPlans() {
        return planRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlanDTO> getActivePlans() {
        return planRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PlanDTO getPlanById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
        return convertToDTO(plan);
    }

    @Override
    @Transactional
    public PlanDTO createPlan(PlanDTO planDTO) {
        Plan plan = Plan.builder()
                .name(planDTO.getName())
                .description(planDTO.getDescription())
                .durationMonths(planDTO.getDurationMonths())
                .price(planDTO.getPrice())
                .active(planDTO.isActive())
                .build();

        plan = planRepository.save(plan);
        return convertToDTO(plan);
    }

    @Override
    @Transactional
    public PlanDTO updatePlan(Long id, PlanDTO planDTO) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        plan.setName(planDTO.getName());
        plan.setDescription(planDTO.getDescription());
        plan.setDurationMonths(planDTO.getDurationMonths());
        plan.setPrice(planDTO.getPrice());
        plan.setActive(planDTO.isActive());

        plan = planRepository.save(plan);
        return convertToDTO(plan);
    }

    @Override
    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }

    private PlanDTO convertToDTO(Plan plan) {
        return PlanDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .durationMonths(plan.getDurationMonths())
                .price(plan.getPrice())
                .active(plan.isActive())
                .build();
    }
}
