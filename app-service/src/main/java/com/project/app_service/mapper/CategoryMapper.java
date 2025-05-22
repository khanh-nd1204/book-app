package com.project.app_service.mapper;

import com.project.app_service.model.dto.CategoryDTO;
import com.project.app_service.model.entity.CategoryEntity;
import com.project.app_service.model.request.CategoryRequest;
import com.project.app_service.model.response.CategoryResponse;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {FileMapper.class})
public interface CategoryMapper
    extends EntityMapper<CategoryEntity, CategoryRequest, CategoryResponse> {

  CategoryDTO toDTO(CategoryEntity categoryEntity);
}
