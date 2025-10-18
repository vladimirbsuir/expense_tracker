package org.example.expensetracker.controller;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.ReminderRequest;
import org.example.expensetracker.entity.ReminderType;
import org.example.expensetracker.service.ReminderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.expensetracker.dto.ReminderResponse;
import java.time.LocalDate;

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

    @GetMapping("/by_date")
    public ResponseEntity<Page<ReminderResponse>> getRemindersByDate(@RequestParam("date") LocalDate date,
                                                                     Pageable pageable) {
        return ResponseEntity.ok(reminderService.getRemindersByDate(date, pageable));
    }

    @GetMapping("/by_status")
    public ResponseEntity<Page<ReminderResponse>> getRemindersByStatus(@RequestParam("status") ReminderType status,
                                                                       Pageable pageable) {
        return ResponseEntity.ok(reminderService.getRemindersByStatus(status, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderResponse> updateReminderById(@PathVariable Long id,
                                                               @RequestBody ReminderRequest request) {
        return ResponseEntity.ok(reminderService.updateReminderById(id, request));
    }

    @GetMapping("/by_activity")
    public ResponseEntity<Page<ReminderResponse>> getRemindersByActivity(@RequestParam("isActive") boolean isActive,
                                                                         Pageable pageable) {
        return ResponseEntity.ok(reminderService.getRemindersByActivity(isActive, pageable));
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
