package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.NotificationEntity;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.NotificationService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Thông báo", description = "Quản lý thông báo")
@SecurityRequirement(name = "bearerToken")
public class NotificationCtrl {
  NotificationService notificationService;

  MessageSource messageSource;

  @Operation(summary = "Tìm kiếm thông báo", description = "Tìm kiếm danh sách thông báo")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<NotificationEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        notificationService.search(spec, pageable));
  }

  @Operation(summary = "Đánh dấu đã đọc", description = "Đánh dấu đã đọc tất cả thông báo")
  @PostMapping("/read")
  public ResponseEntity<ApiResponse<Object>> markAllRead() throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.READ_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        notificationService.markAllRead());
  }
}
