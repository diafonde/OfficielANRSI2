package mr.gov.anrsi.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import mr.gov.anrsi.dto.PageCreateDTO;
import mr.gov.anrsi.dto.PageTranslationDTO;
import mr.gov.anrsi.dto.PageUpdateDTO;
import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.repository.PageRepository;

@Service
@ConditionalOnProperty(name = "spring.datasource.url")
public class AppelsCandidaturesImportService {
    
    private static final Logger logger = LoggerFactory.getLogger(AppelsCandidaturesImportService.class);
    
    @Autowired
    private PageService pageService;
    
    @Autowired
    private PageRepository pageRepository;
    
    @org.springframework.beans.factory.annotation.Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @org.springframework.beans.factory.annotation.Value("${server.servlet.context-path:}")
    private String contextPath;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Import appels candidatures from JSON file
     * Supports both old format (single language) and new format (with translations)
     */
    @Transactional
    public void importFromJsonFile(String filePath) throws IOException {
        logger.info("Starting import from file: {}", filePath);
        
        // Read JSON file
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("File not found: " + filePath);
        }
        
        String jsonContent = new String(Files.readAllBytes(Paths.get(filePath)));
        JsonNode rootNode = objectMapper.readTree(jsonContent);
        
        if (!rootNode.isArray()) {
            throw new IllegalArgumentException("JSON file must contain an array of items");
        }
        
        // Check if items have translation structure
        boolean hasTranslations = rootNode.size() > 0 && 
            (rootNode.get(0).has("fr") || rootNode.get(0).has("ar") || rootNode.get(0).has("en"));
        
        // Build content structure
        Map<String, Object> contentTranslations = new HashMap<>();
        Map<String, Object> frContent = new HashMap<>();
        Map<String, Object> arContent = new HashMap<>();
        Map<String, Object> enContent = new HashMap<>();
        
        List<Map<String, Object>> frAppels = new ArrayList<>();
        List<Map<String, Object>> arAppels = new ArrayList<>();
        List<Map<String, Object>> enAppels = new ArrayList<>();
        
        // Process each item and download images
        int totalItems = rootNode.size();
        int processedItems = 0;
        for (JsonNode item : rootNode) {
            processedItems++;
            logger.info("Processing item {}/{}", processedItems, totalItems);
            
            if (hasTranslations) {
                // New format with translations
                processTranslatedItem(item, frAppels, arAppels, enAppels);
            } else {
                // Old format - single language (create for all 3 languages with same content)
                processSingleLanguageItem(item, frAppels, arAppels, enAppels);
            }
        }
        
        // Build content structure
        frContent.put("heroTitle", "Appels à Candidatures");
        frContent.put("heroSubtitle", "Opportunités de recherche et d'innovation en Mauritanie");
        frContent.put("introText", "L'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.");
        frContent.put("appels", frAppels);
        frContent.put("categories", new ArrayList<>());
        frContent.put("processSteps", new ArrayList<>());
        frContent.put("criteria", new ArrayList<>());
        frContent.put("supportServices", new ArrayList<>());
        frContent.put("contactInfo", new ArrayList<>());
        
        // Arabic content
        arContent.put("heroTitle", "دعوات التقديم");
        arContent.put("heroSubtitle", "فرص البحث والابتكار في موريتانيا");
        arContent.put("introText", "تطلق الوكالة الوطنية للبحث العلمي والابتكار بانتظام دعوات للتقديم لتمويل مشاريع البحث والابتكار التي تساهم في التنمية العلمية والتكنولوجية لموريتانيا.");
        arContent.put("appels", arAppels);
        arContent.put("categories", new ArrayList<>());
        arContent.put("processSteps", new ArrayList<>());
        arContent.put("criteria", new ArrayList<>());
        arContent.put("supportServices", new ArrayList<>());
        arContent.put("contactInfo", new ArrayList<>());
        
