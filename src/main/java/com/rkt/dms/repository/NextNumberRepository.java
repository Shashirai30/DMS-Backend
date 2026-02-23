package com.rkt.dms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkt.dms.entity.NextNumberEntity;

public interface NextNumberRepository extends JpaRepository<NextNumberEntity,Long>{
    NextNumberEntity findByYear(int year);
    NextNumberEntity findById(long id);
    List<NextNumberEntity> findBydocId(String docId);
    Optional<NextNumberEntity> findFirstBydocId(String docId);
}
