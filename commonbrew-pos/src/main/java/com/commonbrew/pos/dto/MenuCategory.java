package com.commonbrew.pos.dto;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MenuCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
