package com.in.GymManagementSystem.service;

import com.in.GymManagementSystem.dto.MemberDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface MemberService {
    List<MemberDTO> getAllMembers();

    Page<MemberDTO> getAllMembersPaged(Pageable pageable);

    MemberDTO getMemberById(Long id);

    MemberDTO createMember(MemberDTO memberDTO);

    MemberDTO updateMember(Long id, MemberDTO memberDTO);

    void deleteMember(Long id);

    MemberDTO assignTrainer(Long memberId, Long trainerId);

    MemberDTO removeTrainer(Long memberId, Long trainerId);
}
