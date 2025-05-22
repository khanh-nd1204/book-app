package com.project.app_service.service;

import com.project.app_service.model.request.CartItemRequest;
import com.project.app_service.model.response.CartResponse;
import java.util.List;

public interface CartService {
  CartResponse add(CartItemRequest cartItemRequest) throws Exception;

  CartResponse remove(CartItemRequest cartItemRequest) throws Exception;

  CartResponse update(CartItemRequest cartItemRequest) throws Exception;

  CartResponse get() throws Exception;

  CartResponse reset(List<CartItemRequest> cartItemRequests) throws Exception;
}
