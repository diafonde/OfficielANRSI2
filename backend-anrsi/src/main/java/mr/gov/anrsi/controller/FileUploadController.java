package mr.gov.anrsi.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@ConditionalOnProperty(name = "spring.datasource.url")
public class FileUploadController {
    
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${server.servlet.context-path:}")
    private String contextPath;
    
    private Path getUploadPath() {
        Path path = Paths.get(uploadDir);
        // If relative path, make it relative to the current working directory
        if (!path.isAbsolute()) {
            path = Paths.get(System.getProperty("user.dir"), uploadDir);
        }
        return path;
    }
    
    @PostMapping("/image")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        // Check if file is null
        if (file == null) {
            logger.error("File parameter is null");
            response.put("error", "No file provided");
            return ResponseEntity.badRequest().body(response);
        }
        
        logger.info("Received file upload request: name={}, size={}, contentType={}", 
            file.getOriginalFilename(), file.getSize(), file.getContentType());
        
        try {
            // Validate file
            if (file.isEmpty()) {
                logger.warn("Received empty file");
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("error", "File must be an image");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate file size (10MB max)
            if (file.getSize() > 10 * 1024 * 1024) {
                response.put("error", "File size exceeds 10MB");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get upload path (absolute)
            Path uploadPath = getUploadPath();
            logger.info("Upload path: {}", uploadPath.toAbsolutePath());
            
            // Create upload directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                try {
                    Files.createDirectories(uploadPath);
                    logger.info("Created upload directory: {}", uploadPath.toAbsolutePath());
                } catch (IOException e) {
                    logger.error("Failed to create upload directory: {}", uploadPath.toAbsolutePath(), e);
                    response.put("error", "Failed to create upload directory: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
            
            // Check if directory is writable
            if (!Files.isWritable(uploadPath)) {
                logger.error("Upload directory is not writable: {}", uploadPath.toAbsolutePath());
                response.put("error", "Upload directory is not writable: " + uploadPath.toAbsolutePath());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return URL (remove leading slash from contextPath if present to avoid double slashes)
            String cleanContextPath = contextPath.endsWith("/") ? contextPath.substring(0, contextPath.length() - 1) : contextPath;
            String fileUrl = cleanContextPath + "/uploads/" + filename;
            response.put("url", fileUrl);
            response.put("filename", filename);
            
            logger.info("File uploaded successfully: filename={}, url={}", filename, fileUrl);
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Failed to upload file", e);
            response.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error during file upload", e);
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/document")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<Map<String, String>> uploadDocument(@RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        // Check if file is null
        if (file == null) {
            logger.error("File parameter is null");
            response.put("error", "No file provided");
            return ResponseEntity.badRequest().body(response);
        }
        
        logger.info("Received document upload request: name={}, size={}, contentType={}", 
            file.getOriginalFilename(), file.getSize(), file.getContentType());
        
        try {
            // Validate file
            if (file.isEmpty()) {
                logger.warn("Received empty file");
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate file type (PDF, DOC, DOCX, etc.)
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();
            boolean isValidType = false;
            
            if (contentType != null) {
                isValidType = contentType.equals("application/pdf") ||
                             contentType.equals("application/msword") ||
                             contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            }
            
            // Also check by extension as fallback
            if (!isValidType && originalFilename != null) {
                String lowerFilename = originalFilename.toLowerCase();
                isValidType = lowerFilename.endsWith(".pdf") ||
                             lowerFilename.endsWith(".doc") ||
                             lowerFilename.endsWith(".docx");
            }
            
            if (!isValidType) {
                response.put("error", "File must be a PDF or Word document");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate file size (50MB max for documents)
            if (file.getSize() > 50 * 1024 * 1024) {
                response.put("error", "File size exceeds 50MB");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get upload path (absolute)
            Path uploadPath = getUploadPath();
            logger.info("Upload path: {}", uploadPath.toAbsolutePath());
            
            // Create upload directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                try {
                    Files.createDirectories(uploadPath);
                    logger.info("Created upload directory: {}", uploadPath.toAbsolutePath());
                } catch (IOException e) {
                    logger.error("Failed to create upload directory: {}", uploadPath.toAbsolutePath(), e);
                    response.put("error", "Failed to create upload directory: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
            
            // Check if directory is writable
            if (!Files.isWritable(uploadPath)) {
                logger.error("Upload directory is not writable: {}", uploadPath.toAbsolutePath());
                response.put("error", "Upload directory is not writable: " + uploadPath.toAbsolutePath());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
            // Generate unique filename while preserving extension
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return URL (remove leading slash from contextPath if present to avoid double slashes)
            String cleanContextPath = contextPath.endsWith("/") ? contextPath.substring(0, contextPath.length() - 1) : contextPath;
            String fileUrl = cleanContextPath + "/uploads/" + filename;
            response.put("url", fileUrl);
            response.put("filename", filename);
            
            logger.info("Document uploaded successfully: filename={}, url={}", filename, fileUrl);
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Failed to upload document", e);
            response.put("error", "Failed to upload document: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error during document upload", e);
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

