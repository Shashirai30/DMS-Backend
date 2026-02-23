package com.rkt.dms.cache;

import com.rkt.dms.entity.ConfigDMSEntity;
import com.rkt.dms.repository.ConfigDMSRepository;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Getter
public class JWTCredential {

    private final ConfigDMSRepository configDMSRepository;

    public Map<String, String> appCache;

    @PostConstruct
    public void init() {

        List<ConfigDMSEntity> configs =
                configDMSRepository.findAll();

        Map<String, String> cache =
                configs.stream()
                        .collect(Collectors.toMap(
                                ConfigDMSEntity::getKeys,
                                ConfigDMSEntity::getValue
                        ));

        validate(cache);

        appCache = Collections.unmodifiableMap(cache);
    }

    private void validate(Map<String, String> cache) {

        String secret = cache.get("jwtSecret");

        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                    "JWT secret missing or too weak. Minimum 32 characters required.");
        }
    }

    public String getJwtSecret() {
        return appCache.get("jwtSecret");
    }
}
