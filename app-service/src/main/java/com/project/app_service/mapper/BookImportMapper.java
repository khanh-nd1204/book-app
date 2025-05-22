package com.project.app_service.mapper;

import com.project.app_service.model.entity.BookImportEntity;
import com.project.app_service.model.request.BookImportRequest;
import com.project.app_service.model.response.BookImportResponse;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {
      BookImportItemMapper.class,
    })
public interface BookImportMapper
    extends EntityMapper<BookImportEntity, BookImportRequest, BookImportResponse> {}
