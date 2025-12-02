package mr.gov.anrsi.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

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

import mr.gov.anrsi.service.AppelsCandidaturesImportService;

@RestController
@RequestMapping("/api/admin/appels-candidatures")
@ConditionalOnProperty(name = "spring.datasource.url")
@PreAuthorize("hasRole('ADMIN')")
public class AppelsCandidaturesImportController {
    
    private static final Logger logger = LoggerFactory.getLogger(AppelsCandidaturesImportController.class);
    
    @Autowired
    private AppelsCandidaturesImportService importService;
    
    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importFromFile(@RequestParam String filePath) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            importService.importFromJsonFile(filePath);
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
