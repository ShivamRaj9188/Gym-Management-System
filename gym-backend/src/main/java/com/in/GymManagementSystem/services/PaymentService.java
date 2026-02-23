package com.in.GymManagementSystem.services;

import com.in.GymManagementSystem.dto.PaymentDTO;
import java.util.List;

public interface PaymentService {
    List<PaymentDTO> getAllPayments();
    List<PaymentDTO> getPaymentsByMember(Long memberId);
    List<PaymentDTO> getPaymentsByStatus(String status);
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    PaymentDTO updatePaymentStatus(Long id, String status);
}
