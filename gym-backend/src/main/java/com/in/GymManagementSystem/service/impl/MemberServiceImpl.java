package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.MemberDTO;
import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.entity.Plan;
import com.in.GymManagementSystem.entity.Trainer;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.PlanRepository;
import com.in.GymManagementSystem.repository.TrainerRepository;
import com.in.GymManagementSystem.services.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final TrainerRepository trainerRepository;

    @Override
    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MemberDTO getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return convertToDTO(member);
    }

    @Override
    @Transactional
    public MemberDTO createMember(MemberDTO memberDTO) {
        Member member = Member.builder()
                .name(memberDTO.getName())
                .email(memberDTO.getEmail())
                .phone(memberDTO.getPhone())
                .active(memberDTO.isActive())
                .build();

        if (memberDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(memberDTO.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan not found"));
            member.setPlan(plan);
        }

        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    @Override
    @Transactional
    public MemberDTO updateMember(Long id, MemberDTO memberDTO) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setName(memberDTO.getName());
        member.setEmail(memberDTO.getEmail());
        member.setPhone(memberDTO.getPhone());
        member.setActive(memberDTO.isActive());

        if (memberDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(memberDTO.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan not found"));
            member.setPlan(plan);
        } else {
            member.setPlan(null);
        }

        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    @Override
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    @Override
    @Transactional
    public MemberDTO assignTrainer(Long memberId, Long trainerId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        member.getTrainers().add(trainer);
        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    @Override
    @Transactional
    public MemberDTO removeTrainer(Long memberId, Long trainerId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        member.getTrainers().remove(trainer);
        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    private MemberDTO convertToDTO(Member member) {
        return MemberDTO.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .planId(member.getPlan() != null ? member.getPlan().getId() : null)
                .planName(member.getPlan() != null ? member.getPlan().getName() : null)
                .active(member.isActive())
                .build();
    }
}
