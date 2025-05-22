package com.project.app_service.service.impl;

import com.project.app_service.constant.Message;
import com.project.app_service.exception.FileStoreException;
import com.project.app_service.mapper.FileMapper;
import com.project.app_service.model.dto.FileDTO;
import com.project.app_service.model.entity.FileEntity;
import com.project.app_service.repo.CategoryRepo;
import com.project.app_service.repo.FileRepo;
import com.project.app_service.service.FileService;
import com.project.app_service.service.LogService;
import com.project.app_service.util.LanguageUtil;
import java.io.File;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileServiceImpl implements FileService {
  FileRepo fileRepo;
  CategoryRepo categoryRepo;
  FileMapper fileMapper;
  MessageSource messageSource;
  LogService logService;

  @Value("${file.upload.base-uri}")
  @NonFinal
  String baseUri;

  @Override
  public FileDTO upload(MultipartFile file, String folder) throws Exception {
    String fileName = generateFileName(Objects.requireNonNull(file.getOriginalFilename()));
    URI uri = new URI(baseUri + folder + "/" + fileName);
    Path path = Paths.get(uri);
    try (InputStream inputStream = file.getInputStream()) {
      Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
    }
    FileEntity fileEntity = new FileEntity();
    fileEntity.setUrl("/upload/" + folder + "/" + fileName);
    fileEntity.setFolder(folder);
    fileRepo.save(fileEntity);

    return fileMapper.toDTO(fileEntity);
  }

  @Override
  public void validate(MultipartFile file, String folder) throws Exception {
    if (file == null || file.isEmpty()) {
      throw new FileStoreException(
          messageSource.getMessage(
              Message.FILE_NULL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    if (folder == null || folder.isEmpty()) {
      throw new FileStoreException(
          messageSource.getMessage(
              Message.FOLDER_NULL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    URI uri = new URI(baseUri + folder);
    Path path = Paths.get(uri);
    File tmpDir = new File(path.toString());
    if (!tmpDir.isDirectory()) {
      throw new FileStoreException(
          messageSource.getMessage(
              Message.FOLDER_NULL.getKey(), null, LanguageUtil.getCurrentLocale()));
    }

    String fileName = file.getOriginalFilename();
    List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
    boolean isValidExtension =
        allowedExtensions.stream()
            .anyMatch(ext -> Objects.requireNonNull(fileName).toLowerCase().endsWith("." + ext));
    if (!isValidExtension) {
      throw new FileStoreException(
          messageSource.getMessage(
              Message.INVALID_FILE.getKey(), null, LanguageUtil.getCurrentLocale()));
    }
  }

  @Override
  @Transactional
  public void clear() throws Exception {
    List<String> usedFileIdsFromCategory = categoryRepo.findUsedFileIdsFromCategory();

    List<String> usedFileIdsFromBook = fileRepo.findUsedFileIdsFromBook();

    Set<String> usedFileIds = new HashSet<>();
    usedFileIds.addAll(usedFileIdsFromCategory);
    usedFileIds.addAll(usedFileIdsFromBook);

    List<FileEntity> filesToDelete =
        fileRepo.findAll().stream()
            .filter(file -> !usedFileIds.contains(file.getId()))
            .collect(Collectors.toList());

    fileRepo.deleteAll(filesToDelete);

    logService.create("images", Message.ACTION_CLEAN.getKey(), Message.CLEAN_SUCCESS.getKey());
  }

  private String generateFileName(String originalFileName) {
    String fileExtension = "";
    int dotIndex = originalFileName.lastIndexOf('.');
    if (dotIndex >= 0) {
      fileExtension = originalFileName.substring(dotIndex);
    }
    return UUID.randomUUID() + fileExtension;
  }
}
