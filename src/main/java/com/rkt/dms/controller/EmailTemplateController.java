package com.rkt.dms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.EmailTemplateDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.EmailTemplateService;



@RestController
@CrossOrigin("*")
@RequestMapping("/emailTemplate")
// @Tag(name = "Email Template", description = "Email template management APIs")
public class EmailTemplateController {
    
     @Autowired
    private EmailTemplateService emailTempService;

    @GetMapping("")
    public String home() {
        return "Welcome to Email Template";
    }

    // Get All Email Template info
    @GetMapping("/emailTemplate")
    public ResponseEntity<Object> GetEmailTemplate() {
        try {
            List<EmailTemplateDto> result = emailTempService.getAllEmailTemplate();
            return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, result);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    // Get Email Template info By ID
    @GetMapping("/emailTemplate/{id}")
    public ResponseEntity<Object> GetEmailTemplatebyid(@PathVariable Long id) {
        try {
            EmailTemplateDto result = emailTempService.getEmailTemplatebyid(id);
            if (result.equals(null)) {
                return ResponseHandler.generateResponse("Tag Status details not found", HttpStatus.NO_CONTENT, result);
            } else {
                return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    // Add New Email Template
    @PostMapping("/add")
    public ResponseEntity<Object> AddTemplate(@RequestBody EmailTemplateDto params) {
        try {
            EmailTemplateDto result = emailTempService.addEmailTemplate(params);
            if (result.equals(null)) {
                return ResponseHandler.generateResponse("Error: Status Not Created", HttpStatus.NO_CONTENT, result);
            } else {
                return ResponseHandler.generateResponse("Status Created Successfully!", HttpStatus.OK, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> UpdateEmailTemplate(@PathVariable Long id, @RequestBody EmailTemplateDto params) {
        try {
            EmailTemplateDto result = emailTempService.updateEmailTemplate(params, id);
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
       public ResponseEntity<Object> DeleteEmailTemplate(@PathVariable Long id) {
           try {
               String result = emailTempService.deleteEmailTemplate(id);
               return ResponseHandler.generateResponse("Email Template Status Deleted!", HttpStatus.OK, result);
           } catch (Exception e) {
               return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
           }
       }
}
