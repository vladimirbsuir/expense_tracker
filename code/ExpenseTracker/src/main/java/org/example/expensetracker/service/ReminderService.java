package org.example.expensetracker.service;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.ReminderRequest;
import org.example.expensetracker.dto.ReminderResponse;
import org.example.expensetracker.entity.Reminder;
import org.example.expensetracker.entity.ReminderType;
import org.example.expensetracker.exception.ReminderNotFoundException;
import org.example.expensetracker.repository.ReminderRepository;
import org.example.expensetracker.mapper.ReminderMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReminderService {
    private final ReminderRepository reminderRepository;
    private final ReminderMapper reminderMapper;

    public ReminderResponse createReminder(ReminderRequest reminderRequest) {
        Reminder reminder = reminderMapper.toEntity(reminderRequest);
        reminder.setActive(true);
        reminder = reminderRepository.save(reminder);

        return reminderMapper.toResponse(reminder);
    }

    public Page<ReminderResponse> getAllReminders(Pageable pageable) {
        return reminderRepository.findAll(pageable).map(reminderMapper::toResponse);
    }

    public Page<ReminderResponse> getRemindersByStatus(ReminderType type, Pageable pageable) {
        return reminderRepository.findByType(type, pageable).map(reminderMapper::toResponse);
    }

    public Page<ReminderResponse> getRemindersByActivity(boolean isActive, Pageable pageable) {
        return reminderRepository.findByActive(isActive, pageable).map(reminderMapper::toResponse);
    }

    public Page<ReminderResponse> getRemindersByDate(LocalDate date, Pageable pageable) {
        return reminderRepository.findByDate(date, pageable).map(reminderMapper::toResponse);
    }

    public ReminderResponse getReminderById(Long id) {
        return reminderMapper.toResponse(reminderRepository.findById(id)
                .orElseThrow(() -> new ReminderNotFoundException("Reminder not found")));
    }

    public ReminderResponse updateReminderById(Long id, ReminderRequest reminderRequest) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(
                () -> new ReminderNotFoundException("Reminder not found"));

        if (reminderRequest.getType() != null) {
            reminder.setType(reminderRequest.getType());
        }
        if (reminderRequest.getTitle() != null) {
            reminder.setTitle(reminderRequest.getTitle());
        }
        if (reminderRequest.getMessage() != null) {
            reminder.setMessage(reminderRequest.getMessage());
        }
        if (reminderRequest.getActive() != null) {
            reminder.setActive(reminderRequest.getActive());
        }

        return reminderMapper.toResponse(reminderRepository.save(reminder));
    }

    public void deleteReminder(Long id) {
        if (!reminderRepository.existsById(id)) {
            throw new ReminderNotFoundException("Reminder not found");
        }

        reminderRepository.deleteById(id);
    }

    public void deactivateReminder(Long id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ReminderNotFoundException("Reminder not found"));
        reminder.setActive(false);
        reminderRepository.save(reminder);
    }
}
