package org.example.expensetracker.mapper;

import org.example.expensetracker.dto.ExpenseRequest;
import org.example.expensetracker.dto.ExpenseResponse;
import org.example.expensetracker.entity.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ExpenseMapper {

    Expense toEntity(ExpenseRequest expenseRequest);
    ExpenseResponse toResponse(Expense expense);
}
