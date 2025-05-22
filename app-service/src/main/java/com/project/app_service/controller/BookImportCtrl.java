package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.BookImportEntity;
import com.project.app_service.model.request.BookImportRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.BookImportService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.validation.group.OnCancel;
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
@RequestMapping("imports")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Nhập sách", description = "Quản lý nhập sách")
public class BookImportCtrl {
  BookImportService bookImportService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo mới phiếu",
      description = "Tạo phiếu nhập sách mới trong hệ thống",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody BookImportRequest bookImportRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookImportService.create(bookImportRequest));
  }

  @Operation(
      summary = "Cập nhật phiếu",
      description = "Cập nhật thông tin phiếu nhập hiện có",
      security = @SecurityRequirement(name = "bearerToken"))
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody BookImportRequest bookImportRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookImportService.update(bookImportRequest));
  }

  @Operation(
      summary = "Tìm kiếm phiếu",
      description = "Tìm kiếm danh sách phiếu nhập sách theo các tiêu chí lọc")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<BookImportEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookImportService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy thông tin phiếu",
      description = "Lấy chi tiết thông tin phiếu nhập sách theo id")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookImportService.getById(id));
  }

  @Operation(summary = "Hủy phiếu nhập", description = "Hủy phiếu nhập khi có sai sót")
  @PostMapping("/cancel")
  public ResponseEntity<ApiResponse<Object>> cancel(
      @Validated({OnCancel.class, Default.class}) @RequestBody BookImportRequest bookImportRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.CANCEL_IMPORT_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookImportService.cancel(bookImportRequest));
  }
}
