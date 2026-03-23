package com.thryveai.backend.security;

import com.thryveai.backend.dto.UserDTO;
import com.thryveai.backend.dto.UserDTO.CreateUserRequest;
import com.thryveai.backend.entity.User;
import com.thryveai.backend.repositories.UserRepository;
import com.thryveai.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
* Intercepts the Google OAuth2 user info response
* Finds an existing User by googleId or email, or creates a new one
* Returns a CustomOAuth2User carrying the internal UUID for jwt generation
**/

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String googleId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        CreateUserRequest createUserRequest = CreateUserRequest.builder()
                .googleId(googleId)
                .email(email)
                .displayName(name)
                .profilePictureUrl(picture)
                .role("USER")
                .build();

        UserDTO.UserResponse userResponse = userService.createUser(createUserRequest);

        log.info("OAuth2 login for user: {} (id={})", email, userResponse.getId());

        return new CustomOAuth2User(oAuth2User,userResponse.getId(), userResponse.getEmail());
    }
}
