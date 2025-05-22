package com.project.app_service.mapper;

import com.project.app_service.model.dto.CartItemDTO;
import com.project.app_service.model.entity.CartItemEntity;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {BookMapper.class})
public interface CartItemMapper {
  CartItemDTO toDTO(CartItemEntity cartItemEntity);
}
