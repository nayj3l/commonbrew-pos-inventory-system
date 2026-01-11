package com.commonbrew.pos.service;

import com.commonbrew.pos.dto.Ingredient;
import com.commonbrew.pos.dto.InventoryEvent;
import com.commonbrew.pos.dto.InventoryStock;
import com.commonbrew.pos.repository.*;

import tools.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class InventoryEventService {

  private final InventoryEventRepo eventRepo;
  private final InventoryStockRepo stockRepo;
  private final IngredientRepo ingredientRepo;
  private final ObjectMapper om = new ObjectMapper();

  public InventoryEventService(InventoryEventRepo eventRepo,
                               InventoryStockRepo stockRepo,
                               IngredientRepo ingredientRepo) {
    this.eventRepo = eventRepo;
    this.stockRepo = stockRepo;
    this.ingredientRepo = ingredientRepo;
  }

  @Transactional
  public InventoryStock appendAndApply(InventoryEventDto dto) throws Exception {
    if (eventRepo.existsByEventId(dto.eventId())) {
      // already applied; return current stock as is
      Ingredient ing = ingredientRepo.findById(dto.ingredientId())
          .orElseThrow(() -> new IllegalArgumentException("Ingredient not found"));
      return stockRepo.findByIngredient(ing)
          .orElseThrow(() -> new IllegalStateException("No stock row for ingredient"));
    }

    Ingredient ingredient = ingredientRepo.findById(dto.ingredientId())
        .orElseThrow(() -> new IllegalArgumentException("Ingredient not found"));

    // 1) append (immutable)
    InventoryEvent ev = new InventoryEvent();
    ev.setEventId(dto.eventId());
    ev.setType(dto.type());
    ev.setIngredient(ingredient);
    ev.setDelta(BigDecimal.valueOf(dto.delta()));
    ev.setUnit(dto.unit());
    ev.setReason(dto.reason());
    ev.setReference(dto.reference());
    ev.setActor(dto.actor());
    ev.setSource(dto.source());
    ev.setOccurredAt(dto.occurredAt() != null ? dto.occurredAt() : Instant.now());
    ev.setMetadataJson(dto.metadata() != null ? om.writeValueAsString(dto.metadata()) : null);
    eventRepo.save(ev);

    // 2) update projection (mutable)
    InventoryStock stock = stockRepo.findByIngredient(ingredient)
        .orElseThrow(() -> new IllegalStateException("No stock row for ingredient: " + ingredient.getName()));

    BigDecimal newQty = stock.getQuantity().add(ev.getDelta());
    if (newQty.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException("Resulting quantity cannot be negative for: " + ingredient.getName());
    }
    stock.setQuantity(newQty);
    return stockRepo.save(stock);
  }

  public record InventoryEventDto(
      String eventId, String type, Long ingredientId, double delta, String unit,
      String reason, String reference, String actor, String source,
      java.time.Instant occurredAt, Object metadata) {}
}
