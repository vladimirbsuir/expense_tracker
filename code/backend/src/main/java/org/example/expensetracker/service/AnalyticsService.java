package org.example.expensetracker.service;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.DailyExpenseDto;
import org.example.expensetracker.dto.ExpenseReportDto;
import org.example.expensetracker.dto.ExpenseResponse;
import org.example.expensetracker.entity.Expense;
import org.example.expensetracker.mapper.ExpenseMapper;
import org.example.expensetracker.repository.ExpenseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final ExpenseMapper expenseMapper;
    private final ExpenseRepository expenseRepository;

    public Page<ExpenseReportDto> getExpensesByCategory(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return expenseRepository.findTotalExpensesByCategoryBetweenDates(startDate, endDate, pageable);
    }

    public Page<DailyExpenseDto> getDailyExpenses(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return expenseRepository.findDailyExpensesBetweenDates(startDate, endDate, pageable);
    }

    public Page<ExpenseResponse> getTopExpenses(Integer limit, Pageable pageable) {
        return expenseRepository.findTopExpenses(limit, pageable).map(expenseMapper::toResponse);
    }

    public Float getTotalBalance() {
        Float totalExpenses = expenseRepository.findAll().stream()
                .map(Expense::getAmount)
                .reduce(0f, Float::sum);
        return -totalExpenses;
    }
}
