package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.BookExportEntity;
import com.project.app_service.model.request.BookExportRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.BookExportService;
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
@RequestMapping("exports")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Xuất sách", description = "Quản lý xuất sách")
public class BookExportCtrl {
  BookExportService bookExportService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo mới phiếu",
      description = "Tạo phiếu xuất sách mới trong hệ thống",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody BookExportRequest bookExportRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookExportService.create(bookExportRequest));
  }

  @Operation(
      summary = "Cập nhật phiếu",
      description = "Cập nhật thông tin phiếu xuất hiện có",
      security = @SecurityRequirement(name = "bearerToken"))
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody BookExportRequest bookExportRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookExportService.update(bookExportRequest));
  }

  @Operation(
      summary = "Tìm kiếm phiếu",
      description = "Tìm kiếm danh sách phiếu xuất sách theo các tiêu chí lọc")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<BookExportEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookExportService.search(spec, pageable));
  }

  @Operation(
      summary = "Lấy thông tin phiếu",
      description = "Lấy chi tiết thông tin phiếu xuất sách theo id")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookExportService.getById(id));
  }

  @Operation(summary = "Hủy phiếu xuất", description = "Hủy phiếu xuất khi có sai sót")
  @PostMapping("/cancel")
  public ResponseEntity<ApiResponse<Object>> cancel(
      @Validated({OnCancel.class, Default.class}) @RequestBody BookExportRequest bookExportRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.CANCEL_EXPORT_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookExportService.cancel(bookExportRequest));
  }
}
