package com.project.app_service.validation.validator;

import com.project.app_service.validation.constraint.PublishYearConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class PublishYearValidator implements ConstraintValidator<PublishYearConstraint, Integer> {
  private int min;

  @Override
  public void initialize(PublishYearConstraint constraintAnnotation) {
    ConstraintValidator.super.initialize(constraintAnnotation);
    min = constraintAnnotation.min();
  }

  @Override
  public boolean isValid(Integer year, ConstraintValidatorContext constraintValidatorContext) {
    int currentYear = LocalDate.now().getYear();
    return year >= min && year <= currentYear;
  }
}
