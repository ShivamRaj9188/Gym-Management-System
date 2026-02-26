package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.MemberDTO;
import com.in.GymManagementSystem.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<Page<MemberDTO>> getAllMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sort) {
        size = Math.min(size, 100);
        return ResponseEntity.ok(memberService.getAllMembersPaged(PageRequest.of(page, size, Sort.by(sort))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@Valid @RequestBody MemberDTO memberDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.createMember(memberDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @Valid @RequestBody MemberDTO memberDTO) {
        return ResponseEntity.ok(memberService.updateMember(id, memberDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{memberId}/trainers/{trainerId}")
    public ResponseEntity<MemberDTO> assignTrainer(@PathVariable Long memberId, @PathVariable Long trainerId) {
        return ResponseEntity.ok(memberService.assignTrainer(memberId, trainerId));
    }

    @DeleteMapping("/{memberId}/trainers/{trainerId}")
    public ResponseEntity<MemberDTO> removeTrainer(@PathVariable Long memberId, @PathVariable Long trainerId) {
        return ResponseEntity.ok(memberService.removeTrainer(memberId, trainerId));
    }
}
