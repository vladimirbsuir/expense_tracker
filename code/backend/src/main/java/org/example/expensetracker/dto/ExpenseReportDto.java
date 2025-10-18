package org.example.expensetracker.dto;

import lombok.Data;

@Data
public class ExpenseReportDto {
    private String category;
    private Double totalAmount;

    public ExpenseReportDto(String category, Double totalAmount) {
        this.category = category;
        this.totalAmount = totalAmount;
    }
}
