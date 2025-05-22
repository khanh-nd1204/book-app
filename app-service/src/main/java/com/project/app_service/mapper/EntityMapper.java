package com.project.app_service.mapper;

import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

public interface EntityMapper<E, Q, P> {
  E toEntity(Q request);

  List<E> toEntities(List<Q> requests);

  P toResponse(E entity);

  List<P> toResponses(List<E> entities);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateEntity(@MappingTarget E entity, Q request);
}
