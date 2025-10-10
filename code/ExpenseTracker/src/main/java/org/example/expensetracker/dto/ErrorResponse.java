package org.example.expensetracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@Getter
@Setter
public class ErrorResponse {
    private String error;
    private String message;
    private int status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime timestamp;

    public ErrorResponse(HttpStatus status, String error, String message) {
        this.error = error;
        this.message = message;
        this.status = status.value();
        this.timestamp = LocalDateTime.now();
    }
}
