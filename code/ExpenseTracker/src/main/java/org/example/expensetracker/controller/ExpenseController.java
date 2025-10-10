package org.example.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.ExpenseRequest;
import org.example.expensetracker.dto.ExpenseResponse;
import org.example.expensetracker.entity.Expense;
import org.example.expensetracker.entity.ExpenseType;
import org.example.expensetracker.service.ExpenseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping()
    public ResponseEntity<Expense> createExpense(@RequestBody ExpenseRequest expense) {
        return new ResponseEntity<>(expenseService.createExpense(expense), HttpStatus.CREATED);
    }

    @PutMapping("/{expenseId}/category/{categoryId}")
    public ResponseEntity<Expense> setCategoryToExpense(@PathVariable Long expenseId, @PathVariable Long categoryId) {
        return ResponseEntity.ok(expenseService.setCategoryToExpense(expenseId, categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @GetMapping("/period")
    public ResponseEntity<Page<ExpenseResponse>> getExpensesByPeriod(@RequestParam("startDate") LocalDate startDate,
                                                                     @RequestParam("endDate") LocalDate endDate,
                                                                     Pageable pageable) {
        return ResponseEntity.ok(expenseService.getExpensesByPeriod(startDate, endDate, pageable));
    }

    @GetMapping("/by_type")
    public ResponseEntity<Page<ExpenseResponse>> getExpensesByType(@RequestParam("expenseType") ExpenseType expenseType,
                                                                   Pageable pageable) {
        return ResponseEntity.ok(expenseService.getExpensesByType(expenseType, pageable));
    }

    @GetMapping()
    public ResponseEntity<Page<Expense>> getAllExpenses(Pageable pageable) {
        return ResponseEntity.ok(expenseService.getAllExpenses(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);

        return ResponseEntity.noContent().build();
    }
}
