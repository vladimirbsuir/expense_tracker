package org.example.expensetracker.dto;

import lombok.Data;
import org.example.expensetracker.entity.Category;
import java.time.LocalDate;

@Data
public class ExpenseResponse {
    private Long id;
    private String name;
    private Float amount;
    private LocalDate date;
    private String description;
    private Category category;
}
