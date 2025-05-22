package com.project.app_service.util;

import com.project.app_service.constant.Message;
import com.project.app_service.constant.Role;
import com.project.app_service.exception.ForbiddenException;
import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

public class PermissionInterceptor implements HandlerInterceptor {
  Set<String> PUBLIC_ENDPOINTS =
      new HashSet<>(
          Arrays.asList(
              "POST:/auth/login",
              "POST:/auth/register",
              "POST:/auth/logout",
              "GET:/auth/refresh",
              "GET:/auth",
              "GET:/auth/google",
              "GET:/auth/call-back",
              "POST:/auth/reset-password",
              "POST:/auth/send-mail",
              "POST:/auth/activate",
              "GET:/books",
              "GET:/books/{sku}",
              "GET:/categories",
              "GET:/categories/{id}",
              "GET:/publishers",
              "GET:/publishers/{id}",
              "GET:/carts",
              "POST:/carts/add",
              "POST:/carts/remove",
              "POST:/carts/update",
              "POST:/carts/reset",
              "GET:/payments/vn-pay",
              "GET:/notifications",
              "POST:/notifications/read"));
  @Autowired private UserService userService;
  @Autowired private MessageSource messageSource;

  @Override
  @Transactional
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    if (!(handler instanceof HandlerMethod)) {
      return true;
    }

    String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
    String httpMethod = request.getMethod();

    if (isPublic(httpMethod, path)) {
      return true;
    }

    String email =
        SecurityUtil.getCurrentUserLogin()
            .orElseThrow(
                () ->
                    new ForbiddenException(
                        messageSource.getMessage(
                            Message.ERROR_DENIED.getKey(), null, LanguageUtil.getCurrentLocale())));

    UserEntity user = userService.getByEmail(email);

    RoleEntity role = user.getRole();
    if (role == null) {
      throw new ForbiddenException(
          messageSource.getMessage(
              Message.ROLE_NOT_ASSIGNED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }
    if (role.getName().equals(Role.ADMIN.getName())) return true;

    Set<String> userPermissions = new HashSet<>();
    for (PermissionEntity permission : role.getPermissions()) {
      userPermissions.add(permission.getMethod() + ":" + permission.getApiPath());
    }

    String requestKey = httpMethod + ":" + path;
    if (!userPermissions.contains(requestKey)) {
      throw new ForbiddenException(
          messageSource.getMessage(
              Message.ERROR_DENIED.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    return true;
  }

  private boolean isPublic(String httpMethod, String path) {
    return path.matches(".*/upload/.*")
        || path.matches(".*/api-docs.*")
        || path.matches(".*/swagger-ui.*")
        || PUBLIC_ENDPOINTS.contains(httpMethod + ":" + path);
  }
}
