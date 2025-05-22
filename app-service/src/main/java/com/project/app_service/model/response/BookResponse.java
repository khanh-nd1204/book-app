package com.project.app_service.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.app_service.model.dto.CategoryDTO;
import com.project.app_service.model.dto.FileDTO;
import com.project.app_service.model.dto.PublisherDTO;
import java.time.Instant;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookResponse {
  String sku;
  String title;
  Double importPrice;
  Double sellingPrice;
  Integer profit;
  Double finalPrice;
  Integer discount;
  Integer publishYear;
  Integer stockQuantity;
  Integer soldQuantity;
  Integer weight;
  Integer pageNumber;
  Integer form;
  String description;
  String isbn;
  Integer status;
  String authors;
  PublisherDTO publisher;
  //  SupplierDTO supplier;
  List<CategoryDTO> categories;
  List<FileDTO> images;

  @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy", timezone = "GMT+7")
  Instant createdAt;

  String createdBy;

  @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy", timezone = "GMT+7")
  Instant updatedAt;

  String updatedBy;
}
