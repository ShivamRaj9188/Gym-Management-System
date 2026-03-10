package com.in.GymManagementSystem.controller;

import com.in.GymManagementSystem.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/members/excel")
    public ResponseEntity<byte[]> exportMembersExcel() {
        byte[] data = exportService.exportMembersToExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=members.xlsx");
        headers.setContentType(
                MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    @GetMapping("/members/pdf")
    public ResponseEntity<byte[]> exportMembersPdf() {
        byte[] data = exportService.exportMembersToPdf();
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=members.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}
