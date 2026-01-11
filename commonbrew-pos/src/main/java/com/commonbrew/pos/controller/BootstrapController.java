package com.commonbrew.pos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commonbrew.pos.dto.response.BootstrapResponse;
import com.commonbrew.pos.service.BootstrapService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BootstrapController {

    private final BootstrapService bootstrapService;

    @GetMapping("/bootstrap")
    public BootstrapResponse bootstrap() {
        return bootstrapService.load();
    }
}
