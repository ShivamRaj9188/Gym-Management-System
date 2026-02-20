package com.in.GymManagementSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.in.GymManagementSystem.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    long countByActiveTrue();
}