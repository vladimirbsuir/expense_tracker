package org.example.expensetracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "expense")
@RequiredArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private Float amount;

    @Column
    private LocalDate date;

    @Column(length = 512)
    private String description;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Category category;

    @Column
    @Enumerated(EnumType.STRING)
    private ExpenseType type;
}