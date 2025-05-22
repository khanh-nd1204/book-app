package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.UserEntity;
import com.project.app_service.model.request.UserRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.UserService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.validation.group.OnChangePassword;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnUpdate;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Người dùng", description = "Quản lý tài khoản người dùng")
@SecurityRequirement(name = "bearerToken")
@Validated
public class UserCtrl {
  UserService userService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo người dùng mới",
      description = "Thêm một tài khoản người dùng mới vào hệ thống")
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody UserRequest userRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        userService.create(userRequest));
  }

  @Operation(
      summary = "Tạo hàng loạt người dùng",
      description = "Thêm nhiều tài khoản người dùng cùng lúc")
  @PostMapping("/bulk")
  public ResponseEntity<ApiResponse<Object>> createBulk(
      @Valid @RequestBody List<UserRequest> userRequests) throws Exception {
    int count = userService.createBulk(userRequests);
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_BULK_USER.getKey(),
            new Object[] {count},
            LanguageUtil.getCurrentLocale()),
        count);
  }

  @Operation(
      summary = "Cập nhật thông tin người dùng",
      description = "Chỉnh sửa thông tin tài khoản người dùng")
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody UserRequest userRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        userService.update(userRequest));
  }

  @Operation(
      summary = "Tìm kiếm người dùng",
      description = "Lọc danh sách người dùng theo điều kiện")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<UserEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        userService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy người dùng theo ID",
      description = "Lấy thông tin chi tiết của một người dùng theo ID")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        userService.getById(id));
  }

  @Operation(
      summary = "Xóa người dùng",
      description = "Ẩn một tài khoản người dùng khỏi hệ thống theo ID")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        userService.delete(id));
  }

  @Operation(summary = "Đổi mật khẩu", description = "Cho phép người dùng đổi mật khẩu tài khoản")
  @PostMapping("/change-password")
  public ResponseEntity<ApiResponse<Object>> changePassword(
      @Validated({OnChangePassword.class, Default.class}) @RequestBody UserRequest userRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.CHANGE_PASSWORD_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        userService.changePassword(userRequest));
  }
}
