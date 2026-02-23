package com.rkt.dms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.EmailConfigDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.EmailConfigService;

@RestController
@RequestMapping("/emailConfig")
public class EmailConfigController {
    
    @Autowired
    private EmailConfigService emailService;

    @GetMapping("")
    public String home() {
        return "Welcome to Email Configration";
    }

    // Get All Email Config info
    @GetMapping("/emailConfigs")
    public ResponseEntity<Object> GetEmailConfig(@RequestParam(required = false,defaultValue = "0") Long id) {
        try {
            List<EmailConfigDto> result = emailService.getEmail(id);
            return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, result);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    // Add New Email Config
    @PostMapping("/add")
    public ResponseEntity<Object> AddTag(@RequestBody EmailConfigDto params) {
        try {
            EmailConfigDto result = emailService.addEmail(params);
            if (result.equals(null)) {
                return ResponseHandler.generateResponse("Error: Email Config Not Created", HttpStatus.NO_CONTENT, result);
            } else {
                return ResponseHandler.generateResponse("Email Config Created Successfully!", HttpStatus.OK, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> UpdateEmail(@PathVariable Long id, @RequestBody EmailConfigDto params) {
        try {
            EmailConfigDto result = emailService.updateEmail(params, id);
            if (result.equals(null)) {
                return ResponseHandler.generateResponse("Please Check the Request Data", HttpStatus.BAD_REQUEST, result);
            } else {
                return ResponseHandler.generateResponse("Successfully Updated", HttpStatus.OK, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

       // Delete
       @DeleteMapping("/delete/{id}")
       public ResponseEntity<Object> DeleteEmail(@PathVariable Long id) {
           try {
               String result = emailService.deleteEmail(id);
               return ResponseHandler.generateResponse("Email Config Deleted!", HttpStatus.OK, result);
           } catch (Exception e) {
               return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
           }
       }
}
