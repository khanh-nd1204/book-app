package com.project.app_service.service;

import com.project.app_service.model.request.AuthRequest;
import com.project.app_service.model.response.AuthResponse;
import org.springframework.http.ResponseCookie;

public interface AuthService {
  AuthResponse login(AuthRequest authRequest) throws Exception;

  ResponseCookie buildRefreshTokenCookie(String refreshToken, Long validityInSeconds)
      throws Exception;

  AuthResponse refreshToken(String refreshToken) throws Exception;

  String logout() throws Exception;

  String buildGoogleLoginUrl() throws Exception;

  AuthResponse loginCallBack(String code) throws Exception;
}
