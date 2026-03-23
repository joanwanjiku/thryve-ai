package com.thryveai.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Called by Spring Security after the full Google OAuth2 handshake completes.
 * Generates a JWT for the authenticated user and redirects the browser to the
 * React frontend callback URL with the token as a query parameter.
 *
 * Redirect target: {app.oauth2.redirect-uri}?token=<JWT>
 * Example:         http://localhost:5173/auth/callback?token=eyJ...
 **/



@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtService jwtService;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String token = jwtService.generateToken(oAuth2User.getInternalId(), oAuth2User.getEmail());

        String targetUrl = redirectUri + "?token=" + token;
        log.info("OAuth2 success - redirecting to frontend with JWT for user id={}", oAuth2User.getInternalId());

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
