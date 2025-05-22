package com.project.app_service.validation.constraint;

import com.project.app_service.validation.validator.IsbnValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {IsbnValidator.class})
public @interface IsbnConstraint {
  String message() default "Invalid ISBN";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
