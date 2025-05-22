package com.project.app_service.service.impl;

import com.project.app_service.config.VNPayConfig;
import com.project.app_service.service.PaymentService;
import com.project.app_service.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentServiceImpl implements PaymentService {
  VNPayConfig vnPayConfig;

  @Override
  public String createVnPayPayment(HttpServletRequest request) {
    long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
    String bankCode = request.getParameter("bankCode");

    Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
    vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
    if (bankCode != null && !bankCode.isEmpty()) {
      vnpParamsMap.put("vnp_BankCode", bankCode);
    }
    vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

    String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
    String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
    String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
    queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

    return vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
  }
}
