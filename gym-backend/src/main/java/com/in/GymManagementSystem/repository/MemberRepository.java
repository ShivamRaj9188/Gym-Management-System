package com.in.GymManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.in.GymManagementSystem.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    long countByActiveTrue();
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    boolean existsByPhoneAndIdNot(String phone, Long id);
}
