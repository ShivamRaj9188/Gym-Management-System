package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.PaymentDTO;
import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.entity.Payment;
import com.in.GymManagementSystem.entity.Plan;
import com.in.GymManagementSystem.exception.ResourceNotFoundException;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.PaymentRepository;
import com.in.GymManagementSystem.repository.PlanRepository;
import com.in.GymManagementSystem.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "PAID", "FAILED");
    private static final Set<String> ALLOWED_PAYMENT_METHODS = Set.of("CASH", "CARD", "UPI");

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
        String normalizedStatus = normalizeStatus(status);
        return paymentRepository.findByStatus(normalizedStatus).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Member member = memberRepository.findById(paymentDTO.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Plan plan = planRepository.findById(paymentDTO.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        if (paymentDTO.getPaymentDate() == null) {
            throw new IllegalArgumentException("Payment date is required.");
        }
        if (paymentDTO.getPaymentDate().getYear() != LocalDate.now().getYear()) {
            throw new IllegalArgumentException("Only current year payments are allowed.");
        }
        if (paymentDTO.getDueDate() != null && paymentDTO.getDueDate().isBefore(paymentDTO.getPaymentDate())) {
            throw new IllegalArgumentException("Due date cannot be before payment date.");
        }
        if (paymentDTO.getAmount() == null || paymentDTO.getAmount() < plan.getPrice()) {
            throw new IllegalArgumentException("Payment amount cannot be less than selected plan price.");
        }

        Payment payment = Payment.builder()
                .member(member)
                .plan(plan)
                .amount(paymentDTO.getAmount())
                .paymentDate(paymentDTO.getPaymentDate())
                .status(normalizeStatus(paymentDTO.getStatus()))
                .paymentMethod(normalizePaymentMethod(paymentDTO.getPaymentMethod()))
                .dueDate(paymentDTO.getDueDate())
                .build();

        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    @Override
    @Transactional
    public PaymentDTO updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getPaymentDate() != null && payment.getPaymentDate().getYear() < LocalDate.now().getYear()) {
            throw new IllegalArgumentException("Cannot update status for payments from last year.");
        }

        payment.setStatus(normalizeStatus(status));
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    @Override
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        paymentRepository.delete(payment);
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

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Payment status is required.");
        }

        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new IllegalArgumentException("Payment status must be one of: PENDING, PAID, FAILED.");
        }
        return normalized;
    }

    private String normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            return null;
        }

        String normalized = paymentMethod.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_PAYMENT_METHODS.contains(normalized)) {
            throw new IllegalArgumentException("Payment method must be one of: CASH, CARD, UPI.");
        }
        return normalized;
    }
}
