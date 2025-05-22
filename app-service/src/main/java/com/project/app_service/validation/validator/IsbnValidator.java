package com.project.app_service.validation.validator;

import com.project.app_service.validation.constraint.IsbnConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IsbnValidator implements ConstraintValidator<IsbnConstraint, String> {
  @Override
  public boolean isValid(String isbn, ConstraintValidatorContext constraintValidatorContext) {
    if (isbn == null) {
      return true;
    }

    if (isbn.length() != 13 || !isbn.matches("\\d{13}")) {
      return false;
    }

    int sum = 0;
    for (int i = 0; i < 12; i++) {
      int digit = Character.getNumericValue(isbn.charAt(i));
      sum += (i % 2 == 0) ? digit : digit * 3;
    }

    int checkDigit = (10 - (sum % 10)) % 10;

    // Kiểm tra chỉ số 12 sau khi chắc chắn rằng isbn có đúng 13 ký tự
    return checkDigit == Character.getNumericValue(isbn.charAt(12));
  }
}
