package com.rkt.dms.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.CategoryDto;
import com.rkt.dms.entity.CategoryEntity;
import com.rkt.dms.repository.CategoryRepository;
import com.rkt.dms.service.CategoryService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository repository;

    @Override
    public CategoryDto create(CategoryDto dto) {

        CategoryEntity category = new CategoryEntity();
        category.setCode(dto.getCode());
        category.setName(dto.getName());

        CategoryEntity saved = repository.save(category);

        dto.setId(saved.getId());
        return dto;
    }

    @Override
    public List<CategoryDto> getAll() {

        List<CategoryEntity> list = repository.findAll();

        return list.stream().map(cat -> {
            CategoryDto dto = new CategoryDto();
            dto.setId(cat.getId());
            dto.setCode(cat.getCode());
            dto.setName(cat.getName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public CategoryDto getById(Long id) {

        CategoryEntity cat = repository.findById(id).orElseThrow();

        CategoryDto dto = new CategoryDto();
        dto.setId(cat.getId());
        dto.setCode(cat.getCode());
        dto.setName(cat.getName());

        return dto;
    }

    @Override
    public CategoryDto update(Long id, CategoryDto dto) {

        CategoryEntity cat = repository.findById(id).orElseThrow();

        cat.setCode(dto.getCode());
        cat.setName(dto.getName());

        CategoryEntity   updated = repository.save(cat);

        dto.setId(updated.getId());

        return dto;
    }

    @Override
    public void delete(Long id) {

        repository.deleteById(id);

    }
}