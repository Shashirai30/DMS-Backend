package com.rkt.dms.controller.dashboard;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkt.dms.dto.dashboard.DashboardStatsDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {

        try {

            DashboardStatsDto data = dashboardService.getDashboardStats();

            return ResponseHandler.generateResponse(
                    "Dashboard stats fetched successfully",
                    HttpStatus.OK,
                    data);

        } catch (Exception e) {

            return ResponseHandler.generateResponse(
                    "Failed to fetch dashboard stats: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null);
        }
    }
}