package org.example.expensetracker.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BudgetRequest {
    private Long id;
    private Float amount;
    private LocalDate period;
}
