package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.RoleDto;
import com.rkt.dms.entity.DepartmentEntity;
import com.rkt.dms.entity.RoleEntity;
import com.rkt.dms.repository.DepartmentRepository;
import com.rkt.dms.repository.RoleRepository;
import com.rkt.dms.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public RoleDto createRole(RoleDto dto) {

        DepartmentEntity department =
                departmentRepository.findById(dto.getDepartmentId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Invalid departmentId"));

        RoleEntity role = RoleEntity.builder()
                .name(dto.getName())
                .department(department)
                .build();

        RoleEntity saved = roleRepository.save(role);

        return RoleDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .departmentId(department.getId())
                .build();
    }

    @Override
    public List<RoleDto> getRolesByDepartment(Long departmentId) {

        return roleRepository.findAllByDepartmentId(departmentId)
                .stream()
                .map(r -> RoleDto.builder()
                        .id(r.getId())
                        .name(r.getName())
                        .departmentId(r.getDepartment().getId())
                        .build())
                .toList();
    }
}

