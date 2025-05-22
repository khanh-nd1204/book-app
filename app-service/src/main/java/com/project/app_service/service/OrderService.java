package com.project.app_service.service;

import com.project.app_service.model.entity.OrderEntity;
import com.project.app_service.model.request.OrderRequest;
import com.project.app_service.model.response.OrderResponse;
import com.project.app_service.model.response.PageResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface OrderService {
  OrderResponse create(OrderRequest orderRequest) throws Exception;

  OrderResponse update(OrderRequest orderRequest) throws Exception;

  OrderResponse getById(String id) throws Exception;

  PageResponse<List<OrderResponse>> search(Specification<OrderEntity> spec, Pageable pageable)
      throws Exception;

  PageResponse<List<OrderResponse>> searchByUser(Specification<OrderEntity> spec, Pageable pageable)
      throws Exception;

  OrderResponse cancel(OrderRequest orderRequest) throws Exception;

  String confirm(String id) throws Exception;

  String reject(OrderRequest orderRequest) throws Exception;
}
