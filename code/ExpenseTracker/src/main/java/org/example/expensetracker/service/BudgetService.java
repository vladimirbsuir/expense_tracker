package org.example.expensetracker.service;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.BudgetRequest;
import org.example.expensetracker.dto.BudgetResponse;
import org.example.expensetracker.entity.Budget;
import org.example.expensetracker.entity.Category;
import org.example.expensetracker.exception.BudgetNotFoundException;
import org.example.expensetracker.repository.BudgetRepository;
import org.example.expensetracker.mapper.BudgetMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final CategoryService categoryService;
    private final BudgetMapper budgetMapper;

    public Budget createBudget(BudgetRequest budgetRequest) {
        Budget budget = budgetMapper.toEntity(budgetRequest);
        return budgetRepository.save(budget);
    }

    public Budget assignBudgetToCategory(Long budgetId, Long categoryId) {
        Budget budget = findBudgetById(budgetId);
        Category category = categoryService.findCategoryById(categoryId);

        budget.setCategory(category);
        category.setBudget(budget);

        return budgetRepository.save(budget);
    }

    public Budget findBudgetById(Long id) {
        return budgetRepository.findById(id).orElseThrow(() -> new BudgetNotFoundException("Budget not found"));
    }

    public Page<Budget> findAllBudgets(Pageable pageable) {
        return budgetRepository.findAll(pageable);
    }

    public Budget updateBudget(Long id, BudgetRequest budgetRequest) {
        Budget budget = findBudgetById(id);

        if (budgetRequest.getAmount() != null) budget.setAmount(budgetRequest.getAmount());
        if (budgetRequest.getPeriod() != null) budget.setPeriod(budgetRequest.getPeriod());

        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        Budget budget = findBudgetById(id);
        if (budget.getCategory() != null) {
            Category category = categoryService.findCategoryById(budget.getCategory().getId());
            category.setBudget(null);
        }

        budgetRepository.deleteById(id);
    }
}
