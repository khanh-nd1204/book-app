package com.project.app_service.exception;

import com.project.app_service.constant.Message;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.BadRequestException;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GlobalExceptionHandler {
  MessageSource messageSource;

  // Xử lý lỗi tổng quát (500)
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        messageSource.getMessage(
            Message.ERROR_SERVER.getKey(), null, LanguageUtil.getCurrentLocale()),
        messageSource.getMessage(
            Message.ERROR_GENERAL.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi không tìm thấy tài nguyên (404)
  @ExceptionHandler({NoResourceFoundException.class, NotFoundException.class})
  public ResponseEntity<ApiResponse<Object>> handleNotFoundException(Exception e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.NOT_FOUND,
        e.getMessage(),
        messageSource.getMessage(
            Message.ERROR_RESOURCE.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi yêu cầu không hợp lệ (400)
  @ExceptionHandler({
    BadRequestException.class,
    MissingRequestCookieException.class,
    IllegalArgumentException.class,
    HttpRequestMethodNotSupportedException.class,
    DataIntegrityViolationException.class,
    PropertyReferenceException.class,
    InvalidDataAccessApiUsageException.class,
    NullPointerException.class,
    HttpMessageNotReadableException.class,
    DisabledException.class
  })
  public ResponseEntity<ApiResponse<Object>> handleBadRequestException(Exception e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        e.getMessage(),
        messageSource.getMessage(
            Message.ERROR_BAD_REQUEST.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi xác thực (401)
  @ExceptionHandler({
    UnauthorizedException.class,
    BadJwtException.class,
    AuthenticationException.class,
    InternalAuthenticationServiceException.class,
    UsernameNotFoundException.class,
    BadCredentialsException.class
  })
  public ResponseEntity<ApiResponse<Object>> handleUnauthorizedException(Exception e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.UNAUTHORIZED,
        e.getMessage(),
        messageSource.getMessage(
            Message.ERROR_UNAUTHORIZED.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi truy cập bị cấm (403)
  @ExceptionHandler({
    ForbiddenException.class,
    AccessDeniedException.class,
    AuthorizationDeniedException.class
  })
  public ResponseEntity<ApiResponse<Object>> handleForbiddenException(Exception e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.FORBIDDEN,
        e.getMessage(),
        messageSource.getMessage(
            Message.ERROR_FORBIDDEN.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi kiểu dữ liệu không đúng trong request (400)
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiResponse<Object>> handleTypeMismatchException(
      MethodArgumentTypeMismatchException e) {
    String message =
        String.format(
            "%s: %s",
            messageSource.getMessage(
                Message.ERROR_INVALID_PARAMETER.getKey(), null, LanguageUtil.getCurrentLocale()),
            e.getName());
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        message,
        messageSource.getMessage(
            Message.ERROR_INVALID_PARAMETER.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi tham số không hợp lệ trong request body (400)
  @ExceptionHandler({MethodArgumentNotValidException.class})
  public ResponseEntity<ApiResponse<Object>> handleValidationException(
      MethodArgumentNotValidException e) {
    List<String> errors =
        e.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());

    Object errorDetails = errors.size() == 1 ? errors.get(0) : errors;
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        errorDetails,
        messageSource.getMessage(
            Message.ERROR_INVALID_PARAMETER.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi tham số không hợp lệ trong request body (400)
  @ExceptionHandler({ConstraintViolationException.class})
  public ResponseEntity<ApiResponse<Object>> handleConstraintViolationException(
      ConstraintViolationException e) {
    List<String> errors =
        e.getConstraintViolations().stream()
            .map(ConstraintViolation::getMessage)
            .collect(Collectors.toList());

    Object errorDetails = errors.size() == 1 ? errors.get(0) : errors;

    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        errorDetails,
        messageSource.getMessage(
            Message.ERROR_INVALID_PARAMETER.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi thiếu tham số request (400)
  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ApiResponse<Object>> handleMissingParameterException(
      MissingServletRequestParameterException e) {
    String message =
        String.format(
            "%s: %s",
            messageSource.getMessage(
                Message.ERROR_MISSING_PARAMETER.getKey(), null, LanguageUtil.getCurrentLocale()),
            e.getParameterName());
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        message,
        messageSource.getMessage(
            Message.ERROR_BAD_REQUEST.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi thiếu phần trong multipart request (400)
  @ExceptionHandler(MissingServletRequestPartException.class)
  public ResponseEntity<ApiResponse<Object>> handleMissingRequestPartException(
      MissingServletRequestPartException e) {
    String message =
        String.format(
            "%s: %s",
            messageSource.getMessage(
                Message.ERROR_MISSING_PART.getKey(), null, LanguageUtil.getCurrentLocale()),
            e.getRequestPartName());
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        message,
        messageSource.getMessage(
            Message.ERROR_BAD_REQUEST.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi tải tập tin (400)
  @ExceptionHandler({FileStoreException.class, IOException.class, MultipartException.class})
  public ResponseEntity<ApiResponse<Object>> handleFileException(Exception e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        e.getMessage(),
        messageSource.getMessage(
            Message.ERROR_UPLOAD_FILE.getKey(), null, LanguageUtil.getCurrentLocale()));
  }

  // Xử lý lỗi kích thước tập tin (400)
  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<ApiResponse<Object>> handleMaxUploadSizeExceededException(
      MaxUploadSizeExceededException e) {
    return ApiResponseUtil.buildErrorResponse(
        HttpStatus.BAD_REQUEST,
        messageSource.getMessage(
            Message.ERROR_FILE_SIZE.getKey(), null, LanguageUtil.getCurrentLocale()),
        messageSource.getMessage(
            Message.ERROR_UPLOAD_FILE.getKey(), null, LanguageUtil.getCurrentLocale()));
  }
}
