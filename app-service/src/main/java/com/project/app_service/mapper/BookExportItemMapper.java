package com.project.app_service.mapper;

import com.project.app_service.model.dto.BookExportItemDTO;
import com.project.app_service.model.entity.BookExportItemEntity;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {BookMapper.class})
public interface BookExportItemMapper {
  BookExportItemDTO toDTO(BookExportItemEntity bookExportItemEntity);
}
