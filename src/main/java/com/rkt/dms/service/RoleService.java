package com.rkt.dms.service;

import com.rkt.dms.dto.RoleDto;

import java.util.List;

public interface RoleService {
    RoleDto createRole(RoleDto dto);
    List<RoleDto> getRolesByDepartment(Long departmentId);
}
