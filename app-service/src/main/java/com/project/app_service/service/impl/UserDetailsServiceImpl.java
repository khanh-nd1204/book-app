package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.repo.UserRepo;
import com.project.app_service.util.LanguageUtil;
import java.util.Collections;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserDetailsServiceImpl implements UserDetailsService {
  UserRepo userRepo;

  MessageSource messageSource;

  @Override
  public UserDetails loadUserByUsername(String username) throws BadCredentialsException {
    UserEntity user =
        userRepo
            .findByEmail(username)
            .orElseThrow(
                () ->
                    new BadCredentialsException(
                        messageSource.getMessage(
                            Message.ACCOUNT_INVALID.getKey(),
                            null,
                            LanguageUtil.getCurrentLocale())));

    if (!user.getActive()) {
      throw new DisabledException(
          messageSource.getMessage(
              Message.ACCOUNT_DISABLED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return new User(
        user.getEmail(),
        user.getPassword(),
        Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName())));
  }
}
