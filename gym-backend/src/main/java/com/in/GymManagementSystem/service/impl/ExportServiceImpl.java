package com.in.GymManagementSystem.service.impl;

import com.in.GymManagementSystem.entity.Member;
import com.in.GymManagementSystem.repository.MemberRepository;
import com.in.GymManagementSystem.service.ExportService;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportServiceImpl implements ExportService {

    private final MemberRepository memberRepository;

    @Override
    public byte[] exportMembersToExcel() {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Members");

            // Header
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Email");
            headerRow.createCell(3).setCellValue("Phone");
            headerRow.createCell(4).setCellValue("Active");

            List<Member> members = memberRepository.findAll();
            int rowIdx = 1;
            for (Member member : members) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(member.getId() != null ? member.getId().toString() : "");
                row.createCell(1).setCellValue(member.getName() != null ? member.getName() : "");
                row.createCell(2).setCellValue(member.getEmail() != null ? member.getEmail() : "");
                row.createCell(3).setCellValue(member.getPhone() != null ? member.getPhone() : "");
                row.createCell(4).setCellValue(member.isActive() ? "Yes" : "No");
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error creating Excel export", e);
            throw new RuntimeException("Error exporting Excel", e);
        }
    }

    @Override
    public byte[] exportMembersToPdf() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Members List"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.addCell("ID");
            table.addCell("Name");
            table.addCell("Email");
            table.addCell("Phone");
            table.addCell("Active");

            List<Member> members = memberRepository.findAll();
            for (Member member : members) {
                table.addCell(member.getId() != null ? String.valueOf(member.getId()) : "");
                table.addCell(member.getName() != null ? member.getName() : "");
                table.addCell(member.getEmail() != null ? member.getEmail() : "");
                table.addCell(member.getPhone() != null ? member.getPhone() : "");
                table.addCell(member.isActive() ? "Yes" : "No");
            }

            document.add(table);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error creating PDF export", e);
            throw new RuntimeException("Error exporting PDF", e);
        }
    }
}
