package mr.gov.anrsi.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import mr.gov.anrsi.dto.PageCreateDTO;
import mr.gov.anrsi.dto.PageDTO;
import mr.gov.anrsi.dto.PageTranslationDTO;
import mr.gov.anrsi.dto.PageUpdateDTO;
import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PagePhoto;
import mr.gov.anrsi.entity.PageTranslation;
import mr.gov.anrsi.entity.PageVideo;
import mr.gov.anrsi.exception.PageNotFoundException;
import mr.gov.anrsi.repository.PageRepository;
import mr.gov.anrsi.repository.PageTranslationRepository;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class PageService {
    
    @Autowired
    private PageRepository pageRepository;
    
    @Autowired
    private PageTranslationRepository pageTranslationRepository;
    
    private final ObjectMapper objectMapper;
    
    public PageService() {
        // Initialize ObjectMapper (thread-safe, can be reused)
        this.objectMapper = new ObjectMapper();
    }
    
    private Page loadPageWithRelations(Page page) {
        if (page == null) return null;
        // Force load of lazy relationships
        page.getTranslations().size();
        page.getVideos().size();
        page.getPhotos().size();
        // Load video translations
        for (PageVideo video : page.getVideos()) {
            video.getTranslations().size();
        }
        // Load photo translations
        for (PagePhoto photo : page.getPhotos()) {
            photo.getTranslations().size();
        }
        return page;
    }
    
    public PageDTO getPageBySlug(String slug) {
        Page page = pageRepository.findBySlugAndIsPublishedTrue(slug)
            .orElseThrow(() -> new PageNotFoundException("Page not found with slug: " + slug));
        loadPageWithRelations(page);
        return PageDTO.fromEntity(page);
    }
    
    public PageDTO getPageById(Long id) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + id));
        loadPageWithRelations(page);
        return PageDTO.fromEntity(page);
    }
    
    public PageDTO getPageBySlugForAdmin(String slug) {
        Page page = pageRepository.findBySlug(slug)
            .orElseThrow(() -> new PageNotFoundException("Page not found with slug: " + slug));
        loadPageWithRelations(page);
        return PageDTO.fromEntity(page);
    }
    
    public List<PageDTO> getAllPublishedPages() {
        return pageRepository.findByIsPublishedTrueAndIsActiveTrue()
            .stream()
            .map(PageDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<PageDTO> getAllPages() {
        return pageRepository.findAll()
            .stream()
            .map(PageDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<PageDTO> getAllPages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        org.springframework.data.domain.Page<Page> pages = pageRepository.findAll(pageable);
        return pages.getContent()
            .stream()
            .map(PageDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<PageDTO> getPagesByType(Page.PageType pageType) {
        return pageRepository.findByPageType(pageType)
            .stream()
            .map(PageDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public PageDTO createPage(PageCreateDTO pageCreateDTO) {
        // Check if slug already exists
        if (pageRepository.existsBySlug(pageCreateDTO.getSlug())) {
            throw new IllegalArgumentException("Page with slug '" + pageCreateDTO.getSlug() + "' already exists");
        }
        
        // Validate translations
        if (pageCreateDTO.getTranslations() == null || pageCreateDTO.getTranslations().isEmpty()) {
            throw new IllegalArgumentException("At least one translation is required");
        }
        
        Page page = new Page();
        page.setSlug(pageCreateDTO.getSlug());
        page.setPageType(pageCreateDTO.getPageType());
        page.setOrdre(pageCreateDTO.getOrdre());
        page.setParentId(pageCreateDTO.getParentId());
        page.setHeroImageUrl(pageCreateDTO.getHeroImageUrl());
        page.setIsPublished(pageCreateDTO.getIsPublished() != null ? pageCreateDTO.getIsPublished() : false);
        page.setIsActive(pageCreateDTO.getIsActive() != null ? pageCreateDTO.getIsActive() : true);
        
        // Save page first to get the ID
        Page savedPage = pageRepository.save(page);
        
        // Create translations
        for (Map.Entry<String, PageTranslationDTO> entry : pageCreateDTO.getTranslations().entrySet()) {
            String langCode = entry.getKey().toUpperCase();
            PageTranslationDTO transDTO = entry.getValue();
            
            try {
                Language language = Language.valueOf(langCode);
                
                PageTranslation translation = new PageTranslation();
                translation.setPage(savedPage);
                translation.setLanguage(language);
                translation.setTitle(transDTO.getTitle());
                translation.setHeroTitle(transDTO.getHeroTitle());
                translation.setHeroSubtitle(transDTO.getHeroSubtitle());
                translation.setSectionTitle(transDTO.getSectionTitle());
                translation.setIntroText(transDTO.getIntroText());
                translation.setDescription(transDTO.getDescription());
                translation.setContent(transDTO.getContent());
                translation.setExtra(transDTO.getExtra());
                
                pageTranslationRepository.save(translation);
            } catch (IllegalArgumentException e) {
                // Skip invalid language codes
                continue;
            }
        }
        
        // Reload page with translations
        loadPageWithRelations(savedPage);
        return PageDTO.fromEntity(savedPage);
    }
    
    public PageDTO updatePage(Long id, PageUpdateDTO pageUpdateDTO) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + id));
        
        // Update page fields
        if (pageUpdateDTO.getSlug() != null) {
            // Check if new slug already exists (and is not the current page)
            if (!page.getSlug().equals(pageUpdateDTO.getSlug()) && 
                pageRepository.existsBySlug(pageUpdateDTO.getSlug())) {
                throw new IllegalArgumentException("Page with slug '" + pageUpdateDTO.getSlug() + "' already exists");
            }
            page.setSlug(pageUpdateDTO.getSlug());
        }
        if (pageUpdateDTO.getPageType() != null) {
            page.setPageType(pageUpdateDTO.getPageType());
        }
        if (pageUpdateDTO.getOrdre() != null) {
            page.setOrdre(pageUpdateDTO.getOrdre());
        }
        if (pageUpdateDTO.getParentId() != null) {
            page.setParentId(pageUpdateDTO.getParentId());
        }
        if (pageUpdateDTO.getHeroImageUrl() != null) {
            page.setHeroImageUrl(pageUpdateDTO.getHeroImageUrl());
        }
        if (pageUpdateDTO.getIsPublished() != null) {
            page.setIsPublished(pageUpdateDTO.getIsPublished());
        }
        if (pageUpdateDTO.getIsActive() != null) {
            page.setIsActive(pageUpdateDTO.getIsActive());
        }
        
        // Update translations if provided
        if (pageUpdateDTO.getTranslations() != null && !pageUpdateDTO.getTranslations().isEmpty()) {
            for (Map.Entry<String, PageTranslationDTO> entry : pageUpdateDTO.getTranslations().entrySet()) {
                String langCode = entry.getKey().toUpperCase();
                PageTranslationDTO transDTO = entry.getValue();
                
                try {
                    Language language = Language.valueOf(langCode);
                    
                    // Find existing translation or create new one
                    Optional<PageTranslation> existingTranslation = 
                        pageTranslationRepository.findByPageAndLanguage(page, language);
                    
                    PageTranslation translation;
                    if (existingTranslation.isPresent()) {
                        translation = existingTranslation.get();
                    } else {
                        translation = new PageTranslation();
                        translation.setPage(page);
                        translation.setLanguage(language);
                    }
                    
                    // Update translation fields
                    if (transDTO.getTitle() != null) {
                        translation.setTitle(transDTO.getTitle());
                    }
                    if (transDTO.getHeroTitle() != null) {
                        translation.setHeroTitle(transDTO.getHeroTitle());
                    }
                    if (transDTO.getHeroSubtitle() != null) {
                        translation.setHeroSubtitle(transDTO.getHeroSubtitle());
                    }
                    if (transDTO.getSectionTitle() != null) {
                        translation.setSectionTitle(transDTO.getSectionTitle());
                    }
                    if (transDTO.getIntroText() != null) {
                        translation.setIntroText(transDTO.getIntroText());
                    }
                    if (transDTO.getDescription() != null) {
                        translation.setDescription(transDTO.getDescription());
                    }
                    if (transDTO.getContent() != null) {
                        translation.setContent(transDTO.getContent());
                    }
                    if (transDTO.getExtra() != null) {
                        translation.setExtra(transDTO.getExtra());
                    }
                    
                    pageTranslationRepository.save(translation);
                } catch (IllegalArgumentException e) {
                    // Skip invalid language codes
                    continue;
                }
            }
        }
        
        Page updatedPage = pageRepository.save(page);
        loadPageWithRelations(updatedPage);
        return PageDTO.fromEntity(updatedPage);
    }
    
    /**
     * Updates PageTranslation entries based on the content JSON.
     * If content contains a "translations" object with fr, ar, en keys,
     * it will create or update the corresponding PageTranslation entries.
     */
    private void updatePageTranslations(Page page, String contentJson) {
        if (contentJson == null || contentJson.trim().isEmpty()) {
            return;
        }
        
        try {
            JsonNode contentNode = objectMapper.readTree(contentJson);
            
            // Check if content has a "translations" object
            JsonNode translationsNode = contentNode.get("translations");
            if (translationsNode == null || !translationsNode.isObject()) {
                // No translations structure, skip
                return;
            }
            
            // Process each language (fr, ar, en)
            String[] languages = {"fr", "ar", "en"};
            for (String langCode : languages) {
                JsonNode langContent = translationsNode.get(langCode);
                if (langContent == null || !langContent.isObject()) {
                    continue; // Skip if language content doesn't exist
                }
                
                try {
                    Language language = Language.valueOf(langCode.toUpperCase());
                    
                    // Extract title, heroTitle, heroSubtitle, and full content
                    String title = langContent.has("heroTitle") 
                        ? langContent.get("heroTitle").asText() 
                        : (langContent.has("title") ? langContent.get("title").asText() : "Untitled");
                    
                    String heroTitle = langContent.has("heroTitle") 
                        ? langContent.get("heroTitle").asText() 
                        : null;
                    
                    String heroSubtitle = langContent.has("heroSubtitle") 
                        ? langContent.get("heroSubtitle").asText() 
                        : null;
                    
                    // Get the full language content as JSON string
                    String langContentJson = objectMapper.writeValueAsString(langContent);
                    
                    // Find existing translation or create new one
                    Optional<PageTranslation> existingTranslation = 
                        pageTranslationRepository.findByPageAndLanguage(page, language);
                    
                    PageTranslation translation;
                    if (existingTranslation.isPresent()) {
                        translation = existingTranslation.get();
                    } else {
                        translation = new PageTranslation();
                        translation.setPage(page);
                        translation.setLanguage(language);
                    }
                    
                    // Update translation fields
                    translation.setTitle(title != null ? title : "Untitled");
                    translation.setHeroTitle(heroTitle);
                    translation.setHeroSubtitle(heroSubtitle);
                    translation.setContent(langContentJson);
                    
                    // Save the translation
                    pageTranslationRepository.save(translation);
                } catch (IllegalArgumentException e) {
                    // Skip invalid language codes
                    continue;
                }
            }
        } catch (Exception e) {
            // If JSON parsing fails, just log and continue
            // The page content will still be saved, but translations won't be updated
            System.err.println("Error parsing content JSON for translations: " + e.getMessage());
        }
    }
    
    public void deletePage(Long id) {
        if (!pageRepository.existsById(id)) {
            throw new PageNotFoundException("Page not found with id: " + id);
        }
        pageRepository.deleteById(id);
    }
    
    public PageDTO publishPage(Long id) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + id));
        page.setIsPublished(true);
        Page updatedPage = pageRepository.save(page);
        return PageDTO.fromEntity(updatedPage);
    }
    
    public PageDTO unpublishPage(Long id) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + id));
        page.setIsPublished(false);
        Page updatedPage = pageRepository.save(page);
        return PageDTO.fromEntity(updatedPage);
    }
    
    public PageDTO togglePageStatus(Long id) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + id));
        page.setIsActive(!page.getIsActive());
        Page updatedPage = pageRepository.save(page);
        return PageDTO.fromEntity(updatedPage);
    }
    
    public List<String> getAllSlugs() {
        return pageRepository.findAll()
            .stream()
            .map(Page::getSlug)
            .collect(Collectors.toList());
    }
    
    public List<Page.PageType> getAvailablePageTypes() {
        return List.of(Page.PageType.values());
    }
}

