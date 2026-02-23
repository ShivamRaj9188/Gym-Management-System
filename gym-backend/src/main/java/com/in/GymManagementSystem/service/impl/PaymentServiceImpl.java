package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.PaymentDTO;
import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.entity.Payment;
import com.in.GymManagementSystem.entity.Plan;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.PaymentRepository;
import com.in.GymManagementSystem.repository.PlanRepository;
import com.in.GymManagementSystem.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;

    @Override
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsByMember(Long memberId) {
        return paymentRepository.findByMemberId(memberId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Member member = memberRepository.findById(paymentDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Plan plan = planRepository.findById(paymentDTO.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        Payment payment = Payment.builder()
                .member(member)
                .plan(plan)
                .amount(paymentDTO.getAmount())
                .paymentDate(paymentDTO.getPaymentDate())
                .status(paymentDTO.getStatus())
                .paymentMethod(paymentDTO.getPaymentMethod())
                .dueDate(paymentDTO.getDueDate())
                .build();

        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    @Override
    @Transactional
    public PaymentDTO updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(status);
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .memberId(payment.getMember().getId())
                .memberName(payment.getMember().getName())
                .planId(payment.getPlan().getId())
                .planName(payment.getPlan().getName())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .dueDate(payment.getDueDate())
                .build();
    }
}
