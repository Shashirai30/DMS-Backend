package com.rkt.dms.serviceImpl;


import com.rkt.dms.dto.document.LatestShareDocDto;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.LatestShareDocEntity;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.repository.document.LatestShareDocRepository;
import com.rkt.dms.service.LatestShareDocService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LatestShareDocServiceImpl implements LatestShareDocService {

    private final LatestShareDocRepository repository;
    private final DocumentRepository documentRepository;

    @Override
    public LatestShareDocDto create(LatestShareDocDto dto) {

        DocumentEntity document = documentRepository.findById(dto.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found"));

        LatestShareDocEntity entity = LatestShareDocEntity.builder()
                .role(dto.getRole())
                .isLinkShare(dto.isLinkShare())
                .sharedBy(dto.getSharedBy())
                .sharedWith(dto.getSharedWith())
                .sharedAt(dto.getSharedAt())
                .isViewed(dto.getIsViewed())
                .folderId(dto.getFolderId())
                .document(document)
                .build();

        entity = repository.save(entity);

        dto.setId(entity.getId());

        return dto;
    }

    @Override
    public List<LatestShareDocDto> getAll() {

        return repository.findAll()
                .stream()
                .map(entity -> LatestShareDocDto.builder()
                        .id(entity.getId())
                        .role(entity.getRole())
                        .isLinkShare(entity.isLinkShare())
                        .sharedBy(entity.getSharedBy())
                        .sharedWith(entity.getSharedWith())
                        .sharedAt(entity.getSharedAt())
                        .isViewed(entity.getIsViewed())
                        .folderId(entity.getFolderId())
                        .documentId(entity.getDocument().getId())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public LatestShareDocDto getById(Long id) {

        LatestShareDocEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found"));

        return LatestShareDocDto.builder()
                .id(entity.getId())
                .role(entity.getRole())
                .isLinkShare(entity.isLinkShare())
                .sharedBy(entity.getSharedBy())
                .sharedWith(entity.getSharedWith())
                .sharedAt(entity.getSharedAt())
                .isViewed(entity.getIsViewed())
                .folderId(entity.getFolderId())
                .documentId(entity.getDocument().getId())
                .build();
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}