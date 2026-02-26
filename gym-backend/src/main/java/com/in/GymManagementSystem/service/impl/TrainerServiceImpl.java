package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.dto.TrainerDTO;
import com.in.GymManagementSystem.entity.Trainer;
import com.in.GymManagementSystem.repository.TrainerRepository;
import com.in.GymManagementSystem.services.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;

    @Override
    public List<TrainerDTO> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TrainerDTO getTrainerById(Long id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        return convertToDTO(trainer);
    }

    @Override
    @Transactional
    public TrainerDTO createTrainer(TrainerDTO trainerDTO) {
        String normalizedEmail = normalizeEmail(trainerDTO.getEmail());
        String normalizedPhone = normalizePhone(trainerDTO.getPhone());
        ensureUniqueTrainerContact(normalizedEmail, normalizedPhone, null);

        Trainer trainer = Trainer.builder()
                .name(trainerDTO.getName())
                .specialization(trainerDTO.getSpecialization())
                .email(normalizedEmail)
                .phone(normalizedPhone)
                .build();

        trainer = trainerRepository.save(trainer);
        return convertToDTO(trainer);
    }

    @Override
    @Transactional
    public TrainerDTO updateTrainer(Long id, TrainerDTO trainerDTO) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        String normalizedEmail = normalizeEmail(trainerDTO.getEmail());
        String normalizedPhone = normalizePhone(trainerDTO.getPhone());
        ensureUniqueTrainerContact(normalizedEmail, normalizedPhone, id);

        trainer.setName(trainerDTO.getName());
        trainer.setSpecialization(trainerDTO.getSpecialization());
        trainer.setEmail(normalizedEmail);
        trainer.setPhone(normalizedPhone);

        trainer = trainerRepository.save(trainer);
        return convertToDTO(trainer);
    }

    @Override
    public void deleteTrainer(Long id) {
        trainerRepository.deleteById(id);
    }

    private TrainerDTO convertToDTO(Trainer trainer) {
        return TrainerDTO.builder()
                .id(trainer.getId())
                .name(trainer.getName())
                .specialization(trainer.getSpecialization())
                .email(trainer.getEmail())
                .phone(trainer.getPhone())
                .memberCount(trainer.getMembers() != null ? trainer.getMembers().size() : 0)
                .build();
    }

    private void ensureUniqueTrainerContact(String email, String phone, Long currentId) {
        boolean emailExists = currentId == null
                ? trainerRepository.existsByEmailIgnoreCase(email)
                : trainerRepository.existsByEmailIgnoreCaseAndIdNot(email, currentId);
        if (emailExists) {
            throw new IllegalArgumentException("Trainer email already exists.");
        }

        boolean phoneExists = currentId == null
                ? trainerRepository.existsByPhone(phone)
                : trainerRepository.existsByPhoneAndIdNot(phone, currentId);
        if (phoneExists) {
            throw new IllegalArgumentException("Trainer phone already exists.");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizePhone(String phone) {
        return phone == null ? null : phone.trim();
    }
}
