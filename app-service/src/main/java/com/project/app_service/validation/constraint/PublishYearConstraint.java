package com.project.app_service.validation.constraint;

import com.project.app_service.validation.validator.PublishYearValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {PublishYearValidator.class})
public @interface PublishYearConstraint {
  String message() default "Invalid publish year";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  int min() default 1900;
}
