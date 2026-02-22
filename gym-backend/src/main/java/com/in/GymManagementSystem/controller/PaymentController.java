package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.PaymentDTO;
import com.in.GymManagementSystem.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(paymentService.getPaymentsByMember(memberId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(paymentDTO));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PaymentDTO> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status));
    }
}
