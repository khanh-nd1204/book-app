package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.RevenueService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("revenue")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Doanh thu", description = "Quản lý doanh thu")
public class RevenueCtrl {
  RevenueService revenueService;

  MessageSource messageSource;

  @GetMapping("/summary")
  @Operation(
      summary = "Tổng hợp doanh thu",
      description = "Tổng hợp doanh thu theo từng khoảng thời gian")
  public ResponseEntity<ApiResponse<Object>> getSummary(
      @RequestParam Instant from, @RequestParam Instant to) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        revenueService.getSummary(from, to));
  }

  @GetMapping("/chart")
  @Operation(
      summary = "Thống kê doanh thu",
      description = "Thống kê doanh thu theo ngày hoặc theo tháng")
  public ResponseEntity<ApiResponse<Object>> getChart(
      @RequestParam Instant from,
      @RequestParam Instant to,
      @RequestParam(defaultValue = "DAY") String groupBy)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        revenueService.getChart(from, to, groupBy));
  }

  @GetMapping("/top-products")
  @Operation(
      summary = "Top sản phẩm bán chạy",
      description = "Danh sách top sản phẩm bán chạy theo thời gian")
  public ResponseEntity<ApiResponse<Object>> getTopProducts(
      @RequestParam Instant from,
      @RequestParam Instant to,
      @RequestParam(defaultValue = "5") int limit)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        revenueService.getTopProducts(from, to, limit));
  }
}