        // English content
        enContent.put("heroTitle", "Calls for Applications");
        enContent.put("heroSubtitle", "Research and innovation opportunities in Mauritania");
        enContent.put("introText", "ANRSI regularly launches calls for applications to fund research and innovation projects that contribute to the scientific and technological development of Mauritania.");
        enContent.put("appels", enAppels);
        enContent.put("categories", new ArrayList<>());
        enContent.put("processSteps", new ArrayList<>());
        enContent.put("criteria", new ArrayList<>());
        enContent.put("supportServices", new ArrayList<>());
        enContent.put("contactInfo", new ArrayList<>());
        
        contentTranslations.put("fr", frContent);
        contentTranslations.put("ar", arContent);
        contentTranslations.put("en", enContent);
        
        // Get or create page
        Optional<Page> existingPage = pageRepository.findBySlug("appels-candidatures");
        
        // Create translations map
        Map<String, PageTranslationDTO> translations = new HashMap<>();
        
        // Convert each language's content to JSON string separately
        // This matches how the frontend component saves data (language-specific content in content field)
        String frContentJson = objectMapper.writeValueAsString(frContent);
        String arContentJson = objectMapper.writeValueAsString(arContent);
        String enContentJson = objectMapper.writeValueAsString(enContent);
        
        // French translation
        PageTranslationDTO frTranslation = new PageTranslationDTO();
        frTranslation.setLanguage(Language.FR);
        frTranslation.setTitle("Appels à Candidatures");
        frTranslation.setHeroTitle("Appels à Candidatures");
        frTranslation.setHeroSubtitle("Opportunités de recherche et d'innovation en Mauritanie");
        frTranslation.setContent(frContentJson); // Store only French content
        frTranslation.setExtra(frContentJson); // Store only French content in extra
        translations.put("fr", frTranslation);
        
        // Arabic translation (if available)
        PageTranslationDTO arTranslation = new PageTranslationDTO();
        arTranslation.setLanguage(Language.AR);
        arTranslation.setTitle("دعوات الترشيح");
        arTranslation.setHeroTitle("دعوات الترشيح");
        arTranslation.setHeroSubtitle("فرص البحث والابتكار في موريتانيا");
        arTranslation.setContent(arContentJson); // Store only Arabic content
        arTranslation.setExtra(arContentJson); // Store only Arabic content in extra
        translations.put("ar", arTranslation);
        
        // English translation (if available)
        PageTranslationDTO enTranslation = new PageTranslationDTO();
        enTranslation.setLanguage(Language.EN);
        enTranslation.setTitle("Calls for Applications");
        enTranslation.setHeroTitle("Calls for Applications");
        enTranslation.setHeroSubtitle("Research and innovation opportunities in Mauritania");
        enTranslation.setContent(enContentJson); // Store only English content
        enTranslation.setExtra(enContentJson); // Store only English content in extra
        translations.put("en", enTranslation);
        
        if (existingPage.isPresent()) {
            // Update existing page
            Page page = existingPage.get();
            PageUpdateDTO updateDTO = new PageUpdateDTO();
            updateDTO.setTranslations(translations);
            updateDTO.setPageType(Page.PageType.STRUCTURED);
            updateDTO.setIsPublished(true);
            updateDTO.setIsActive(true);
            
            pageService.updatePage(page.getId(), updateDTO);
            logger.info("Updated existing page with {} appels (FR: {}, AR: {}, EN: {})", 
                frAppels.size(), frAppels.size(), arAppels.size(), enAppels.size());
        } else {
            // Create new page
            PageCreateDTO createDTO = new PageCreateDTO();
            createDTO.setSlug("appels-candidatures");
            createDTO.setPageType(Page.PageType.STRUCTURED);
            createDTO.setTranslations(translations);
            createDTO.setIsPublished(true);
            createDTO.setIsActive(true);
            
            pageService.createPage(createDTO);
            logger.info("Created new page with {} appels (FR: {}, AR: {}, EN: {})", 
                frAppels.size(), frAppels.size(), arAppels.size(), enAppels.size());
        }
        
