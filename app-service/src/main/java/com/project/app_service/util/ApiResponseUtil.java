package com.project.app_service.util;

import com.project.app_service.model.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponseUtil {
  // Trả về response với dữ liệu thành công
  public static <T> ResponseEntity<ApiResponse<T>> buildSuccessResponse(
      HttpStatus status, Object message, T data) {
    return ResponseEntity.status(status)
        .body(new ApiResponse<>(status.value(), message, data, null));
  }

  // Trả về response với lỗi
  public static <T> ResponseEntity<ApiResponse<T>> buildErrorResponse(
      HttpStatus status, Object message, String error) {
    return ResponseEntity.status(status)
        .body(new ApiResponse<>(status.value(), message, null, error));
  }
}
