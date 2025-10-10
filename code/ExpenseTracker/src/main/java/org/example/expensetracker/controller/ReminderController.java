package org.example.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.ReminderRequest;
import org.example.expensetracker.service.ReminderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.expensetracker.dto.ReminderResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reminders")
public class ReminderController {
    private final ReminderService reminderService;

    @PostMapping
    public ResponseEntity<ReminderResponse> createReminder(@RequestBody ReminderRequest request) {
        return new ResponseEntity<>(reminderService.createReminder(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ReminderResponse>> getAllReminders(Pageable pageable) {
        return ResponseEntity.ok(reminderService.getAllReminders(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderResponse> getReminderById(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.getReminderById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<Void> deactivateReminder(@PathVariable Long id) {
        reminderService.deactivateReminder(id);

        return ResponseEntity.noContent().build();
    }
}
