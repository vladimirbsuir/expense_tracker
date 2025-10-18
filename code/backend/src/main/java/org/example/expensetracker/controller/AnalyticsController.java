package org.example.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.DailyExpenseDto;
import org.example.expensetracker.dto.ExpenseReportDto;
import org.example.expensetracker.dto.ExpenseResponse;
import org.example.expensetracker.service.AnalyticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/balance")
    public ResponseEntity<Float> getTotalBalance() {
        return ResponseEntity.ok(analyticsService.getTotalBalance());
    }

    @GetMapping("/expenses/by_category")
    public ResponseEntity<Page<ExpenseReportDto>> getExpensesByCategory(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            Pageable pageable) {
        return ResponseEntity.ok(analyticsService.getExpensesByCategory(start, end, pageable));
    }

    @GetMapping("/expenses/daily")
    public ResponseEntity<Page<DailyExpenseDto>> getDailyExpenses(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            Pageable pageable) {
        return ResponseEntity.ok(analyticsService.getDailyExpenses(start, end, pageable));
    }

    @GetMapping("/expenses/top")
    public ResponseEntity<Page<ExpenseResponse>> getTopExpenses(
            @RequestParam(defaultValue = "5", required = false) Integer limit, Pageable pageable) {
        return ResponseEntity.ok(analyticsService.getTopExpenses(limit, pageable));
    }
}
