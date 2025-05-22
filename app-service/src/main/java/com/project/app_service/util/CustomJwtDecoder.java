package com.project.app_service.util;

import com.project.app_service.constant.Message;
import com.project.app_service.repo.InvalidatedTokenRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomJwtDecoder implements JwtDecoder {
  JwtDecoder jwtDecoder;

  InvalidatedTokenRepo invalidatedTokenRepo;

  MessageSource messageSource;

  @Override
  public Jwt decode(String token) throws JwtException {
    Jwt jwt = jwtDecoder.decode(token);

    String tokenId = jwt.getId();

    if (invalidatedTokenRepo.findById(tokenId).isPresent()) {
      throw new JwtException(
          messageSource.getMessage(
              Message.INVALID_TOKEN.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return jwt;
  }
}
