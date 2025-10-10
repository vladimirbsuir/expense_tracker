package org.example.expensetracker.dto;

import lombok.Data;

@Data
public class ExpenseCsvDto {
    private String name;
    private String amount;
    private String categoryName;
    private String description;
    private String date;
    private String budgetAmount;
}
