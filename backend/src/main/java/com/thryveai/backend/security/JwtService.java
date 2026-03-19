package com.thryveai.backend.security;

import org.springframework.beans.factory.annotation.Value;

public class JwtService {

    @Value("${app.jwt.secret")
    private String jwtSecret;
}
