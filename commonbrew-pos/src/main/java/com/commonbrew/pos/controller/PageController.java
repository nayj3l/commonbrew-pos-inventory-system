
package com.commonbrew.pos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

  @GetMapping({"/", "/pos"})
  public String dashboard() {
    return "pos";
  }

  @GetMapping("/inventory")
  public String inventory() {
    return "inventory";
  }
}
