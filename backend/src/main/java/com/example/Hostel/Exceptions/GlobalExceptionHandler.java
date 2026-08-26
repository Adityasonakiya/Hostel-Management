package com.example.Hostel.Exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> AuthenticationExceptionHandler(AuthenticationException ex){
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> ResourceNotFoundExceptionHandler(ResourceNotFoundException ex){
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateDataException.class)
    public ResponseEntity<String> DuplicateDataExceptionHandler(DuplicateDataException ex){
        return ResponseEntity.status(409).body(ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> RuntimeExceptionHandler(RuntimeException ex){
        return ResponseEntity.status(500).body("Some Error Occured");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> ExceptionHandler(Exception ex){
        return ResponseEntity.status(500).body("Some Error Occured");
    }
}
