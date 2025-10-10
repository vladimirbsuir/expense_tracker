package org.example.expensetracker.dto;

import lombok.Data;
import org.example.expensetracker.entity.ReminderType;
import java.time.LocalDate;

@Data
public class ReminderResponse {
    private Long id;
    private String title;
    private String message;
    private LocalDate dueDate;
    private ReminderType type;
    private boolean active;
}
