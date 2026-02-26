package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.MemberDTO;
import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.entity.Plan;
import com.in.GymManagementSystem.entity.Trainer;
import com.in.GymManagementSystem.exception.ResourceNotFoundException;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.PlanRepository;
import com.in.GymManagementSystem.repository.TrainerRepository;
import com.in.GymManagementSystem.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
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
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        return convertToDTO(member);
    }

    @Override
    @Transactional
    public MemberDTO createMember(MemberDTO memberDTO) {
        String normalizedEmail = normalizeEmail(memberDTO.getEmail());
        String normalizedPhone = normalizePhone(memberDTO.getPhone());
        ensureUniqueMemberContact(normalizedEmail, normalizedPhone, null);

        Member member = Member.builder()
                .name(memberDTO.getName())
                .email(normalizedEmail)
                .phone(normalizedPhone)
                .active(memberDTO.isActive())
                .build();

        if (memberDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(memberDTO.getPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
            member.setPlan(plan);
        }

        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    @Override
    @Transactional
    public MemberDTO updateMember(Long id, MemberDTO memberDTO) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        String normalizedEmail = normalizeEmail(memberDTO.getEmail());
        String normalizedPhone = normalizePhone(memberDTO.getPhone());
        ensureUniqueMemberContact(normalizedEmail, normalizedPhone, id);

        member.setName(memberDTO.getName());
        member.setEmail(normalizedEmail);
        member.setPhone(normalizedPhone);
        member.setActive(memberDTO.isActive());

        if (memberDTO.getPlanId() != null) {
            Plan plan = planRepository.findById(memberDTO.getPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
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
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        member.getTrainers().add(trainer);
        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    @Override
    @Transactional
    public MemberDTO removeTrainer(Long memberId, Long trainerId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

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

    private void ensureUniqueMemberContact(String email, String phone, Long currentId) {
        boolean emailExists = currentId == null
                ? memberRepository.existsByEmailIgnoreCase(email)
                : memberRepository.existsByEmailIgnoreCaseAndIdNot(email, currentId);
        if (emailExists) {
            throw new IllegalArgumentException("Member email already exists.");
        }

        boolean phoneExists = currentId == null
                ? memberRepository.existsByPhone(phone)
                : memberRepository.existsByPhoneAndIdNot(phone, currentId);
        if (phoneExists) {
            throw new IllegalArgumentException("Member phone already exists.");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizePhone(String phone) {
        return phone == null ? null : phone.trim();
    }
}
