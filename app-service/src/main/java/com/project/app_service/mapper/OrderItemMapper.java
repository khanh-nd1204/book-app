package com.project.app_service.mapper;

import com.project.app_service.model.dto.OrderItemDTO;
import com.project.app_service.model.entity.OrderItemEntity;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {BookMapper.class})
public interface OrderItemMapper {
  OrderItemDTO toDTO(OrderItemEntity orderItemEntity);
}
