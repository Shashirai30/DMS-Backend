package com.rkt.dms.exception;

import jakarta.validation.ConstraintViolationException;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.rkt.dms.response.ResponseHandler;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleValidationException(ConstraintViolationException ex) {
        String violationMessage = ex.getConstraintViolations().stream()
            .map(violation -> violation.getMessage())
            .findFirst()
            .orElse("Validation error occurred");

        return ResponseHandler.generateResponse(violationMessage, HttpStatus.BAD_REQUEST, null);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NoHandlerFoundException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", "The requested resource was not found.");
        errorResponse.put("status", HttpStatus.NOT_FOUND.value());
        errorResponse.put("error", "Not Found");
        errorResponse.put("path", ex.getRequestURL());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex){

        String violationMessage = ex.getMessage();
        return ResponseHandler.generateResponse(violationMessage, HttpStatus.FORBIDDEN, null);
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex){

        String violationMessage = ex.getMessage();
        return ResponseHandler.generateResponse(violationMessage, HttpStatus.BAD_REQUEST, null);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<?> handleRuntimeException(DisabledException ex){

        String violationMessage = ex.getMessage();
        return ResponseHandler.generateResponse(violationMessage, HttpStatus.UNAUTHORIZED, null);
    }

}
