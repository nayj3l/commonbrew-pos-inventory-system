package com.commonbrew.pos.service;

import org.springframework.stereotype.Service;

import com.commonbrew.pos.dto.response.BootstrapResponse;
import com.commonbrew.pos.repository.IngredientRepo;
import com.commonbrew.pos.repository.InventoryStockRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BootstrapService {
    private final IngredientRepo ingredientRepo;
    private final InventoryStockRepo stockRepo;

    public BootstrapResponse load() {
        BootstrapResponse resp = new BootstrapResponse();
        resp.ingredients = ingredientRepo.findAll();
        resp.stocks = stockRepo.findAll();
        return resp;
    }
}
