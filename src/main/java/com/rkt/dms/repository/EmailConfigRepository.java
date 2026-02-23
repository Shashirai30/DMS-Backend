package com.rkt.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkt.dms.entity.EmailConfigEntity;



public interface EmailConfigRepository extends JpaRepository<EmailConfigEntity,Long>{
    EmailConfigEntity findByName(String name);
}
