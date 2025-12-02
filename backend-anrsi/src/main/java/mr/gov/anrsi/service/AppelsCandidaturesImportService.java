package mr.gov.anrsi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mr.gov.anrsi.dto.PageCreateDTO;
import mr.gov.anrsi.dto.PageUpdateDTO;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PageType;
import mr.gov.anrsi.exception.PageNotFoundException;
import mr.gov.anrsi.repository.PageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Map<String, Object> translations = new HashMap<>();
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
        
        translations.put("fr", frContent);
        translations.put("ar", arContent);
        translations.put("en", enContent);
        
        Map<String, Object> finalContent = new HashMap<>();
        finalContent.put("translations", translations);
        
        // Convert to JSON string
        String contentJson = objectMapper.writeValueAsString(finalContent);
        
        // Get or create page
        Optional<Page> existingPage = pageRepository.findBySlug("appels-candidatures");
        
        if (existingPage.isPresent()) {
            // Update existing page
            Page page = existingPage.get();
            PageUpdateDTO updateDTO = new PageUpdateDTO();
            updateDTO.setTitle("Appels à Candidatures");
            updateDTO.setHeroTitle("Appels à Candidatures");
            updateDTO.setHeroSubtitle("Opportunités de recherche et d'innovation en Mauritanie");
            updateDTO.setContent(contentJson);
            updateDTO.setPageType(PageType.STRUCTURED);
            updateDTO.setIsPublished(true);
            updateDTO.setIsActive(true);
            
            pageService.updatePage(page.getId(), updateDTO);
            logger.info("Updated existing page with {} appels (FR: {}, AR: {}, EN: {})", 
                frAppels.size(), frAppels.size(), arAppels.size(), enAppels.size());
        } else {
            // Create new page
            PageCreateDTO createDTO = new PageCreateDTO();
            createDTO.setSlug("appels-candidatures");
            createDTO.setTitle("Appels à Candidatures");
            createDTO.setHeroTitle("Appels à Candidatures");
            createDTO.setHeroSubtitle("Opportunités de recherche et d'innovation en Mauritanie");
            createDTO.setContent(contentJson);
            createDTO.setPageType(PageType.STRUCTURED);
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
        
        // Process French
        if (item.has("fr")) {
            JsonNode frData = item.get("fr");
            frAppels.add(createAppelItem(frData, localImageUrl, item, "fr"));
        }
        
        // Process Arabic
        if (item.has("ar")) {
            JsonNode arData = item.get("ar");
            arAppels.add(createAppelItem(arData, localImageUrl, item, "ar"));
        }
        
        // Process English
        if (item.has("en")) {
            JsonNode enData = item.get("en");
            enAppels.add(createAppelItem(enData, localImageUrl, item, "en"));
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
    
    private Map<String, Object> createAppelItem(JsonNode langData, String imageUrl, 
                                               JsonNode rootItem, String lang) {
        Map<String, Object> appel = new HashMap<>();
        appel.put("status", "active");
        appel.put("title", langData.has("title") ? langData.get("title").asText() : "");
        appel.put("description", langData.has("summary") ? langData.get("summary").asText() : "");
        if (imageUrl != null) {
            appel.put("imageUrl", imageUrl);
        }
        
        // Details
        List<Map<String, Object>> details = new ArrayList<>();
        if (langData.has("date") && !langData.get("date").isNull()) {
            Map<String, Object> dateDetail = new HashMap<>();
            dateDetail.put("label", lang.equals("ar") ? "التاريخ" : "Date");
            dateDetail.put("value", langData.get("date").asText());
            details.add(dateDetail);
        }
        appel.put("details", details);
        
        // Actions
        List<Map<String, Object>> actions = new ArrayList<>();
        String url = rootItem.has("url") && !rootItem.get("url").isNull() 
            ? rootItem.get("url").asText() 
            : (langData.has("url") && !langData.get("url").isNull() 
                ? langData.get("url").asText() : null);
        
        if (url != null) {
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
