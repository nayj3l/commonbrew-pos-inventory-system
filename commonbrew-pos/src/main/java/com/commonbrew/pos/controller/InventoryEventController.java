package com.commonbrew.pos.controller;

import com.commonbrew.pos.dto.Ingredient;
import com.commonbrew.pos.repository.*;
import com.commonbrew.pos.service.InventoryEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryEventController {

    private final InventoryEventService service;
    private final InventoryEventRepo eventRepo;
    private final IngredientRepo ingredientRepo;

    // POST /api/inventory/events (batch append-and-apply)
    @PostMapping("/events")
    public ResponseEntity<?> ingest(@RequestBody List<InventoryEventService.InventoryEventDto> events)
            throws Exception {
        for (var e : events)
            service.appendAndApply(e);
        return ResponseEntity.ok().build();
    }

    // GET /api/inventory/{ingredientId}/ledger?from=...&to=...&page=0&size=50
    @GetMapping("/{ingredientId}/ledger")
    public ResponseEntity<?> ledger(@PathVariable Long ingredientId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Ingredient ing = ingredientRepo.findById(ingredientId).orElseThrow();
        Instant f = (from != null) ? Instant.parse(from) : Instant.EPOCH;
        Instant t = (to != null) ? Instant.parse(to) : Instant.now();
        Pageable pageable = PageRequest.of(page, size);
        var pageRes = eventRepo.findByIngredientAndOccurredAtBetweenOrderByOccurredAtDesc(ing, f, t, pageable);
        return ResponseEntity.ok(pageRes);
    }
}
