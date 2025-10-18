package org.example.expensetracker.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DailyExpenseDto {
    private LocalDate date;
    private Double totalAmount;

    public DailyExpenseDto(LocalDate date, Double totalAmount) {
        this.date = date;
        this.totalAmount = totalAmount;
    }
}
