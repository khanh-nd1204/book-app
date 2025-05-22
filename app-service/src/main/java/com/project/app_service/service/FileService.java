package com.project.app_service.service;

import com.project.app_service.model.dto.FileDTO;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
  FileDTO upload(MultipartFile file, String folder) throws Exception;

  void validate(MultipartFile file, String folder) throws Exception;

  void clear() throws Exception;
}
