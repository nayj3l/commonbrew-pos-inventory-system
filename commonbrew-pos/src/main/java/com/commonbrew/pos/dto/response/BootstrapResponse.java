package com.commonbrew.pos.dto.response;

import java.util.List;

import com.commonbrew.pos.dto.Ingredient;
import com.commonbrew.pos.dto.InventoryStock;

public class BootstrapResponse {
    public List<Ingredient> ingredients;
    public List<InventoryStock> stocks;
}
