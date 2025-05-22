package com.project.app_service.mapper;

import com.project.app_service.model.dto.FileDTO;
import com.project.app_service.model.entity.FileEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FileMapper {
  FileDTO toDTO(FileEntity fileEntity);
}
