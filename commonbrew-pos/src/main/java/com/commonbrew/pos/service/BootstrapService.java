package com.commonbrew.pos.service;

import org.springframework.stereotype.Service;

import com.commonbrew.pos.dto.response.BootstrapResponse;
import com.commonbrew.pos.repository.IngredientRepo;
import com.commonbrew.pos.repository.InventoryStockRepo;

@Service
public class BootstrapService {
  private final IngredientRepo ingredientRepo;
  private final InventoryStockRepo stockRepo;

  public BootstrapService(IngredientRepo ingredientRepo, InventoryStockRepo stockRepo) {
    this.ingredientRepo = ingredientRepo;
    this.stockRepo = stockRepo;
  }

  public BootstrapResponse load() {
    BootstrapResponse resp = new BootstrapResponse();
    resp.ingredients = ingredientRepo.findAll();
    resp.stocks = stockRepo.findAll();
    return resp;
  }
}
