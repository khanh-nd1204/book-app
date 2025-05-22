package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.request.AuthRequest;
import com.project.app_service.model.request.MailRequest;
import com.project.app_service.model.request.UserRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.model.response.AuthResponse;
import com.project.app_service.service.AuthService;
import com.project.app_service.service.UserService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.validation.group.OnActivate;
import com.project.app_service.validation.group.OnRegister;
import com.project.app_service.validation.group.OnResetPassword;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Tài khoản", description = "Quản lý tài khoản người dùng")
public class AuthCtrl {
    AuthService authService;

    UserService userService;

    MessageSource messageSource;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    @NonFinal
    Long refreshTokenValidityInSeconds;

    @Operation(
            summary = "Đăng nhập",
            description = "Trả về thông tin tài khoản sau khi đăng nhập thành công")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@Valid @RequestBody AuthRequest authRequest)
            throws Exception {
        AuthResponse authResponse = authService.login(authRequest);

//    ApiResponse<Object> res =
//            new ApiResponse<>(
//                    HttpStatus.OK.value(),
//                    Translator.toLocale(Message.LOGIN_SUCCESS.getKey(), null),
//                    authResponse,
//                    null);

        ApiResponse<Object> res =
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        messageSource.getMessage(
                                Message.LOGIN_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                        authResponse,
                        null);

        ResponseCookie springCookie =
                authService.buildRefreshTokenCookie(
                        authResponse.getRefreshToken(), refreshTokenValidityInSeconds);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, springCookie.toString()).body(res);
    }

    @Operation(
            summary = "Lấy thông tin tài khoản",
            description = "Trả về thông tin tài khoản đang đăng nhập",
            security = @SecurityRequirement(name = "bearerToken"))
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getInfo() throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                userService.getInfo());
    }

    @PostMapping("/register")
    @Operation(
            summary = "Đăng ký tài khoản",
            description = "Tạo mới tài khoản và trả về thông tin tài khoản đăng ký thành công")
    public ResponseEntity<ApiResponse<Object>> register(
            @Validated({OnRegister.class, Default.class}) @RequestBody UserRequest userRequest)
            throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.REGISTER_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                userService.register(userRequest));
    }

    @PostMapping("/activate")
    @Operation(summary = "Kích hoạt tài khoản", description = "Xác thực tài khoản bằng OTP")
    public ResponseEntity<ApiResponse<Object>> activate(
            @Validated({OnActivate.class, Default.class}) @RequestBody UserRequest userRequest)
            throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.ACTIVATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                userService.activate(userRequest));
    }

    @GetMapping("/refresh")
    @Operation(summary = "Làm mới token", description = "Trả về access token mới và refresh token")
    public ResponseEntity<ApiResponse<Object>> refreshToken(
            @CookieValue(name = "refreshToken") String refreshToken) throws Exception {
        AuthResponse authResponse = authService.refreshToken(refreshToken);

        ApiResponse<Object> res =
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        messageSource.getMessage(
                                Message.REFRESH_TOKEN_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                        authResponse,
                        null);

        ResponseCookie springCookie =
                authService.buildRefreshTokenCookie(
                        authResponse.getRefreshToken(), refreshTokenValidityInSeconds);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, springCookie.toString()).body(res);
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Đăng xuất",
            description = "Đăng xuất tài khoản khỏi hệ thống",
            security = @SecurityRequirement(name = "bearerToken"))
    public ResponseEntity<ApiResponse<Object>> logout() throws Exception {
        ApiResponse<Object> res =
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        messageSource.getMessage(
                                Message.LOGOUT_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                        authService.logout(),
                        null);

        ResponseCookie springCookie = authService.buildRefreshTokenCookie("", 0L);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, springCookie.toString()).body(res);
    }

    @PostMapping("reset-password")
    @Operation(
            summary = "Khôi phục mật khẩu",
            description = "Trả về ID tài khoản sau khi khôi phục mật khẩu thành công")
    public ResponseEntity<ApiResponse<Object>> resetPassword(
            @Validated({OnResetPassword.class, Default.class}) @RequestBody UserRequest userRequest)
            throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.RESET_PASSWORD_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                userService.resetPassword(userRequest));
    }

    @PostMapping("send-mail")
    @Operation(summary = "Gửi email", description = "Trả về OTP để kích hoạt hoặc khôi phục mật khẩu")
    public ResponseEntity<ApiResponse<Object>> sendMail(@Valid @RequestBody MailRequest mailRequest)
            throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.SEND_EMAIL_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                userService.sendMail(mailRequest));
    }

    @Operation(
            summary = "Đăng nhập bằng tài khoàn goggle",
            description = "Trả về url đăng nhập google")
    @GetMapping("/google")
    public ResponseEntity<ApiResponse<Object>> getGoogleUrl() throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                authService.buildGoogleLoginUrl());
    }

    @GetMapping("/call-back")
    @Operation(
            summary = "Lấy thông tin tài khoản google",
            description = "Trả về thông tin tài khoản google sau khi đăng nhập google thành công")
    public ResponseEntity<?> handleCallback(@RequestParam("code") String code) throws Exception {
        return ApiResponseUtil.buildSuccessResponse(
                HttpStatus.OK,
                messageSource.getMessage(
                        Message.LOGIN_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
                authService.loginCallBack(code));
    }
}
