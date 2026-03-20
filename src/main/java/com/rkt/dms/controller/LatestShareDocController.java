package com.rkt.dms.controller;

import com.rkt.dms.dto.document.LatestShareDocDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.LatestShareDocService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/latest-share-doc")
@RequiredArgsConstructor
public class LatestShareDocController {

    private final LatestShareDocService service;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody LatestShareDocDto dto) {
        try {

            LatestShareDocDto data = service.create(dto);

            return ResponseHandler.generateResponse(
                    "Latest shared document created successfully",
                    HttpStatus.CREATED,
                    data);

        } catch (IllegalArgumentException e) {

            return ResponseHandler.generateResponse(
                    "Invalid request: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    null);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to create latest shared document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        try {

            List<LatestShareDocDto> data = service.getAll();

            return ResponseHandler.generateResponse(
                    "Latest shared documents fetched successfully",
                    HttpStatus.OK,
                    data);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch latest shared documents: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {

            LatestShareDocDto data = service.getById(id);

            return ResponseHandler.generateResponse(
                    "Latest shared document fetched successfully",
                    HttpStatus.OK,
                    data);

        } catch (IllegalArgumentException e) {

            return ResponseHandler.generateResponse(
                    "Invalid request: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    null);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch latest shared document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {

            service.delete(id);

            return ResponseHandler.generateResponse(
                    "Latest shared document deleted successfully",
                    HttpStatus.OK,
                    null);

        } catch (IllegalArgumentException e) {

            return ResponseHandler.generateResponse(
                    "Invalid request: " + e.getMessage(),
                    HttpStatus.BAD_REQUEST,
                    null);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to delete latest shared document: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }
}