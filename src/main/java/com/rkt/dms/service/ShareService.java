package com.rkt.dms.service;


public interface ShareService {
    public String shareDocumentViaLink(Long documentId, String role, int expiryDays,String userName);
}
