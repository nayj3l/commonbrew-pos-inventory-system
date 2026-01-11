package com.commonbrew.pos.repository;

import com.commonbrew.pos.dto.Ingredient;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IngredientRepo extends JpaRepository<Ingredient, Long> {
    Optional<Ingredient> findByName(String name);
}
