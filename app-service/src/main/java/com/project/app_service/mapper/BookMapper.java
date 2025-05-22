package com.project.app_service.mapper;

import com.project.app_service.model.dto.BookDTO;
import com.project.app_service.model.entity.BookEntity;
import com.project.app_service.model.request.BookRequest;
import com.project.app_service.model.response.BookResponse;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {PublisherMapper.class, CategoryMapper.class, FileMapper.class})
public interface BookMapper extends EntityMapper<BookEntity, BookRequest, BookResponse> {
  default BookDTO map(BookEntity bookEntity) {
    if (bookEntity != null) {
      return BookDTO.builder()
          .sku(bookEntity.getSku())
          .title(bookEntity.getTitle())
          .isbn(bookEntity.getIsbn())
          .stockQuantity(bookEntity.getStockQuantity())
          .thumbnail(bookEntity.getImages().get(0).getUrl())
          .finalPrice(bookEntity.getFinalPrice())
          .build();
    }
    return null;
  }
}
