package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.DepartmentDto;
import com.rkt.dms.entity.DepartmentEntity;
import com.rkt.dms.repository.DepartmentRepository;
import com.rkt.dms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {

        DepartmentEntity dept = DepartmentEntity.builder()
                .name(dto.getName())
                .build();

        DepartmentEntity saved = departmentRepository.save(dept);

        return DepartmentDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .build();
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(d -> DepartmentDto.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .build())
                .toList();
    }
}
