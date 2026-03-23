package com.thryveai.backend.dto;

import lombok.*;

import java.util.UUID;


public class UserDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateUserRequest{
        private String googleId;
        private String email;
        private String displayName;
        private String profilePictureUrl;
        private String role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private UUID id;
        private String email;
        private String displayName;
        private String profilePictureUrl;
        private String role;
    }



}
