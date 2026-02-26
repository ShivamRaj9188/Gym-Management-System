package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.PaymentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PaymentService {
    List<PaymentDTO> getAllPayments();

    Page<PaymentDTO> getAllPaymentsPaged(Pageable pageable);

    List<PaymentDTO> getPaymentsByMember(Long memberId);

    List<PaymentDTO> getPaymentsByStatus(String status);

    PaymentDTO createPayment(PaymentDTO paymentDTO);

    PaymentDTO updatePaymentStatus(Long id, String status);

    void deletePayment(Long id);
}
