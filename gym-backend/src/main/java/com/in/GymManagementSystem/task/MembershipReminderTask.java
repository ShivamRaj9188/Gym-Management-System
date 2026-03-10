package com.in.GymManagementSystem.task;

import com.in.GymManagementSystem.entity.Payment;
import com.in.GymManagementSystem.repository.PaymentRepository;
import com.in.GymManagementSystem.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class MembershipReminderTask {

    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    // Run every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendOverduePaymentReminders() {
        log.info("Starting overdue payment reminders task...");
        try {
            List<Payment> pendingPayments = paymentRepository.findByStatus("PENDING");
            LocalDate today = LocalDate.now();

            List<Payment> overduePayments = pendingPayments.stream()
                    .filter(p -> p.getDueDate() != null && p.getDueDate().isBefore(today))
                    .collect(Collectors.toList());

            for (Payment p : overduePayments) {
                if (p.getMember() != null && p.getMember().getEmail() != null && !p.getMember().getEmail().isEmpty()) {
                    String subject = "Overdue Payment Reminder: Gym Management System";
                    String planName = p.getPlan() != null ? p.getPlan().getName() : "Gym Membership";
                    String body = String.format(
                            "Dear %s,\n\nYour payment of Rs %s for the %s plan was due on %s. Please clear your dues at the earliest.\n\nThank you,\nGym Management Team",
                            p.getMember().getName(), p.getAmount(), planName, p.getDueDate());

                    emailService.sendEmail(p.getMember().getEmail(), subject, body);
                }
            }
            log.info("Completed overdue payment reminders task. Sent {} reminders.", overduePayments.size());
        } catch (Exception e) {
            log.error("Error executing overdue payment reminders task", e);
        }
    }
}
