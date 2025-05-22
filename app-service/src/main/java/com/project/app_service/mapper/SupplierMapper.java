package com.project.app_service.mapper;

import com.project.app_service.model.dto.SupplierDTO;
import com.project.app_service.model.entity.SupplierEntity;
import com.project.app_service.model.request.SupplierRequest;
import com.project.app_service.model.response.SupplierResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupplierMapper
    extends EntityMapper<SupplierEntity, SupplierRequest, SupplierResponse> {

  SupplierDTO toDTO(SupplierEntity supplierEntity);
}
