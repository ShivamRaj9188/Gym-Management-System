package com.in.GymManagementSystem;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.entity.Trainer;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.repository.TrainerRepository;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;

    @Override
    public void run(String... args) {

        if (memberRepository.count() == 0) {
            memberRepository.save(new Member(null, "Rahul", "Gold", true));
            memberRepository.save(new Member(null, "Amit", "Silver", false));
            memberRepository.save(new Member(null, "Priya", "Gold", true));
        }

        if (trainerRepository.count() == 0) {
            trainerRepository.save(new Trainer(null, "John", "Strength"));
            trainerRepository.save(new Trainer(null, "David", "Cardio"));
        }
    }
}