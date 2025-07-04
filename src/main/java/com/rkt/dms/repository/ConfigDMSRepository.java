package com.rkt.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkt.dms.entity.ConfigDMSEntity;

public interface ConfigDMSRepository extends JpaRepository<ConfigDMSEntity, Long> {

}
