package com.thryveai.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User delegate;
    private final UUID internalId;
    private final String email;

    public CustomOAuth2User(OAuth2User oAuth2User, UUID internalId, String email) {
        this.delegate = oAuth2User;
        this.internalId = internalId;
        this.email = email;
    }

    public UUID getInternalId() {
        return internalId;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return delegate.getName();
    }
}
