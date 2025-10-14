package org.example.expensetracker.repository;

import org.example.expensetracker.dto.DailyExpenseDto;
import org.example.expensetracker.dto.ExpenseReportDto;
import org.example.expensetracker.entity.Category;
import org.example.expensetracker.entity.Expense;
import org.example.expensetracker.entity.ExpenseType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Page<Expense> findByCategory(Category category, Pageable pageable);

    @Query("SELECT new org.example.expensetracker.dto.ExpenseReportDto(e.category.name, SUM(e.amount)) " +
            "FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate GROUP BY e.category.name")
    Page<ExpenseReportDto> findTotalExpensesByCategoryBetweenDates(@Param("startDate") LocalDate startDate,
                                                                   @Param("endDate") LocalDate endDate, Pageable pageable);

    @Query("SELECT new org.example.expensetracker.dto.DailyExpenseDto(e.date, SUM(e.amount)) " +
            "FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate GROUP BY e.date ORDER BY e.date ASC")
    Page<DailyExpenseDto> findDailyExpensesBetweenDates(@Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate,
                                                        Pageable pageable);

    @Query("SELECT e FROM Expense e ORDER By e.amount DESC")
    Page<Expense> findTopExpenses(@Param("limit") Integer limit, Pageable pageable);

    Page<Expense> findByDateBetween(LocalDate dateAfter, LocalDate dateBefore, Pageable pageable);

    Page<Expense> findByType(ExpenseType type, Pageable pageable);
}
