package com.project.app_service.mapper;

import com.project.app_service.model.entity.CartEntity;
import com.project.app_service.model.request.CartRequest;
import com.project.app_service.model.response.CartResponse;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {
      CartItemMapper.class,
    })
public interface CartMapper extends EntityMapper<CartEntity, CartRequest, CartResponse> {}
