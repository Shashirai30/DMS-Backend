package com.rkt.dms.repository;

import com.rkt.dms.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {

    @Query(
            value = "SELECT * FROM departments WHERE name = :name",
            nativeQuery = true
    )
    Optional<DepartmentEntity> findByName(@Param("name") String name);
}
