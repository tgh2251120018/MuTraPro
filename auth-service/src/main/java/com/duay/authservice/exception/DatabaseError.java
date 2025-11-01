package com.duay.authservice.exception;

public class DatabaseError extends RuntimeException {

    public DatabaseError(String message) {
        super(message);
    }
}
