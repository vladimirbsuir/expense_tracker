package org.example.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.BudgetRequest;
import org.example.expensetracker.entity.Budget;
import org.example.expensetracker.service.BudgetService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/budgets")
public class BudgetController {
    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody BudgetRequest budget) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.createBudget(budget));
    }

    @PutMapping("/{budgetId}/category/{categoryId}")
    public ResponseEntity<Budget> assignBudgetToCategory(@PathVariable Long budgetId, @PathVariable Long categoryId) {
        return ResponseEntity.ok(budgetService.assignBudgetToCategory(budgetId, categoryId));
    }

    @GetMapping
    public ResponseEntity<Page<Budget>> getAllBudgets(Pageable pageable) {
        return ResponseEntity.ok(budgetService.findAllBudgets(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.findBudgetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @RequestBody BudgetRequest budget) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);

        return ResponseEntity.noContent().build();
    }
}
