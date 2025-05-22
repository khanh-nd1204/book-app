package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.request.BookRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.BookService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
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
@RequestMapping("books")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Sách", description = "Quản lý sách")
@Validated
public class BookCtrl {
  BookService bookService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo mới sách",
      description = "Tạo một quyển sách mới trong hệ thống",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody BookRequest bookRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookService.create(bookRequest));
  }

  @Operation(summary = "Tạo hàng loạt sách", description = "Thêm nhiều sách cùng lúc")
  @PostMapping("/bulk")
  public ResponseEntity<ApiResponse<Object>> createBulk(
      @Valid @RequestBody List<BookRequest> bookRequests) throws Exception {
    int count = bookService.createBulk(bookRequests);
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.CREATE_BULK_BOOK.getKey(),
            new Object[] {count},
            LanguageUtil.getCurrentLocale()),
        count);
  }

  @Operation(
      summary = "Cập nhật sách",
      description = "Cập nhật thông tin một quyển sách hiện có",
      security = @SecurityRequirement(name = "bearerToken"))
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody BookRequest bookRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookService.update(bookRequest));
  }

  @Operation(
      summary = "Tìm kiếm sách",
      description = "Tìm kiếm danh sách sách theo các tiêu chí lọc")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<BookEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookService.search(spec, pageable));
  }

  @Operation(summary = "Lấy thông tin sách", description = "Lấy chi tiết thông tin sách theo SKU")
  @GetMapping("/{sku}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String sku) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookService.getBySku(sku));
  }

  @Operation(
      summary = "Xóa sách",
      description = "Xóa một quyển sách khỏi hệ thống theo ID",
      security = @SecurityRequirement(name = "bearerToken"))
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        bookService.delete(id));
  }
}
