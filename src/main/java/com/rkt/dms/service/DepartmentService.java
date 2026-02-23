package com.rkt.dms.service;

import com.rkt.dms.dto.DepartmentDto;

import java.util.List;

public interface DepartmentService
{
    DepartmentDto createDepartment(DepartmentDto dto);
    List<DepartmentDto> getAllDepartments();
}


