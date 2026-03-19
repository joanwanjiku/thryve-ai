package com.thryveai.backend.services;

import com.thryveai.backend.dto.UserDTO;
import com.thryveai.backend.entity.User;
import com.thryveai.backend.exception.ResourceNotFoundException;
import com.thryveai.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    public UserDTO.UserResponse getUser(UUID userId) {
        return userRepository.findById(userId)
                .map(this::toResponse)
                .orElse(null);
    }
    public UserDTO.UserResponse createUser(UserDTO.CreateUserRequest createUserRequest) {
        log.info("Adding new user: " );
        User user = userRepository.findByGoogleId(createUserRequest.getGoogleId())
                .orElseGet(() -> userRepository.findByEmail(createUserRequest.getEmail())
                                .map(existing -> {
                                    existing.setGoogleId(createUserRequest.getGoogleId());
                                    existing.setProfilePictureUrl(createUserRequest.getProfilePictureUrl());
                                    return userRepository.save(existing);
                                })
                        .orElseGet(() -> {
//                    first time google login - create new user
                            User newUser = User.builder()
                                    .googleId(createUserRequest.getGoogleId())
                                    .email(createUserRequest.getEmail())
                                    .displayName(createUserRequest.getDisplayName())
                                    .profilePictureUrl(createUserRequest.getProfilePictureUrl())
                                    .role(createUserRequest.getRole())
                                    .build();
                            return userRepository.save(newUser);
                        }));
        return toResponse(user);
    }
    private UserDTO.UserResponse toResponse(User user) {
        return UserDTO.UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .build();
    }
}
