package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.PublisherEntity;
import com.project.app_service.model.request.PublisherRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.PublisherService;
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
@RequestMapping("publishers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Nhà xuất bản", description = "Quản lý nhà xuất bản")
public class PublisherCtrl {
  PublisherService publisherService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo nhà xuất bản mới",
      description = "Thêm một nhà xuất bản mới vào hệ thống",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody PublisherRequest publisherRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        publisherService.create(publisherRequest));
  }

  @Operation(
      summary = "Cập nhật nhà xuất bản",
      description = "Chỉnh sửa thông tin nhà xuất bản",
      security = @SecurityRequirement(name = "bearerToken"))
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody PublisherRequest publisherRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        publisherService.update(publisherRequest));
  }

  @Operation(
      summary = "Tìm kiếm nhà xuất bản",
      description = "Truy vấn danh sách nhà xuất bản với điều kiện lọc")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<PublisherEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        publisherService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy nhà xuất bản theo ID",
      description = "Lấy thông tin chi tiết của nhà xuất bản dựa trên ID")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        publisherService.getById(id));
  }

  @Operation(
      summary = "Xóa nhà xuất bản",
      description = "Xóa một nhà xuất bản khỏi hệ thống dựa trên ID",
      security = @SecurityRequirement(name = "bearerToken"))
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        publisherService.delete(id));
  }
}
