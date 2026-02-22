package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.dto.MemberDTO;
import com.in.GymManagementSystem.services.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@RequestBody MemberDTO memberDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.createMember(memberDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @RequestBody MemberDTO memberDTO) {
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
