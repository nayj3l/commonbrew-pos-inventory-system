package com.commonbrew.pos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commonbrew.pos.dto.Ingredient;
import com.commonbrew.pos.dto.InventoryEvent;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;

public interface InventoryEventRepo extends JpaRepository<InventoryEvent, Long> {
    boolean existsByEventId(String eventId);

    Page<InventoryEvent> findByIngredientAndOccurredAtBetweenOrderByOccurredAtDesc(
            Ingredient ingredient, Instant from, Instant to, Pageable pageable);
}
