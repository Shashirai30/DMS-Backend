package com.rkt.dms.repository;

import com.rkt.dms.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

    @Query(
            value = "SELECT * FROM roles WHERE department_id = :deptId",
            nativeQuery = true
    )
    List<RoleEntity> findAllByDepartmentId(@Param("deptId") Long departmentId);
}
