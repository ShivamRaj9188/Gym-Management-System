package com.in.GymManagementSystem;

import com.in.GymManagementSystem.dto.MemberDTO;
import com.in.GymManagementSystem.dto.PaymentDTO;
import com.in.GymManagementSystem.dto.PlanDTO;
import com.in.GymManagementSystem.dto.TrainerDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.stream.Collectors;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertTrue;

class DtoValidationTests {
    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidatorFactory() {
        validatorFactory.close();
    }

    @Test
    void memberDtoRejectsInvalidNameEmailAndPhone() {
        MemberDTO invalidMember = MemberDTO.builder()
                .name("12345")
                .email("bad-email")
                .phone("1234567890")
                .active(true)
                .build();

        Set<String> violatedFields = validator.validate(invalidMember).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());

        assertTrue(violatedFields.contains("name"));
        assertTrue(violatedFields.contains("email"));
        assertTrue(violatedFields.contains("phone"));
    }

    @Test
    void memberDtoAcceptsValidNameEmailAndPhone() {
        MemberDTO validMember = MemberDTO.builder()
                .name("John Smith")
                .email("john.smith@gymfit.co.in")
                .phone("9876543210")
                .active(true)
                .build();

        Set<ConstraintViolation<MemberDTO>> violations = validator.validate(validMember);
        assertTrue(violations.isEmpty());
    }

    @Test
    void trainerDtoRejectsInvalidNameEmailAndPhone() {
        TrainerDTO invalidTrainer = TrainerDTO.builder()
                .name("9999")
                .specialization("123")
                .email("trainer@")
                .phone("55555")
                .build();

        Set<String> violatedFields = validator.validate(invalidTrainer).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());

        assertTrue(violatedFields.contains("name"));
        assertTrue(violatedFields.contains("specialization"));
        assertTrue(violatedFields.contains("email"));
        assertTrue(violatedFields.contains("phone"));
    }

    @Test
    void trainerDtoAcceptsValidNameEmailAndPhone() {
        TrainerDTO validTrainer = TrainerDTO.builder()
                .name("Sarah Johnson")
                .specialization("Strength Training")
                .email("sarah.johnson@gymfit.co")
                .phone("9123456789")
                .build();

        Set<ConstraintViolation<TrainerDTO>> violations = validator.validate(validTrainer);
        assertTrue(violations.isEmpty());
    }

    @Test
    void planDtoRejectsInvalidNameDurationAndPrice() {
        PlanDTO invalidPlan = PlanDTO.builder()
                .name("123")
                .description("Invalid plan")
                .durationMonths(0)
                .price(999.0)
                .active(true)
                .build();

        Set<String> violatedFields = validator.validate(invalidPlan).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());

        assertTrue(violatedFields.contains("name"));
        assertTrue(violatedFields.contains("durationMonths"));
        assertTrue(violatedFields.contains("price"));
    }

    @Test
    void planDtoAcceptsValidNameDurationAndPrice() {
        PlanDTO validPlan = PlanDTO.builder()
                .name("Elite Plus")
                .description("Full gym access")
                .durationMonths(12)
                .price(2500.0)
                .active(true)
                .build();

        Set<ConstraintViolation<PlanDTO>> violations = validator.validate(validPlan);
        assertTrue(violations.isEmpty());
    }

    @Test
    void paymentDtoRejectsInvalidStatusAndPaymentMethod() {
        PaymentDTO invalidPayment = PaymentDTO.builder()
                .memberId(1L)
                .planId(1L)
                .amount(1200.0)
                .paymentDate(LocalDate.now())
                .status("DONE")
                .paymentMethod("CHEQUE")
                .build();

        Set<String> violatedFields = validator.validate(invalidPayment).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());

        assertTrue(violatedFields.contains("status"));
        assertTrue(violatedFields.contains("paymentMethod"));
    }

    @Test
    void paymentDtoAcceptsValidStatusAndPaymentMethod() {
        PaymentDTO validPayment = PaymentDTO.builder()
                .memberId(1L)
                .planId(1L)
                .amount(1200.0)
                .paymentDate(LocalDate.now())
                .status("PAID")
                .paymentMethod("UPI")
                .build();

        Set<ConstraintViolation<PaymentDTO>> violations = validator.validate(validPayment);
        assertTrue(violations.isEmpty());
    }
}
