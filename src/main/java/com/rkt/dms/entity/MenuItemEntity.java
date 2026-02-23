package com.rkt.dms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "menu_item")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id; // Unique identifier for each menu item

    @Column(name = "menu_key", nullable = false, length = 100)
    @NotBlank(message = "Key is mandatory")
    @Size(max = 100, message = "Key must not exceed 100 characters")
    private String menuKey; // Renamed from 'key' to 'menuKey' to avoid MySQL keyword conflict

    @Column(name = "path",  length = 255)
    // @NotBlank(message = "Path is mandatory")
    @Size(max = 255, message = "Path must not exceed 255 characters")
    private String path; // URL path for navigation

    @Column(name = "title", nullable = false, length = 200)
    @NotBlank(message = "Title is mandatory")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title; // Display title for the menu item

    @Column(name = "translate_key", nullable = false, length = 200)
    @NotBlank(message = "Translate Key is mandatory")
    @Size(max = 200, message = "Translate Key must not exceed 200 characters")
    private String translateKey; // Key for localization and translation

    @Column(name = "icon", nullable = false, length = 100)
    @NotBlank(message = "Icon is mandatory")
    @Size(max = 100, message = "Icon must not exceed 100 characters")
    private String icon; // Icon identifier for UI representation

    @Column(name = "type", nullable = false, length = 100)
    @NotBlank(message = "Type is mandatory")
    @Size(max = 100, message = "Type must not exceed 100 characters")
    private String type; // Type/category of the menu item

    @ElementCollection
    @CollectionTable(name = "menu_item_authority", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "authority")
    private List<String> authority; // List of user roles that have access to this menu item

    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name = "parent_id")
    private List<MenuItemEntity> subMenu; // Nested list of child menu items
}
