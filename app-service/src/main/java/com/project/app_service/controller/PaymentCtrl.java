package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.impl.PaymentServiceImpl;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Thanh toán", description = "Thanh toán qua ví VNPay")
@SecurityRequirement(name = "bearerToken")
public class PaymentCtrl {
  PaymentServiceImpl paymentService;

  MessageSource messageSource;

  @Operation(summary = "Gửi yêu cầu thanh toán", description = "Gửi yêu cầu thanh toán cho VNPay")
  @GetMapping("/vn-pay")
  public ResponseEntity<ApiResponse<Object>> pay(HttpServletRequest request) {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.REQUEST_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        paymentService.createVnPayPayment(request));
  }
}
