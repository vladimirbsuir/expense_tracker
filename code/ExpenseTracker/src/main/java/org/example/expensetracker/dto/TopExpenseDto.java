package org.example.expensetracker.dto;

import lombok.Data;
import org.example.expensetracker.entity.Category;
import java.time.LocalDate;

@Data
public class TopExpenseDto {
    private String name;
    private String description;
    private Double amount;
    private Category category;
    private LocalDate date;

    public TopExpenseDto(String name, String description, Double amount, Category category, LocalDate date) {
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
    }
}
