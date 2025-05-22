package com.project.app_service.mapper;

import com.project.app_service.model.dto.BookImportItemDTO;
import com.project.app_service.model.entity.BookImportItemEntity;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {BookMapper.class})
public interface BookImportItemMapper {
  BookImportItemDTO toDTO(BookImportItemEntity bookImportItemEntity);
}
