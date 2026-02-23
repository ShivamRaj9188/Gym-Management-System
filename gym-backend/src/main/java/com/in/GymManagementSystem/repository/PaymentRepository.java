package com.in.GymManagementSystem.repository;

import com.in.GymManagementSystem.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMemberId(Long memberId);
    List<Payment> findByStatus(String status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
    Double getTotalRevenue();
}
