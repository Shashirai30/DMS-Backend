package com.rkt.dms.cache;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.rkt.dms.entity.ConfigDMSEntity;
import com.rkt.dms.repository.ConfigDMSRepository;

import jakarta.annotation.PostConstruct;

@Component
public class JWTCredential {

    @Autowired
    private ConfigDMSRepository configDMSRepository;

    public Map<String, String> appCache;

    @PostConstruct
    public void init(){
        appCache = new HashMap<>();
        List<ConfigDMSEntity> all = configDMSRepository.findAll();
        for (ConfigDMSEntity configDMSEntity : all) {
            appCache.put(configDMSEntity.getKeys(), configDMSEntity.getValue());
        }
    }
}
