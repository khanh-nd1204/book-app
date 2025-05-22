package com.project.app_service.util;

import java.util.Locale;
import org.springframework.context.i18n.LocaleContextHolder;

public class LanguageUtil {
  public static Locale getCurrentLocale() {
    return LocaleContextHolder.getLocale();
  }

  public static String getCurrentLanguage() {
    return LocaleContextHolder.getLocale().getLanguage();
  }
}
