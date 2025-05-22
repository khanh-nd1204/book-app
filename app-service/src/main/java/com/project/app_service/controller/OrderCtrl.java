package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.entity.OrderEntity;
import com.project.app_service.model.request.OrderRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.OrderService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.validation.group.OnCancel;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnReject;
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
@RequestMapping("orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Đơn hàng", description = "Quản lý đơn hàng")
public class OrderCtrl {
  OrderService orderService;

  MessageSource messageSource;

  @Operation(
      summary = "Tạo mới đơn hàng",
      description = "Tạo đơn hàng mới trong hệ thống",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping
  public ResponseEntity<ApiResponse<Object>> create(
      @Validated({OnCreate.class, Default.class}) @RequestBody OrderRequest orderRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.CREATED,
        messageSource.getMessage(
            Message.ORDER_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.create(orderRequest));
  }

  @Operation(
      summary = "Cập nhật đơn hàng",
      description = "Cập nhật thông tin một đơn hàng hiện có",
      security = @SecurityRequirement(name = "bearerToken"))
  @PatchMapping
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdate.class, Default.class}) @RequestBody OrderRequest orderRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.update(orderRequest));
  }

  @Operation(
      summary = "Tìm kiếm đơn hàng",
      description = "Tìm kiếm danh sách đơn hàng theo các tiêu chí lọc")
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> search(
      @Filter Specification<OrderEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.search(spec, pageable));
  }

  @Operation(
      summary = "Tìm kiếm đơn hàng theo người dùng",
      description = "Tìm kiếm danh sách đơn hàng theo người dùng và các tiêu chí lọc")
  @GetMapping("/user")
  public ResponseEntity<ApiResponse<Object>> searchByUser(
      @Filter Specification<OrderEntity> spec, Pageable pageable) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.SEARCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.searchByUser(spec, pageable));
  }

  @Operation(
      summary = "Lấy thông tin đơn hàng",
      description = "Lấy chi tiết thông tin đơn hàng theo id")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> getById(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.getById(id));
  }

  @Operation(summary = "Hủy đơn hàng", description = "Hủy đơn hàng khi hệ thống chưa xác nhận")
  @PostMapping("/cancel")
  public ResponseEntity<ApiResponse<Object>> cancel(
      @Validated({OnCancel.class, Default.class}) @RequestBody OrderRequest orderRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.CANCEL_ORDER_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.cancel(orderRequest));
  }

  @Operation(summary = "Xác nhận đơn hàng", description = "Hệ thống xác nhận đơn hàng")
  @PostMapping("/{id}")
  public ResponseEntity<ApiResponse<Object>> confirm(@PathVariable String id) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.CONFIRM_ORDER_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.confirm(id));
  }

  @Operation(summary = "Từ chối đơn hàng", description = "Từ chối đơn hàng nếu có lý do")
  @PostMapping("/reject")
  public ResponseEntity<ApiResponse<Object>> reject(
      @Validated({OnReject.class, Default.class}) @RequestBody OrderRequest orderRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.REJECT_ORDER_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        orderService.reject(orderRequest));
  }
}
