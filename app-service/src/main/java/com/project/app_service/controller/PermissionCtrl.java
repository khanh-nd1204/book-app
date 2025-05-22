package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.PermissionEntity;
import com.project.app_service.model.request.PermissionRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.PermissionService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnUpdate;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.groups.Default;
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
@RequestMapping("permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Phân quyền", description = "Quản lý quyền truy cập hệ thống")
@SecurityRequirement(name = "bearerToken")
public class PermissionCtrl {
  PermissionService permissionService;

  MessageSource messageSource;

  @Operation(summary = "Tạo quyền mới", description = "Thêm quyền truy cập mới vào hệ thống")
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody PermissionRequest permissionRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        permissionService.create(permissionRequest));
  }

  @Operation(summary = "Cập nhật quyền", description = "Chỉnh sửa thông tin quyền truy cập")
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody PermissionRequest permissionRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        permissionService.update(permissionRequest));
  }

  @Operation(summary = "Tìm kiếm quyền", description = "Truy vấn danh sách quyền với điều kiện lọc")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<PermissionEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        permissionService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy quyền theo ID",
      description = "Lấy thông tin chi tiết của quyền dựa trên ID")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        permissionService.getById(id));
  }

  @Operation(summary = "Xóa quyền", description = "Xóa một quyền khỏi hệ thống dựa trên ID.")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        permissionService.delete(id));
  }
}
