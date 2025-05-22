package com.project.app_service.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.app_service.constant.Message;
import com.project.app_service.model.response.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

  AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();

  ObjectMapper mapper;

  MessageSource messageSource;

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {
    this.delegate.commence(request, response, authException);

    if (response.isCommitted()) {
      return;
    }

    response.setContentType("application/json;charset=UTF-8");
    ApiResponse<Object> res = new ApiResponse<>();
    res.setCode(HttpStatus.UNAUTHORIZED.value());
    res.setMessage(
        messageSource.getMessage(
            Message.INVALID_TOKEN.getKey(), null, LanguageUtil.getCurrentLocale()));
    res.setError(
        messageSource.getMessage(
            Message.ERROR_UNAUTHORIZED.getKey(), null, LanguageUtil.getCurrentLocale()));

    mapper.writeValue(response.getWriter(), res);
  }
}
