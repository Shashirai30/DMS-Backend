package com.rkt.dms.serviceImpl.dashboard;

import org.springframework.stereotype.Service;

import com.rkt.dms.dto.dashboard.DashboardStatsDto;
import com.rkt.dms.repository.dashboard.DashboardRepository;
import com.rkt.dms.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        return dashboardRepository.getDashboardStats();
    }
}