package org.example.expensetracker.dto;

import lombok.Data;
import org.example.expensetracker.entity.ReminderType;

import java.time.LocalDate;

@Data
public class ReminderRequest {
    private String title;
    private String message;
    private LocalDate dueDate;
    private ReminderType type;
}
