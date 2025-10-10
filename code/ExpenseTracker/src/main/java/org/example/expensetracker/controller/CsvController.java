package org.example.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.service.CsvService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/csv")
public class CsvController {
    private final CsvService csvService;

    @GetMapping("/export/expenses")
    public ResponseEntity<Resource> exportExpenses() {
        byte[] csvBytes = csvService.exportExpensesToCsv();
        ByteArrayResource resource = new ByteArrayResource(csvBytes);

        return ResponseEntity.ok() .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=expenses.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(csvBytes.length)
                .body(resource);
    }

    @PostMapping("/import/expenses")
    public ResponseEntity<String> importExpenses(@RequestParam("file") MultipartFile file) {
        try {
            csvService.importExpensesFromCsv(file);
            return ResponseEntity.ok("Import was finished successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Import error: " + e.getMessage());
        }

    }
}
