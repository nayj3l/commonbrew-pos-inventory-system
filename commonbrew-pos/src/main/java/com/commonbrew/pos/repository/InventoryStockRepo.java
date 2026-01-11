package com.commonbrew.pos.repository;

import com.commonbrew.pos.dto.Ingredient;
import com.commonbrew.pos.dto.InventoryStock;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InventoryStockRepo extends JpaRepository<InventoryStock, Long> {
    Optional<InventoryStock> findByIngredient(Ingredient ingredient);

    Optional<InventoryStock> findByIngredient_Id(Long ingredientId);
}
