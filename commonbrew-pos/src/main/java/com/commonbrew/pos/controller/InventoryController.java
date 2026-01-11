package com.commonbrew.pos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.commonbrew.pos.dto.InventoryStock;
import com.commonbrew.pos.repository.InventoryStockRepo;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryStockRepo stockRepo;

    // PUT /api/inventory/{ingredientId}/threshold body: { "minThreshold": 250.0 }
    @PutMapping("/{ingredientId}/threshold")
    public ResponseEntity<?> setThreshold(@PathVariable Long ingredientId, @RequestBody ThresholdDto body) {
        InventoryStock stock = stockRepo.findByIngredient_Id(ingredientId)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found: " + ingredientId));
        stock.setMinThreshold(BigDecimal.valueOf(body.minThreshold()));
        stockRepo.save(stock);
        return ResponseEntity.ok().build();
    }

    public record ThresholdDto(double minThreshold) {
    }
}
