package com.rkt.dms.dto;

public interface DocumentShareSummaryDto {

    Long getDocumentId();
    String getDocumentName();
    String getDocumentNumber();
    String getFileType();
    Long getSize();
    Long getTotalShared();

}