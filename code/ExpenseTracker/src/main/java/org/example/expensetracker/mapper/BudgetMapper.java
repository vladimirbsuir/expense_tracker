package org.example.expensetracker.mapper;

import org.example.expensetracker.dto.BudgetRequest;
import org.example.expensetracker.dto.BudgetResponse;
import org.example.expensetracker.entity.Budget;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BudgetMapper {

    Budget toEntity(BudgetRequest budgetRequest);
    BudgetResponse toResponse(Budget budget);
}
