package org.example.expensetracker.util;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.entity.Reminder;
import org.example.expensetracker.repository.ReminderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {
    private final ReminderRepository reminderRepository;

    @Scheduled(fixedRate = 86400000)
    public void checkAndSendReminders() {
        LocalDate today = LocalDate.now();
        List<Reminder> reminders = reminderRepository.findByActive(true);

        for (Reminder reminder : reminders) {
            if (reminder.getDate().isBefore(today)) {
                sendNotification(reminder);
                updateNextDate(reminder);
            }
        }
    }

    // Implement sending via SMS / push-ups
    private void sendNotification(Reminder reminder) {
        System.out.println("Reminder: " + reminder.getTitle());
    }

    private void updateNextDate(Reminder reminder) {
        switch (reminder.getType()) {
            case DAILY -> reminder.setDate(LocalDate.now().plusDays(1));
            case WEEKLY -> reminder.setDate(LocalDate.now().plusWeeks(1));
            case MONTHLY -> reminder.setDate(LocalDate.now().plusMonths(1));
            case ONE_TIME -> reminder.setActive(false);
        }

        reminderRepository.save(reminder);
    }
}
