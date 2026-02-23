package com.rkt.dms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemDto {
    private long id;
    private String key;
    private String path;
    private String title;
    private String translateKey;
    private String icon;
    private String type;
    private List<String> authority;
    private List<MenuItemDto> subMenu;
}
