package com.project.app_service.mapper;

import com.project.app_service.model.entity.BookExportEntity;
import com.project.app_service.model.request.BookExportRequest;
import com.project.app_service.model.response.BookExportResponse;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {
      BookExportItemMapper.class,
    })
public interface BookExportMapper
    extends EntityMapper<BookExportEntity, BookExportRequest, BookExportResponse> {}
