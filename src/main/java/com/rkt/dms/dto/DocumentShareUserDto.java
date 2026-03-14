package com.rkt.dms.dto;

import java.time.LocalDateTime;

public interface DocumentShareUserDto {

    Long getDocumentId();

    String getDocumentName();

    String getSharedByName();

    String getSharedWithName();

    String getRole();

    LocalDateTime getSharedAt();

    Boolean getIsViewed();
    
    LocalDateTime getExpiryDate();
}
