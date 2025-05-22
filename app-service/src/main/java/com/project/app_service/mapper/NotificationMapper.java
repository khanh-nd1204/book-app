package com.project.app_service.mapper;

import com.project.app_service.model.entity.NotificationEntity;
import com.project.app_service.model.request.NotificationRequest;
import com.project.app_service.model.response.NotificationResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper
    extends EntityMapper<NotificationEntity, NotificationRequest, NotificationResponse> {}
