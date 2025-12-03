package mr.gov.anrsi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import mr.gov.anrsi.service.AppelsCandidaturesImportService;

@RestController
@RequestMapping("/api/admin/appels-candidatures")
@ConditionalOnProperty(name = "spring.datasource.url")
@PreAuthorize("hasRole('ADMIN')")
public class AppelsCandidaturesImportController {
    
    private static final Logger logger = LoggerFactory.getLogger(AppelsCandidaturesImportController.class);
    
    @Autowired
    private AppelsCandidaturesImportService importService;
    
    @PostMapping(value = "/import", consumes = {"multipart/form-data", "application/x-www-form-urlencoded"})
    public ResponseEntity<Map<String, Object>> importFromFile(
            @RequestParam(required = false) String filePath,
            @RequestParam(required = false) MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String pathToImport;
            boolean isTemporaryFile = false;
            
            // Handle file upload - check file first (for multipart requests)
            if (file != null && !file.isEmpty()) {
                // Save uploaded file temporarily
                String tempDir = System.getProperty("java.io.tmpdir");
                String tempFileName = "import-" + UUID.randomUUID().toString() + ".json";
                Path tempFilePath = Paths.get(tempDir, tempFileName);
                
                Files.write(tempFilePath, file.getBytes());
                pathToImport = tempFilePath.toAbsolutePath().toString();
                isTemporaryFile = true;
                logger.info("Saved uploaded file to temporary location: {}", pathToImport);
            } else if (filePath != null && !filePath.trim().isEmpty()) {
                // Use provided file path
                pathToImport = filePath;
            } else {
                response.put("success", false);
                response.put("error", "Either filePath or file must be provided");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Import the file
            importService.importFromJsonFile(pathToImport);
            
            // Clean up temporary file if it was uploaded
            if (isTemporaryFile) {
                try {
                    Files.deleteIfExists(Paths.get(pathToImport));
                    logger.info("Deleted temporary file: {}", pathToImport);
                } catch (IOException e) {
                    logger.warn("Failed to delete temporary file: {}", pathToImport, e);
                }
            }
            
            response.put("success", true);
            response.put("message", "Import completed successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error importing appels candidatures", e);
            response.put("success", false);
            response.put("error", "File not found or cannot be read: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Error importing appels candidatures", e);
            response.put("success", false);
            response.put("error", "Import failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
