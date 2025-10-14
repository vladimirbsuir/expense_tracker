package org.example.expensetracker.mapper;

import org.example.expensetracker.dto.ReminderRequest;
import org.example.expensetracker.dto.ReminderResponse;
import org.example.expensetracker.entity.Reminder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ReminderMapper {

    @Mapping(source = "dueDate", target = "date")
    Reminder toEntity(ReminderRequest reminderRequest);

    @Mapping(source = "date", target = "dueDate")
    ReminderResponse toResponse(Reminder reminder);
}