        logger.info("Import completed successfully");
    }
    
    private void processTranslatedItem(JsonNode item, List<Map<String, Object>> frAppels, 
                                      List<Map<String, Object>> arAppels, 
                                      List<Map<String, Object>> enAppels) {
        // Get image from root level (shared across languages)
        String imageUrl = item.has("image") && !item.get("image").isNull() 
            ? item.get("image").asText() : null;
        
        // Download image if URL is provided
        String localImageUrl = null;
        if (imageUrl != null && imageUrl.startsWith("http")) {
            try {
                localImageUrl = downloadImage(imageUrl);
                if (localImageUrl != null) {
                    logger.info("Downloaded image: {} -> {}", imageUrl, localImageUrl);
                } else {
                    logger.warn("Failed to download image, keeping original URL: {}", imageUrl);
                    localImageUrl = imageUrl; // Keep original URL if download fails
                }
            } catch (Exception e) {
                logger.error("Error downloading image from {}: {}", imageUrl, e.getMessage());
                localImageUrl = imageUrl; // Keep original URL on error
            }
        } else if (imageUrl != null) {
            localImageUrl = imageUrl; // Already a local path
        }
        
        // Process French (required - use as fallback for other languages)
        JsonNode frData = null;
        if (item.has("fr")) {
            frData = item.get("fr");
            frAppels.add(createAppelItem(frData, localImageUrl, item, "fr"));
        }
        
        // Process Arabic (use French as fallback if Arabic translation is missing)
        if (item.has("ar")) {
            JsonNode arData = item.get("ar");
            arAppels.add(createAppelItem(arData, localImageUrl, item, "ar"));
        } else if (frData != null) {
            // Use French data as fallback for Arabic
            arAppels.add(createAppelItem(frData, localImageUrl, item, "ar"));
            logger.info("Arabic translation missing, using French as fallback for item");
        }
        
        // Process English (use French as fallback if English translation is missing)
        if (item.has("en")) {
            JsonNode enData = item.get("en");
            enAppels.add(createAppelItem(enData, localImageUrl, item, "en"));
        } else if (frData != null) {
            // Use French data as fallback for English
            enAppels.add(createAppelItem(frData, localImageUrl, item, "en"));
            logger.info("English translation missing, using French as fallback for item");
        }
    }
    
    private void processSingleLanguageItem(JsonNode item, List<Map<String, Object>> frAppels,
                                          List<Map<String, Object>> arAppels,
                                          List<Map<String, Object>> enAppels) {
        String imageUrl = item.has("image") && !item.get("image").isNull() 
            ? item.get("image").asText() : null;
        
        // Download image if URL is provided (only once, shared across languages)
        String localImageUrl = null;
        if (imageUrl != null && imageUrl.startsWith("http")) {
            try {
                localImageUrl = downloadImage(imageUrl);
                if (localImageUrl != null) {
                    logger.info("Downloaded image: {} -> {}", imageUrl, localImageUrl);
                } else {
                    logger.warn("Failed to download image, keeping original URL: {}", imageUrl);
                    localImageUrl = imageUrl; // Keep original URL if download fails
                }
            } catch (Exception e) {
                logger.error("Error downloading image from {}: {}", imageUrl, e.getMessage());
                localImageUrl = imageUrl; // Keep original URL on error
            }
        } else if (imageUrl != null) {
            localImageUrl = imageUrl; // Already a local path
        }
        
        // Create entries for all 3 languages with the same content
        // (In single language format, we assume it's the content for all languages)
        frAppels.add(createAppelItem(item, localImageUrl, item, "fr"));
        arAppels.add(createAppelItem(item, localImageUrl, item, "ar"));
        enAppels.add(createAppelItem(item, localImageUrl, item, "en"));
    }
    
    /**
     * Download image from URL and save it locally
     * @param imageUrl The URL of the image to download
     * @return Local URL path or null if download fails
     */
    private String downloadImage(String imageUrl) {
        try {
            // Get upload path
            Path uploadPath = getUploadPath();
            
            // Create upload directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            }
            
            // Determine file extension from URL
            String extension = ".jpg"; // Default
            try {
                URL url = new URL(imageUrl);
                String path = url.getPath().toLowerCase();
                if (path.contains(".png")) extension = ".png";
                else if (path.contains(".gif")) extension = ".gif";
                else if (path.contains(".webp")) extension = ".webp";
                else if (path.contains(".jpeg")) extension = ".jpg";
            } catch (Exception e) {
                logger.warn("Could not determine extension from URL, using .jpg: {}", e.getMessage());
            }
            
            // Generate unique filename
            String filename = "imported-" + UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);
            
            // Download and save image
            try (InputStream in = new URL(imageUrl).openStream()) {
                Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
                logger.info("Successfully downloaded image to: {}", filePath.toAbsolutePath());
            }
            
            // Return local URL
            String cleanContextPath = contextPath.endsWith("/") 
                ? contextPath.substring(0, contextPath.length() - 1) 
                : contextPath;
            return cleanContextPath + "/uploads/" + filename;
            
        } catch (Exception e) {
            logger.error("Failed to download image from {}: {}", imageUrl, e.getMessage(), e);
            return null;
        }
    }
    
    private Path getUploadPath() {
        Path path = Paths.get(uploadDir);
        // If relative path, make it relative to the current working directory
        if (!path.isAbsolute()) {
            path = Paths.get(System.getProperty("user.dir"), uploadDir);
        }
        return path;
    }
    
    /**
     * Truncate text to a maximum length for preview purposes (read more style)
     * @param text The text to truncate
     * @param maxLength Maximum length before truncation
     * @return Truncated text with "..." if it was longer than maxLength
     */
    private String truncateText(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) {
            return text;
        }
        // Truncate and add ellipsis
        return text.substring(0, maxLength).trim() + "...";
    }
    
    private Map<String, Object> createAppelItem(JsonNode langData, String imageUrl, 
                                               JsonNode rootItem, String lang) {
        Map<String, Object> appel = new HashMap<>();
        appel.put("status", "active");
        appel.put("title", langData.has("title") ? langData.get("title").asText() : "");
        
        // Store summary separately if available
        if (langData.has("summary") && !langData.get("summary").isNull()) {
            appel.put("summary", langData.get("summary").asText());
        }
        
        // Use full_text with truncation (read more style), fallback to summary
        String description = "";
        if (langData.has("full_text") && !langData.get("full_text").isNull()) {
            String fullText = langData.get("full_text").asText();
            // Truncate to 250 characters for preview
            description = truncateText(fullText, 250);
        } else if (langData.has("summary") && !langData.get("summary").isNull()) {
            description = langData.get("summary").asText();
        }
        appel.put("description", description);
        
        // Store full text separately for "read more" functionality
        if (langData.has("full_text") && !langData.get("full_text").isNull()) {
            appel.put("fullText", langData.get("full_text").asText());
        }
        
        // Image URL (use local downloaded URL if available)
        if (imageUrl != null) {
            appel.put("imageUrl", imageUrl);
        }
        
        // Details array (for date display)
        List<Map<String, Object>> details = new ArrayList<>();
        if (langData.has("date") && !langData.get("date").isNull()) {
            Map<String, Object> dateDetail = new HashMap<>();
            dateDetail.put("label", lang.equals("ar") ? "التاريخ" : (lang.equals("en") ? "Date" : "Date"));
            dateDetail.put("value", langData.get("date").asText());
            details.add(dateDetail);
        }
        appel.put("details", details);
        
        // Actions array (for URL link)
        List<Map<String, Object>> actions = new ArrayList<>();
        String url = rootItem.has("url") && !rootItem.get("url").isNull() 
            ? rootItem.get("url").asText() 
            : (langData.has("url") && !langData.get("url").isNull() 
                ? langData.get("url").asText() : null);
        
        if (url != null && !url.isEmpty()) {
            Map<String, Object> action = new HashMap<>();
            action.put("text", lang.equals("fr") ? "En savoir plus" : 
                       (lang.equals("ar") ? "المزيد" : "Learn more"));
            action.put("url", url);
            action.put("type", "primary");
            actions.add(action);
        }
        appel.put("actions", actions);
        
        return appel;
    }
}
