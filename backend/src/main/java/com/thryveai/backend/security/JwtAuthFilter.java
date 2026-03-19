package com.thryveai.backend.security;

import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
}
