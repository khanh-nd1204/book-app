package com.project.app_service.service;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
  String createVnPayPayment(HttpServletRequest request) throws Exception;
}
