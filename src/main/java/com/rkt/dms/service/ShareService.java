package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.ShareUserDto;

public interface ShareService {
    public List<String> shareDocumentViaLink(Long documentId,String role,Long folderId, List<ShareUserDto> users,String subject , String body) throws Exception;
}
