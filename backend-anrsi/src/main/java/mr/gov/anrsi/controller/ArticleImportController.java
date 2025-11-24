package mr.gov.anrsi.controller;

import mr.gov.anrsi.service.ArticleImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles/import")
@CrossOrigin(origins = "*")
public class ArticleImportController {
    
    @Autowired
    private ArticleImportService importService;
    
    /**
     * Import articles from multiple JSON files (supports FR, AR, EN translations)
     * @param request Can contain either:
     *                - "filePath" (String): Single file path (backward compatibility)
     *                - "filePaths" (List<String>): Multiple file paths
     * @return Import result
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> importArticles(@RequestBody Map<String, Object> request) {
        List<String> filePaths = null;
        
        // Support both single file (backward compatibility) and multiple files
        if (request.containsKey("filePaths")) {
            Object filePathsObj = request.get("filePaths");
            if (filePathsObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Object> paths = (List<Object>) filePathsObj;
                filePaths = paths.stream()
                    .map(Object::toString)
                    .filter(path -> path != null && !path.trim().isEmpty())
                    .toList();
            }
        } else if (request.containsKey("filePath")) {
            // Backward compatibility: single file path
            String filePath = request.get("filePath").toString();
            if (filePath != null && !filePath.trim().isEmpty()) {
                filePaths = List.of(filePath);
            }
        }
        
        if (filePaths == null || filePaths.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "File path(s) are required. Use 'filePath' (single) or 'filePaths' (array)");
            return ResponseEntity.badRequest().body(response);
        }
        
        ArticleImportService.ImportResult result = importService.importArticlesFromMultipleFiles(filePaths);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("totalNodes", result.getTotalNodes());
        response.put("successCount", result.getSuccessCount());
        response.put("failureCount", result.getFailureCount());
        response.put("errors", result.getErrors());
        response.put("filesProcessed", filePaths.size());
        
        return ResponseEntity.ok(response);
    }
}

