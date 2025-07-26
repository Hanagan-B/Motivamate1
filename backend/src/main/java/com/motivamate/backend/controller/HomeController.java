package com.motivamate.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class HomeController {
     @GetMapping("/")
    public String index() {
        // Return the name of your HTML template, e.g. index.html in resources/templates
        return "index";
    }
}
