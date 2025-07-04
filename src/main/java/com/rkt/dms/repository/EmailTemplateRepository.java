package com.rkt.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkt.dms.entity.EmailTemplateEntity;


public interface EmailTemplateRepository extends JpaRepository<EmailTemplateEntity,Long> {
    EmailTemplateEntity findByName(String name);
}
