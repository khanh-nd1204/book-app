package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.RoleEntity;
import com.project.app_service.model.request.RoleRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.RoleService;
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
@RequestMapping("roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Vai trò", description = "Quản lý vai trò người dùng")
@SecurityRequirement(name = "bearerToken")
public class RoleCtrl {
  RoleService roleService;

  MessageSource messageSource;

  @Operation(summary = "Tạo vai trò mới", description = "Thêm một vai trò mới vào hệ thống.")
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody RoleRequest roleRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        roleService.create(roleRequest));
  }

  @Operation(
      summary = "Cập nhật vai trò",
      description = "Chỉnh sửa thông tin của một vai trò cụ thể.")
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody RoleRequest roleRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        roleService.update(roleRequest));
  }

  @Operation(summary = "Tìm kiếm vai trò", description = "Lọc danh sách vai trò theo điều kiện")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<RoleEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        roleService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy vai trò theo ID",
      description = "Lấy thông tin chi tiết của một vai trò theo ID")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        roleService.getById(id));
  }

  @Operation(summary = "Xóa vai trò", description = "Xóa một vai trò khỏi hệ thống theo ID")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        roleService.delete(id));
  }
}
