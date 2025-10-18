package org.example.expensetracker.exception;

public class IncorrectSecurityParametersException extends RuntimeException {
    public IncorrectSecurityParametersException(String message) {
        super(message);
    }
}
