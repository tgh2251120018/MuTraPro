package com.duay.authservice.exception;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // Only include non-null fields in JSON output
public class ErrorResponse {

    private int statusCode;
    private LocalDateTime timestamp;
    private String message;
    private String path;
    private List<String> validationErrors; // Used for validation errors

    public ErrorResponse(int statusCode, String message, String path) {
        this.statusCode = statusCode;
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
