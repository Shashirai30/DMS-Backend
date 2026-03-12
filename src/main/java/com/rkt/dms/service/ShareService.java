package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.ShareUserDto;

public interface ShareService {
    public List<String> shareDocumentViaLink(Long documentId,String role, List<ShareUserDto> users);
}
