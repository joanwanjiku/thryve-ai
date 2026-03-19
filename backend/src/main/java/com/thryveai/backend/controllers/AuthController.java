package com.thryveai.backend.controllers;

import com.thryveai.backend.dto.ApiResponse;
import com.thryveai.backend.dto.UserDTO.UserResponse;
import com.thryveai.backend.repositories.UserRepository;
import com.thryveai.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();

        UserResponse userResponse = userService.getUser(userId);
        return ResponseEntity.ok(ApiResponse.success(userResponse));



    }
}
