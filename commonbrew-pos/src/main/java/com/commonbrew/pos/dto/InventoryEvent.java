package com.commonbrew.pos.dto;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(indexes = {
        @Index(name = "idx_event_unique", columnList = "eventId", unique = true),
        @Index(name = "idx_ing_occ", columnList = "ingredient_id, occurredAt")
})
public class InventoryEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false)
    private String type; // GOODS_RECEIPT, ADJUSTMENT, COUNT, TRANSFER_IN, TRANSFER_OUT, SALE_CONSUMPTION

    @ManyToOne(optional = false)
    private Ingredient ingredient;

    @Column(nullable = false, precision = 18, scale = 3)
    private BigDecimal delta;

    @Column(nullable = false)
    private String unit;

    private String reason;
    private String reference;
    private String actor;
    private String source;

    @Lob
    private String metadataJson;

    @Column(nullable = false)
    private Instant occurredAt;
    @Column(nullable = false)
    private Instant receivedAt = Instant.now();

}
