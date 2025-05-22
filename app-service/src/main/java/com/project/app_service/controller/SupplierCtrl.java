package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.SupplierEntity;
import com.project.app_service.model.request.SupplierRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.SupplierService;
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
@RequestMapping("suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Nhà cung cấp", description = "Quản lý nhà cung cấp")
public class SupplierCtrl {
  SupplierService supplierService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo nhà cung cấp mới",
      description = "Thêm một nhà cung cấp mới vào hệ thống",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody SupplierRequest supplierRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        supplierService.create(supplierRequest));
  }

  @Operation(
      summary = "Cập nhật nhà cung cấp",
      description = "Chỉnh sửa thông tin của một nhà cung cấp cụ thể",
      security = @SecurityRequirement(name = "bearerToken"))
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody SupplierRequest supplierRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        supplierService.update(supplierRequest));
  }

  @Operation(
      summary = "Tìm kiếm nhà cung cấp",
      description = "Lọc danh sách nhà cung cấp theo điều kiện")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<SupplierEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        supplierService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy nhà cung cấp theo ID",
      description = "Lấy thông tin chi tiết của một nhà cung cấp theo ID")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        supplierService.getById(id));
  }

  @Operation(
      summary = "Xóa nhà cung cấp",
      description = "Xóa một nhà cung cấp khỏi hệ thống theo ID",
      security = @SecurityRequirement(name = "bearerToken"))
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        supplierService.delete(id));
  }
}
