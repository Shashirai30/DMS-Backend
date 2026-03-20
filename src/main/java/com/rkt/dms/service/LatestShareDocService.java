package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.document.LatestShareDocDto;

public interface LatestShareDocService {

    LatestShareDocDto create(LatestShareDocDto dto);

    List<LatestShareDocDto> getAll();

    LatestShareDocDto getById(Long id);

    void delete(Long id);
}