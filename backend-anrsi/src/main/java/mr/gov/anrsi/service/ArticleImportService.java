package mr.gov.anrsi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import mr.gov.anrsi.dto.ArticleCreateDTO;
import mr.gov.anrsi.dto.ArticleImportNodeDTO;
import mr.gov.anrsi.dto.ArticleTranslationDTO;
import mr.gov.anrsi.entity.Language;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ArticleImportService {
    
    private static final Logger logger = LoggerFactory.getLogger(ArticleImportService.class);
    
    @Autowired
    private ArticleService articleService;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${server.servlet.context-path:}")
    private String contextPath;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Get upload directory path (absolute)
     */
    private Path getUploadPath() {
        Path path = Paths.get(uploadDir);
        if (!path.isAbsolute()) {
            path = Paths.get(System.getProperty("user.dir"), uploadDir);
        }
        return path;
    }
    
    /**
     * Download image from URL and save it locally
     * @param imageUrl Remote image URL
     * @return Local file URL (e.g., "/uploads/filename.jpg") or null if download fails
     */
    private String downloadAndSaveImage(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return null;
        }
        
        // Skip if already a local URL
        if (imageUrl.startsWith("/uploads/") || !imageUrl.startsWith("http")) {
            return imageUrl;
        }
        
        try {
            // Get upload directory
            Path uploadPath = getUploadPath();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            }
            
            // Extract file extension from URL
            String extension = "";
            try {
                // Decode URL to handle encoded characters
                String decodedUrl = URLDecoder.decode(imageUrl, StandardCharsets.UTF_8.name());
                int lastDot = decodedUrl.lastIndexOf('.');
                int lastSlash = decodedUrl.lastIndexOf('/');
                if (lastDot > lastSlash && lastDot > 0) {
                    String ext = decodedUrl.substring(lastDot);
                    // Validate extension (only image extensions)
                    if (ext.matches("\\.(jpg|jpeg|png|gif|webp|bmp|svg)$")) {
                        extension = ext.toLowerCase();
                    }
                }
            } catch (Exception e) {
                logger.warn("Could not extract extension from URL: {}", imageUrl, e);
            }
            
            // Default to .jpg if no extension found
            if (extension.isEmpty()) {
                extension = ".jpg";
            }
            
            // Generate unique filename
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);
            
            // Download the image
            logger.info("Downloading image from: {}", imageUrl);
            URL url = new URI(imageUrl).toURL();
            
            // Use HttpURLConnection for better control (timeout, headers, etc.)
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(10000); // 10 seconds connection timeout
            connection.setReadTimeout(30000); // 30 seconds read timeout
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            try (InputStream in = connection.getInputStream()) {
                Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
                logger.info("Image downloaded successfully: {} -> {}", imageUrl, filename);
                
                // Return local URL
                String cleanContextPath = contextPath.endsWith("/") 
                    ? contextPath.substring(0, contextPath.length() - 1) 
                    : contextPath;
                return cleanContextPath + "/uploads/" + filename;
            } finally {
                connection.disconnect();
            }
            
        } catch (Exception e) {
            logger.error("Failed to download image from URL: {} - {}", imageUrl, e.getMessage());
            // Return original URL if download fails (fallback)
            return imageUrl;
        }
    }
    
    /**
     * Import articles from multiple JSON files, merging translations by node_id
     * @param jsonFilePaths List of paths to JSON files (can contain FR, AR, EN translations)
     * @return Import result with success count and errors
     */
    public ImportResult importArticlesFromMultipleFiles(List<String> jsonFilePaths) {
        ImportResult result = new ImportResult();
        
        // Map to group nodes by node_id across all files
        Map<Long, Map<Language, ArticleImportNodeDTO>> articlesByNodeId = new HashMap<>();
        
        // Read all files and group by node_id
        for (String jsonFilePath : jsonFilePaths) {
            try {
                File jsonFile = new File(jsonFilePath);
                if (!jsonFile.exists()) {
                    result.addError("File not found: " + jsonFilePath);
                    continue;
                }
                
                List<ArticleImportNodeDTO> nodes = objectMapper.readValue(
                    jsonFile, 
                    new TypeReference<List<ArticleImportNodeDTO>>() {}
                );
                
                // Group nodes by node_id and language
                for (ArticleImportNodeDTO node : nodes) {
                    if (node.getNodeId() == null) {
                        result.addError("Node with null node_id found in file: " + jsonFilePath);
                        continue;
                    }
                    
                    Language language = determineLanguage(node.getUrl());
                    articlesByNodeId
                        .computeIfAbsent(node.getNodeId(), k -> new HashMap<>())
                        .put(language, node);
                }
                
            } catch (IOException e) {
                result.addError("Error reading JSON file " + jsonFilePath + ": " + e.getMessage());
            }
        }
        
        result.setTotalNodes(articlesByNodeId.size());
        
        // Process each article (grouped by node_id) with all its translations
        for (Map.Entry<Long, Map<Language, ArticleImportNodeDTO>> entry : articlesByNodeId.entrySet()) {
            try {
                importArticleWithTranslations(entry.getKey(), entry.getValue());
                result.incrementSuccess();
            } catch (Exception e) {
                result.addError("Node " + entry.getKey() + ": " + e.getMessage());
            }
        }
        
        return result;
    }
    
    /**
     * Import articles from JSON file (single file - backward compatibility)
     * @param jsonFilePath Path to the JSON file
     * @return Import result with success count and errors
     */
    public ImportResult importArticlesFromJson(String jsonFilePath) {
        return importArticlesFromMultipleFiles(List.of(jsonFilePath));
    }
    
    /**
     * Import an article with multiple translations (grouped by node_id)
     * @param nodeId The node ID
     * @param translationsByLanguage Map of language to node data
     */
    private void importArticleWithTranslations(Long nodeId, Map<Language, ArticleImportNodeDTO> translationsByLanguage) {
        if (translationsByLanguage.isEmpty()) {
            throw new IllegalArgumentException("No translations found for node " + nodeId);
        }
        
        // Get the first node (they all have the same node_id)
        ArticleImportNodeDTO firstNode = translationsByLanguage.values().iterator().next();
        
        // Check if this node has multilingual fields (new format: single node with all translations)
        boolean hasMultilingualFields = firstNode.getTitleEn() != null || firstNode.getTitleFr() != null 
            || firstNode.getContentTextEn() != null || firstNode.getContentTextFr() != null;
        
        // Determine publish date (use first available date)
        LocalDateTime publishDate = null;
        String imageUrl = null;
        
        for (ArticleImportNodeDTO node : translationsByLanguage.values()) {
            LocalDateTime nodeDate = parsePublishDate(node.getDate(), node.getUrl());
            if (publishDate == null || (nodeDate != null && nodeDate.isBefore(publishDate))) {
                publishDate = nodeDate;
            }
            
            // Use first non-empty image
            if (imageUrl == null && node.getImage() != null && !node.getImage().isEmpty()) {
                imageUrl = node.getImage();
            }
        }
        
        if (publishDate == null) {
            publishDate = LocalDateTime.now();
        }
        
        // Download and save image locally if it's a remote URL
        String localImageUrl = null;
        if (imageUrl != null && !imageUrl.isEmpty()) {
            localImageUrl = downloadAndSaveImage(imageUrl);
        }
        
        // Create ArticleCreateDTO
        ArticleCreateDTO articleDTO = new ArticleCreateDTO();
        articleDTO.setAuthor("ANRSI"); // Default author
        articleDTO.setPublishDate(publishDate);
        articleDTO.setImageUrl(localImageUrl); // Use local URL
        articleDTO.setPublished(true);
        articleDTO.setFeatured(false);
        
        // Create translations for all available languages
        Map<String, ArticleTranslationDTO> translations = new HashMap<>();
        
        if (hasMultilingualFields) {
            // NEW FORMAT: Single node with all translations (title_en, title_fr, content_text_en, etc.)
            
            // Arabic translation
            if (firstNode.getTitle() != null && !firstNode.getTitle().trim().isEmpty()) {
                String content = firstNode.getContentHtml() != null && !firstNode.getContentHtml().trim().isEmpty()
                    ? firstNode.getContentHtml().trim()
                    : (firstNode.getContentText() != null ? firstNode.getContentText().trim() : "");
                
                if (!content.isEmpty()) {
                    ArticleTranslationDTO arTranslation = new ArticleTranslationDTO();
                    arTranslation.setLanguage("ar");
                    arTranslation.setTitle(firstNode.getTitle().trim());
                    arTranslation.setContent(content);
                    arTranslation.setExcerpt(createExcerpt(firstNode.getContentText(), firstNode.getContentHtml()));
                    translations.put("ar", arTranslation);
                }
            }
            
            // English translation
            if (firstNode.getTitleEn() != null && !firstNode.getTitleEn().trim().isEmpty()) {
                String content = firstNode.getContentHtmlEn() != null && !firstNode.getContentHtmlEn().trim().isEmpty()
                    ? firstNode.getContentHtmlEn().trim()
                    : (firstNode.getContentTextEn() != null ? firstNode.getContentTextEn().trim() : "");
                
                if (!content.isEmpty()) {
                    ArticleTranslationDTO enTranslation = new ArticleTranslationDTO();
                    enTranslation.setLanguage("en");
                    enTranslation.setTitle(firstNode.getTitleEn().trim());
                    enTranslation.setContent(content);
                    enTranslation.setExcerpt(createExcerpt(firstNode.getContentTextEn(), firstNode.getContentHtmlEn()));
                    translations.put("en", enTranslation);
                }
            }
            
            // French translation
            if (firstNode.getTitleFr() != null && !firstNode.getTitleFr().trim().isEmpty()) {
                String content = firstNode.getContentHtmlFr() != null && !firstNode.getContentHtmlFr().trim().isEmpty()
                    ? firstNode.getContentHtmlFr().trim()
                    : (firstNode.getContentTextFr() != null ? firstNode.getContentTextFr().trim() : "");
                
                if (!content.isEmpty()) {
                    ArticleTranslationDTO frTranslation = new ArticleTranslationDTO();
                    frTranslation.setLanguage("fr");
                    frTranslation.setTitle(firstNode.getTitleFr().trim());
                    frTranslation.setContent(content);
                    frTranslation.setExcerpt(createExcerpt(firstNode.getContentTextFr(), firstNode.getContentHtmlFr()));
                    translations.put("fr", frTranslation);
                }
            }
            
        } else {
            // OLD FORMAT: Multiple nodes grouped by language (existing logic)
            for (Map.Entry<Language, ArticleImportNodeDTO> entry : translationsByLanguage.entrySet()) {
                Language language = entry.getKey();
                ArticleImportNodeDTO node = entry.getValue();
                
                // Validate required fields
                String title = node.getTitle() != null ? node.getTitle().trim() : "";
                if (title.isEmpty()) {
                    // Skip this translation if title is missing
                    continue;
                }
                
                // Get content - prefer HTML, fallback to text
                String content = "";
                if (node.getContentHtml() != null && !node.getContentHtml().trim().isEmpty()) {
                    content = node.getContentHtml().trim();
                } else if (node.getContentText() != null && !node.getContentText().trim().isEmpty()) {
                    content = node.getContentText().trim();
                }
                
                // Skip if no content
                if (content.isEmpty()) {
                    continue;
                }
                
                // Create translation
                ArticleTranslationDTO translation = new ArticleTranslationDTO();
                translation.setLanguage(language.name().toLowerCase());
                translation.setTitle(title);
                translation.setContent(content);
                
                // Create excerpt from content_text (first 200 characters)
                String excerpt = "";
                if (node.getContentText() != null && !node.getContentText().trim().isEmpty()) {
                    String text = node.getContentText().trim();
                    excerpt = text.length() > 200 ? text.substring(0, 200) + "..." : text;
                } else if (node.getContentHtml() != null && !node.getContentHtml().trim().isEmpty()) {
                    // Strip HTML tags for excerpt
                    String text = node.getContentHtml().replaceAll("<[^>]*>", "").trim();
                    excerpt = text.length() > 200 ? text.substring(0, 200) + "..." : text;
                }
                translation.setExcerpt(excerpt);
                
                translations.put(language.name().toLowerCase(), translation);
            }
        }
        
        if (translations.isEmpty()) {
            throw new IllegalArgumentException("No valid translations found for node " + nodeId);
        }
        
        articleDTO.setTranslations(translations);
        
        // Create article using ArticleService
        articleService.createArticle(articleDTO);
    }
    
    /**
     * Helper method to create excerpt from content
     */
    private String createExcerpt(String contentText, String contentHtml) {
        if (contentText != null && !contentText.trim().isEmpty()) {
            String text = contentText.trim();
            return text.length() > 200 ? text.substring(0, 200) + "..." : text;
        } else if (contentHtml != null && !contentHtml.trim().isEmpty()) {
            // Strip HTML tags for excerpt
            String text = contentHtml.replaceAll("<[^>]*>", "").trim();
            return text.length() > 200 ? text.substring(0, 200) + "..." : text;
        }
        return "";
    }
    
    /**
     * Determine language from URL
     */
    private Language determineLanguage(String url) {
        if (url == null) {
            return Language.FR; // Default to French
        }
        
        if (url.contains("/ar/") || url.contains("/?q=ar/")) {
            return Language.AR;
        } else if (url.contains("/en/") || url.contains("/?q=en/")) {
            return Language.EN;
        } else {
            return Language.FR; // Default to French
        }
    }
    
    /**
     * Parse publish date from date string or URL
     */
    private LocalDateTime parsePublishDate(String dateStr, String url) {
        if (dateStr != null && !dateStr.trim().isEmpty()) {
            try {
                // Try to parse the date string
                // You may need to adjust the format based on your date format
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                return LocalDateTime.parse(dateStr, formatter);
            } catch (Exception e) {
                // If parsing fails, try other formats or use current date
            }
        }
        
        // If no date provided, use current date
        return LocalDateTime.now();
    }
    
    /**
     * Result class for import operation
     */
    public static class ImportResult {
        private int totalNodes = 0;
        private int successCount = 0;
        private List<String> errors = new ArrayList<>();
        
        public void incrementSuccess() {
            successCount++;
        }
        
        public void addError(String error) {
            errors.add(error);
        }
        
        // Getters and setters
        public int getTotalNodes() {
            return totalNodes;
        }
        
        public void setTotalNodes(int totalNodes) {
            this.totalNodes = totalNodes;
        }
        
        public int getSuccessCount() {
            return successCount;
        }
        
        public void setSuccessCount(int successCount) {
            this.successCount = successCount;
        }
        
        public List<String> getErrors() {
            return errors;
        }
        
        public void setErrors(List<String> errors) {
            this.errors = errors;
        }
        
        public int getFailureCount() {
            return totalNodes - successCount;
        }
    }
}

