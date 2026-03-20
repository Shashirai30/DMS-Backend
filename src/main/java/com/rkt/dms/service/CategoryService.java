package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.CategoryDto;

public interface CategoryService  {
    CategoryDto create(CategoryDto dto);

    List<CategoryDto> getAll();

    CategoryDto getById(Long id);

    CategoryDto update(Long id, CategoryDto dto);

    void delete(Long id);
}
