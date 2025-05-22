package com.project.app_service.mapper;

import com.project.app_service.model.dto.PublisherDTO;
import com.project.app_service.model.entity.PublisherEntity;
import com.project.app_service.model.request.PublisherRequest;
import com.project.app_service.model.response.PublisherResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PublisherMapper
    extends EntityMapper<PublisherEntity, PublisherRequest, PublisherResponse> {

  PublisherDTO toDTO(PublisherEntity publisherEntity);
}
