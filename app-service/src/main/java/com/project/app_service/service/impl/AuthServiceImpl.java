package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.exception.NotFoundException;
import com.project.app_service.exception.UnauthorizedException;
import com.project.app_service.mapper.UserMapper;
import com.project.app_service.model.entity.InvalidatedTokenEntity;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.AuthRequest;
import com.project.app_service.model.response.AuthResponse;
import com.project.app_service.repo.InvalidatedTokenRepo;
import com.project.app_service.repo.RoleRepo;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.service.AuthService;
import com.project.app_service.service.LogService;
import com.project.app_service.service.UserService;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.util.SecurityUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.*;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {
    AuthenticationManagerBuilder authenticationManagerBuilder;

    SecurityUtil securityUtil;

    UserService userService;

    UserMapper userMapper;

    InvalidatedTokenRepo invalidatedTokenRepo;

    JwtDecoder jwtDecoder;

    MessageSource messageSource;

    LogService logService;

    RestTemplate restTemplate = new RestTemplate();

    UserRepo userRepo;

    RoleRepo roleRepo;

    @Value("${jwt.access-token-validity-in-seconds}")
    @NonFinal
    Long accessTokenValidityInSeconds;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    @NonFinal
    Long refreshTokenValidityInSeconds;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    @NonFinal
    String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    @NonFinal
    String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    @NonFinal
    String googleRedirectUri;

    @Value("${spring.security.oauth2.client.provider.google.token-uri}")
    @NonFinal
    String googleTokenUri;

    @Value("${spring.security.oauth2.client.provider.google.authorization-uri}")
    @NonFinal
    String googleAuthorizationUri;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    @NonFinal
    String googleUserInfoUri;

    @Override
    @Transactional
    public AuthResponse login(AuthRequest authRequest) throws Exception {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(), authRequest.getPassword());

        Authentication authentication =
                authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserEntity user = userService.getByEmail(authRequest.getUsername());

        if (!user.getActive()) {
            throw new DisabledException(
                    messageSource.getMessage(
                            Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
        }

        String refreshToken = securityUtil.createToken(user, refreshTokenValidityInSeconds);
        userService.updateToken(user.getId(), refreshToken);

        logService.create(user.getName(), Message.ACTION_LOGIN.getKey(), Message.USER_LOGIN.getKey());

        return new AuthResponse(
                securityUtil.createToken(user, accessTokenValidityInSeconds),
                refreshToken,
                userMapper.toResponse(user));
    }

    @Override
    public ResponseCookie buildRefreshTokenCookie(String refreshToken, Long validityInSeconds) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(validityInSeconds)
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) throws Exception {
        if (refreshToken == null) {
            throw new BadRequestException(
                    messageSource.getMessage(
                            Message.INVALID_REFRESH_TOKEN.getKey(), null, LanguageUtil.getCurrentLocale()));
        }

        Jwt decodedToken = securityUtil.checkValidRefreshToken(refreshToken);
        System.out.println(decodedToken.getSubject());
        String email = decodedToken.getSubject();

        UserEntity user = userService.getByEmailAndRefreshToken(email, refreshToken);
        if (!user.getActive()) {
            throw new DisabledException(
                    messageSource.getMessage(
                            Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
        }

        String newRefreshToken = securityUtil.createToken(user, refreshTokenValidityInSeconds);
        userService.updateToken(user.getId(), newRefreshToken);

        return new AuthResponse(
                securityUtil.createToken(user, accessTokenValidityInSeconds),
                newRefreshToken,
                userMapper.toResponse(user));
    }

    @Override
    public String logout() throws Exception {
        String email =
                SecurityUtil.getCurrentUserLogin()
                        .orElseThrow(
                                () ->
                                        new UnauthorizedException(
                                                messageSource.getMessage(
                                                        Message.INVALID_TOKEN.getKey(),
                                                        null,
                                                        LanguageUtil.getCurrentLocale())));

        UserEntity user = userService.getByEmail(email);
        userService.updateToken(user.getId(), null);

        String token =
                SecurityUtil.getCurrentUserJWT()
                        .orElseThrow(
                                () ->
                                        new UnauthorizedException(
                                                messageSource.getMessage(
                                                        Message.INVALID_TOKEN.getKey(),
                                                        null,
                                                        LanguageUtil.getCurrentLocale())));

        Jwt jwt = jwtDecoder.decode(token);

        String tokenId = jwt.getId();
        Instant expiresAt = jwt.getExpiresAt();

        InvalidatedTokenEntity invalidatedToken = new InvalidatedTokenEntity(tokenId, expiresAt);
        invalidatedTokenRepo.save(invalidatedToken);

        logService.create(user.getName(), Message.ACTION_LOGOUT.getKey(), Message.USER_LOGOUT.getKey());

        return user.getId();
    }

    @Override
    public String buildGoogleLoginUrl() throws Exception {
        return UriComponentsBuilder.fromHttpUrl(googleAuthorizationUri)
                .queryParam("client_id", googleClientId)
                .queryParam("redirect_uri", googleRedirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid profile email")
                .encode()
                .build()
                .toUriString();
    }

    @Override
    @Transactional
    public AuthResponse loginCallBack(String code) throws Exception {
        // Step 1: Get access_token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
        tokenRequest.add("code", code);
        tokenRequest.add("client_id", googleClientId);
        tokenRequest.add("client_secret", googleClientSecret);
        tokenRequest.add("redirect_uri", googleRedirectUri);
        tokenRequest.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> requestEntity =
                new HttpEntity<>(tokenRequest, headers);

        ResponseEntity<Map> tokenResponse =
                restTemplate.postForEntity(googleTokenUri, requestEntity, Map.class);

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // Step 2: Call userinfo endpoint
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.setBearerAuth(accessToken);
        HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);

        ResponseEntity<Map> userInfo =
                restTemplate.exchange(googleUserInfoUri, HttpMethod.GET, userInfoEntity, Map.class);

        Map<String, Object> userBody = userInfo.getBody();

        String email = (String) userBody.get("email");
        String name = (String) userBody.get("name");
        String googleId = (String) userBody.get("sub");

        UserEntity user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            RoleEntity role =
                    roleRepo
                            .findByName(Role.CUSTOMER.getName())
                            .orElseThrow(
                                    () ->
                                            new NotFoundException(
                                                    messageSource.getMessage(
                                                            Message.ROLE_NOT_FOUND.getKey(),
                                                            null,
                                                            LanguageUtil.getCurrentLocale())));
            user =
                    userRepo.save(
                            UserEntity.builder()
                                    .email(email)
                                    .name(name)
                                    .password("")
                                    .phone(null)
                                    .address(null)
                                    .googleId(googleId)
                                    .role(role)
                                    .active(true)
                                    .build());
        } else {
            if (!user.getActive()) {
                throw new DisabledException(
                        messageSource.getMessage(
                                Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
            }
        }

        String refreshToken = securityUtil.createToken(user, refreshTokenValidityInSeconds);
        userService.updateToken(user.getId(), refreshToken);

        return new AuthResponse(
                securityUtil.createToken(user, accessTokenValidityInSeconds),
                refreshToken,
                userMapper.toResponse(user));
    }
}
