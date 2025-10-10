package org.example.expensetracker.repository;

import org.example.expensetracker.entity.Reminder;
import org.example.expensetracker.entity.ReminderType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByActive(boolean b);
    Page<Reminder> findByActive(boolean b, Pageable pageable);
    Page<Reminder> findByType(ReminderType type, Pageable pageable);
}
