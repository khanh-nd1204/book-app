package com.project.app_service.controller;

import com.project.app_service.constant.Message;
import com.project.app_service.model.dto.FileDTO;
import com.project.app_service.model.response.ApiResponse;
import com.project.app_service.service.FileService;
import com.project.app_service.util.ApiResponseUtil;
import com.project.app_service.util.LanguageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("file")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Tệp tin", description = "Quản lý tệp tin")
@SecurityRequirement(name = "bearerToken")
public class FileCtrl {
  FileService fileService;

  MessageSource messageSource;

  @Operation(
      summary = "Tải lên tệp tin",
      description = "Upload tệp tin lên server và lưu vào thư mục chỉ định")
  @PostMapping("/upload")
  public ResponseEntity<ApiResponse<Object>> upload(
      @RequestParam("file") MultipartFile file, @RequestParam("folder") String folder)
      throws Exception {
    fileService.validate(file, folder);
    FileDTO fileDTO = fileService.upload(file, folder);
    return ApiResponseUtil.buildSuccessResponse(
        HttpStatus.OK,
        messageSource.getMessage(
            Message.UPDATE_SUCCESS.getKey(), null, LanguageUtil.getCurrentLocale()),
        fileDTO);
  }
}
