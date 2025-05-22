package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.request.CartItemRequest;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.CartService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import com.project.app_service.validation.group.OnAddCart;
import com.project.app_service.validation.group.OnRemoveCart;
import com.project.app_service.validation.group.OnUpdateCart;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("carts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Giỏ hàng", description = "Giỏ hàng người dùng")
public class CartCtrl {
  CartService cartService;

  MessageSource messageSource;

  @Operation(
      summary = "Thêm vào giỏ hàng",
      description =
          "Tạo giỏ hàng nếu người dùng chưa có giỏ hàng hoặc thêm sản phẩm vào giỏ hàng đã có",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping("/add")
  public ResponseEntity<ApiResponse<Object>> add(
      @Validated({OnAddCart.class, Default.class}) @RequestBody CartItemRequest cartItemRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.ADD_CART_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        cartService.add(cartItemRequest));
  }

  @Operation(
      summary = "Xóa sản phẩm",
      description = "Xóa bỏ sản phẩm đang có trong giỏ hàng",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping("/remove")
  public ResponseEntity<ApiResponse<Object>> remove(
      @Validated({OnRemoveCart.class, Default.class}) @RequestBody CartItemRequest cartItemRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        cartService.remove(cartItemRequest));
  }

  @Operation(
      summary = "Cập nhật số lượng",
      description = "Cập nhật số lượng sản phẩm trong giỏ hàng",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping("/update")
  public ResponseEntity<ApiResponse<Object>> update(
      @Validated({OnUpdateCart.class, Default.class}) @RequestBody CartItemRequest cartItemRequest)
      throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        cartService.update(cartItemRequest));
  }

  @Operation(
      summary = "Lấy thông tin giỏ hàng",
      description = "Lấy thông tin giỏ hàng của người dùng",
      security = @SecurityRequirement(name = "bearerToken"))
  @GetMapping
  public ResponseEntity<ApiResponse<Object>> get() throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.FETCH_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        cartService.get());
  }

  @Operation(
      summary = "Xóa sản phẩm sau khi đặt hàng",
      description = "Xóa bỏ sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công",
      security = @SecurityRequirement(name = "bearerToken"))
  @PostMapping("/reset")
  public ResponseEntity<ApiResponse<Object>> remove(
      @Valid @RequestBody List<CartItemRequest> cartItemRequests) throws Exception {
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.DELETE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        cartService.reset(cartItemRequests));
  }
}
