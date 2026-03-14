package com.rkt.dms.dto;

import java.time.LocalDateTime;

public interface LinkSharedDocumentDto {

    String getDocumentNumber();

    String getDocumentName();

    Long getSize();

    String getFileType();

    String getShareToken();

    String getSharedBy();

    LocalDateTime getExpiryDate();

    Boolean getIsViewed();

}