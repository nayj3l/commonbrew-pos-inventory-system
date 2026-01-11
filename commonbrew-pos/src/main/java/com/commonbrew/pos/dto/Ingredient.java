package com.commonbrew.pos.dto;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. "Milk", "Powder: Chocolate"

    @Column(nullable = false)
    private String unit; // g, ml, pcs
}
