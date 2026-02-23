package com.rkt.dms.mapper;

import com.rkt.dms.dto.MenuItemDto;
import com.rkt.dms.entity.MenuItemEntity;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MenuItemMapper {

    public MenuItemEntity toEntity(MenuItemDto dto) {
        return new MenuItemEntity(
                dto.getId(),
                dto.getKey(),
                dto.getPath(),
                dto.getTitle(),
                dto.getTranslateKey(),
                dto.getIcon(),
                dto.getType(),
                dto.getAuthority(),
                dto.getSubMenu() != null ? dto.getSubMenu().stream().map(this::toEntity).collect(Collectors.toList()) : null
        );
    }

    public MenuItemDto toDto(MenuItemEntity entity) {
        return new MenuItemDto(
                entity.getId(),
                entity.getMenuKey(),
                entity.getPath(),
                entity.getTitle(),
                entity.getTranslateKey(),
                entity.getIcon(),
                entity.getType(),
                entity.getAuthority(),
                entity.getSubMenu() != null ? entity.getSubMenu().stream().map(this::toDto).collect(Collectors.toList()) : null
        );
    }

}
