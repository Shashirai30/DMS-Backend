package com.rkt.dms.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rkt.dms.dto.NextNumberDto;
import com.rkt.dms.repository.NextNumberRepository;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.NextNumberService;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/doc")
// @Tag(name = "Next Number", description = "Next number management APIs")
public class NextNumberController {

    @Autowired
    private NextNumberService nextNumberService;

    @Autowired
    private NextNumberRepository nextNumberRepository;

    @GetMapping("numbers")
    public ResponseEntity<Object> getNextNumber() {
        try {
            List<NextNumberDto> result = nextNumberService.getNextNumbers();
            return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, result);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
 
    @GetMapping("/find")
    public ResponseEntity<Object> getNNbyid(@RequestParam(required = false , name="docId") String docId,
    @RequestParam(required = false , name = "id") Long id, 
    @RequestParam(required = false , name = "getById") Long getById) {
        try {
            List<NextNumberDto> result = nextNumberService.getNNbyid(docId,id, getById);
            // if (result.getStatus()==0) {
            //     return ResponseHandler.generateResponse("Please enable the status", HttpStatus.BAD_REQUEST, result=null);
            // }
            // else
             if (!result.isEmpty()) {
                 return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, result);
                }
                else {
                 return ResponseHandler.generateResponse("Next Number details not found", HttpStatus.NOT_FOUND, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    // @GetMapping("number/{id}")
    // public ResponseEntity<Object> GetConfigbyid(@PathVariable int id) {
    //     try {
    //         String result = nextNumberService.getGateIdByYear(id);;
    //         if (result.equals(null)) {
    //             return ResponseHandler.generateResponse("Config details not found", HttpStatus.NO_CONTENT, result);
    //         } else {
    //             return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, result);
    //         }
    //     } catch (Exception e) {
    //         return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
    //     }
    // }

    // Add New Config
    @PostMapping("number")
    public ResponseEntity<Object> AddNN(@RequestBody NextNumberDto params) {
        if (nextNumberRepository.findById(params.getId()) !=null) {
            return ResponseHandler.generateResponse("Next Number Already Exist", HttpStatus.BAD_REQUEST, null);
        }
    
    else{
            try {
                NextNumberDto result = nextNumberService.addNewNN(params);
                if (result.equals(null)) {
                    return ResponseHandler.generateResponse("Error: Next number Not Created", HttpStatus.NO_CONTENT, result);
                } else {
                    return ResponseHandler.generateResponse("Next Number Created Successfully!", HttpStatus.OK, result);
                }
            } catch (Exception e) {
                return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
            }
        }

    }

    @PutMapping("/number/{id}")
    public ResponseEntity<Object> UpdateNN(@PathVariable Long id, @RequestBody NextNumberDto params) {
        try {
            NextNumberDto result = nextNumberService.updateNN(params, id);
            if (result.equals(null)) {
                return ResponseHandler.generateResponse("Please Check the Request Data", HttpStatus.BAD_REQUEST, result);
            } else {
                return ResponseHandler.generateResponse("Successfully Updated", HttpStatus.OK, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @PutMapping("/updateindex/{id}")
    public ResponseEntity<Object> updateIndex(@PathVariable Long id) {
        try {
            String result = nextNumberService.updateIndex(id);
            if (result.equals(null)) {
                return ResponseHandler.generateResponse("Please enable the status!", HttpStatus.BAD_REQUEST, result);
            } else {
                return ResponseHandler.generateResponse("Index Successfully Updated", HttpStatus.OK, result);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    // Delete
    @DeleteMapping("/number/{id}")
    public ResponseEntity<Object> DeleteNN(@PathVariable Long id) {
        try {
            String result = nextNumberService.deleteNN(id);
            return ResponseHandler.generateResponse("Next Number Deleted!", HttpStatus.OK, result);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


  
}