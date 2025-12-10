package com.thryveai.backend.controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/v1")
    public Mono<String> home() {
        return Mono.just("Hello World");
    }

}
