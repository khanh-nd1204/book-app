package com.project.app_service.mapper;

import com.project.app_service.model.entity.OrderEntity;
import com.project.app_service.model.request.OrderRequest;
import com.project.app_service.model.response.OrderResponse;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {
      OrderItemMapper.class,
    })
public interface OrderMapper extends EntityMapper<OrderEntity, OrderRequest, OrderResponse> {}
