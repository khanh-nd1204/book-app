package com.project.app_service.model.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.project.app_service.util.StringTrimDeserializer;
import com.project.app_service.validation.constraint.IsbnConstraint;
import com.project.app_service.validation.constraint.PublishYearConstraint;
import com.project.app_service.validation.group.OnCreate;
import com.project.app_service.validation.group.OnUpdate;
import jakarta.validation.constraints.*;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookRequest {
  @NotBlank(
      groups = {OnUpdate.class},
      message = "{validation.sku.required}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String sku;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.title.required}")
  @Size(max = 100, message = "{validation.title.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String title;

  @NotNull(
      groups = {OnUpdate.class},
      message = "{validation.discount.required}")
  @Min(value = 0, message = "{validation.discount.min}")
  @Max(value = 100, message = "{validation.discount.max}")
  Integer discount;

  @NotNull(
      groups = {OnUpdate.class},
      message = "{validation.profit.required}")
  @Min(value = 0, message = "{validation.profit.min}")
  Integer profit;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.publish_year.required}")
  @PublishYearConstraint(message = "{validation.publish_year.invalid}")
  Integer publishYear;

  @NotNull(
      groups = {OnCreate.class},
      message = "{validation.import_price.required}")
  @Min(value = 0, message = "{validation.import_price.min}")
  Integer importPrice;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.stock_quantity.required}")
  @Min(value = 0, message = "{validation.stock_quantity.min}")
  Integer stockQuantity;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.sold_quantity.required}")
  @Min(value = 0, message = "{validation.sold_quantity.min}")
  Integer soldQuantity;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.weight.required}")
  @Min(value = 100, message = "{validation.weight.min}")
  Integer weight;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.page_number.required}")
  @Min(value = 100, message = "{validation.page_number.min}")
  Integer pageNumber;

  @NotNull(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.form.required}")
  @Min(value = 1, message = "{validation.form.invalid}")
  @Max(value = 2, message = "{validation.form.invalid}")
  Integer form;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.desc.required}")
  @Size(max = 2000, message = "{validation.desc_long.max_length}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String description;

  @IsbnConstraint(message = "{validation.isbn.invalid}")
  @JsonDeserialize(using = StringTrimDeserializer.class)
  String isbn;

  @NotNull(
      groups = {OnUpdate.class},
      message = "{validation.status.required}")
  @Min(value = -1, message = "{validation.status.invalid}")
  @Max(value = 1, message = "{validation.status.invalid}")
  Integer status;

  @NotBlank(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.publisher.required}")
  String publisherId;

  @NotEmpty(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.author.required")
  String authors;

  @NotEmpty(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.category.required}")
  List<String> categoryIds;

  @NotEmpty(
      groups = {OnCreate.class, OnUpdate.class},
      message = "{validation.image.required}")
  List<String> imageIds;
}
