package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.ArticleCreateDTO;
import mr.gov.anrsi.dto.ArticleDTO;
import mr.gov.anrsi.dto.ArticleTranslationDTO;
import mr.gov.anrsi.entity.Article;
import mr.gov.anrsi.entity.ArticleTranslation;
import mr.gov.anrsi.entity.Categories;
import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.exception.ArticleNotFoundException;
import mr.gov.anrsi.exception.CategoryNotFoundException;
import mr.gov.anrsi.repository.ArticleRepository;
import mr.gov.anrsi.repository.ArticleTranslationRepository;
import mr.gov.anrsi.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private CategoriesRepository categoriesRepository;
    
    @Autowired
    private ArticleTranslationRepository translationRepository;
    
    public List<ArticleDTO> getAllArticles() {
        return articleRepository.findAllByOrderByPublishDateDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ArticleDTO> getPublishedArticles() {
        return articleRepository.findByPublishedTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ArticleDTO getArticleById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Article not found with id: " + id));
        return convertToDTO(article);
    }
    
    public List<ArticleDTO> getFeaturedArticles() {
        return articleRepository.findByFeaturedTrue()
                .stream()
                .filter(article -> Boolean.TRUE.equals(article.getPublished()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ArticleDTO> getRecentArticles() {
        LocalDateTime now = LocalDateTime.now();
        return articleRepository.findByPublishDateBeforeOrderByPublishDateDesc(now)
                .stream()
                .filter(article -> Boolean.TRUE.equals(article.getPublished()))
                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ArticleDTO> getNonFeaturedArticles() {
        return articleRepository.findByFeaturedFalseAndPublishedTrue()
                .stream()
                .sorted((a, b) -> b.getPublishDate().compareTo(a.getPublishDate()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ArticleDTO> searchArticles(String searchTerm) {
        // Search in translations instead of direct article fields
        return translationRepository.findArticlesByTranslationTitleOrContentOrExcerptContainingIgnoreCase(searchTerm)
                .stream()
                .filter(article -> Boolean.TRUE.equals(article.getPublished()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ArticleDTO> getArticlesByCategory(String category) {
        // Try to find by slug first, then by name
        Categories categoryEntity = categoriesRepository.findBySlug(category)
                .orElseGet(() -> categoriesRepository.findByName(category)
                        .orElseThrow(() -> new CategoryNotFoundException("Category not found: " + category)));
        
        return articleRepository.findByCategory(categoryEntity)
                .stream()
                .filter(article -> Boolean.TRUE.equals(article.getPublished()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ArticleDTO createArticle(ArticleCreateDTO dto) {
        Article article = convertToEntity(dto);
        
        // Save article first to get an ID (required for translations foreign key)
        article = articleRepository.save(article);
        
        // Save translations if provided
        if (dto.getTranslations() != null && !dto.getTranslations().isEmpty()) {
            saveTranslations(article, dto.getTranslations());
        } else if (dto.getTitle() != null && dto.getContent() != null) {
            // Backward compatibility: if translations not provided but title/content are, create a default translation
            Map<String, ArticleTranslationDTO> defaultTranslation = new HashMap<>();
            ArticleTranslationDTO defaultTrans = new ArticleTranslationDTO();
            defaultTrans.setLanguage("fr");
            defaultTrans.setTitle(dto.getTitle());
            defaultTrans.setContent(dto.getContent());
            defaultTrans.setExcerpt(dto.getExcerpt() != null ? dto.getExcerpt() : "");
            defaultTranslation.put("fr", defaultTrans);
            saveTranslations(article, defaultTranslation);
        }
        
        // Reload article with translations
        Article saved = articleRepository.findById(article.getId())
                .orElseThrow(() -> new ArticleNotFoundException("Article not found after creation"));
        return convertToDTO(saved);
    }
    
    public ArticleDTO updateArticle(Long id, ArticleCreateDTO dto) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Article not found with id: " + id));
        
        article.setAuthor(dto.getAuthor());
        article.setPublishDate(dto.getPublishDate());
        article.setImageUrl(dto.getImageUrl());
        if (dto.getImages() != null) {
            article.setImages(dto.getImages());
        }
        // Convert category string to Categories entity
        Categories categoryEntity = findOrCreateCategory(dto.getCategory());
        article.setCategory(categoryEntity);
        if (dto.getTags() != null) {
            article.setTags(dto.getTags());
        }
        if (dto.getFeatured() != null) {
            article.setFeatured(dto.getFeatured());
        }
        if (dto.getPublished() != null) {
            article.setPublished(dto.getPublished());
        }
        
        Article updated = articleRepository.save(article);
        
        // Update translations if provided
        if (dto.getTranslations() != null && !dto.getTranslations().isEmpty()) {
            updateTranslations(updated, dto.getTranslations());
        } else if (dto.getTitle() != null && dto.getContent() != null) {
            // Backward compatibility: update default translation
            Map<String, ArticleTranslationDTO> defaultTranslation = new HashMap<>();
            ArticleTranslationDTO defaultTrans = new ArticleTranslationDTO();
            defaultTrans.setLanguage("fr");
            defaultTrans.setTitle(dto.getTitle());
            defaultTrans.setContent(dto.getContent());
            defaultTrans.setExcerpt(dto.getExcerpt() != null ? dto.getExcerpt() : "");
            defaultTranslation.put("fr", defaultTrans);
            updateTranslations(updated, defaultTranslation);
        }
        
        // Reload article with translations
        updated = articleRepository.findById(updated.getId())
                .orElseThrow(() -> new ArticleNotFoundException("Article not found after update"));
        return convertToDTO(updated);
    }
    
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new ArticleNotFoundException("Article not found with id: " + id);
        }
        articleRepository.deleteById(id);
    }
    
    private ArticleDTO convertToDTO(Article article) {
        ArticleDTO dto = new ArticleDTO();
        dto.setId(article.getId());
        dto.setAuthor(article.getAuthor());
        dto.setPublishDate(article.getPublishDate());
        dto.setImageUrl(article.getImageUrl());
        dto.setImages(article.getImages());
        // Convert Categories entity to String (category name)
        dto.setCategory(article.getCategory() != null ? article.getCategory().getName() : null);
        dto.setTags(article.getTags());
        dto.setFeatured(article.getFeatured());
        dto.setPublished(article.getPublished());
        dto.setCreatedAt(article.getCreatedAt());
        dto.setUpdatedAt(article.getUpdatedAt());
        
        // Convert translations
        Map<String, ArticleTranslationDTO> translationsMap = new HashMap<>();
        if (article.getTranslations() != null && !article.getTranslations().isEmpty()) {
            for (ArticleTranslation translation : article.getTranslations()) {
                ArticleTranslationDTO transDTO = new ArticleTranslationDTO();
                transDTO.setLanguage(translation.getLanguage().name().toLowerCase());
                transDTO.setTitle(translation.getTitle());
                transDTO.setContent(translation.getContent());
                transDTO.setExcerpt(translation.getExcerpt());
                translationsMap.put(translation.getLanguage().name().toLowerCase(), transDTO);
            }
            
            // Set backward compatibility fields from first available translation (prefer fr, then ar, then en)
            ArticleTranslation firstTranslation = article.getTranslations().stream()
                    .filter(t -> t.getLanguage() == Language.FR)
                    .findFirst()
                    .orElse(article.getTranslations().stream()
                            .filter(t -> t.getLanguage() == Language.AR)
                            .findFirst()
                            .orElse(article.getTranslations().stream()
                                    .filter(t -> t.getLanguage() == Language.EN)
                                    .findFirst()
                                    .orElse(article.getTranslations().get(0))));
            
            dto.setTitle(firstTranslation.getTitle());
            dto.setContent(firstTranslation.getContent());
            dto.setExcerpt(firstTranslation.getExcerpt());
        }
        
        dto.setTranslations(translationsMap);
        return dto;
    }
    
    private Article convertToEntity(ArticleCreateDTO dto) {
        Article article = new Article();
        article.setAuthor(dto.getAuthor());
        article.setPublishDate(dto.getPublishDate());
        article.setImageUrl(dto.getImageUrl());
        if (dto.getImages() != null) {
            article.setImages(dto.getImages());
        }
        // Convert category string to Categories entity
        Categories categoryEntity = findOrCreateCategory(dto.getCategory());
        article.setCategory(categoryEntity);
        if (dto.getTags() != null) {
            article.setTags(dto.getTags());
        }
        article.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        article.setPublished(dto.getPublished() != null ? dto.getPublished() : true);
        return article;
    }
    
    private void saveTranslations(Article article, Map<String, ArticleTranslationDTO> translationsMap) {
        // Article should already be saved and have an ID at this point
        // Clear existing translations from the article's list
        article.getTranslations().clear();
        
        for (Map.Entry<String, ArticleTranslationDTO> entry : translationsMap.entrySet()) {
            String langStr = entry.getKey().toUpperCase();
            ArticleTranslationDTO transDTO = entry.getValue();
            
            // Skip if translation DTO is null or missing required fields
            if (transDTO == null || transDTO.getTitle() == null || transDTO.getContent() == null) {
                continue;
            }
            
            try {
                Language language = Language.valueOf(langStr);
                ArticleTranslation translation = new ArticleTranslation();
                translation.setArticle(article);
                translation.setLanguage(language);
                translation.setTitle(transDTO.getTitle().trim());
                translation.setContent(transDTO.getContent().trim());
                translation.setExcerpt(transDTO.getExcerpt() != null && !transDTO.getExcerpt().trim().isEmpty() 
                    ? transDTO.getExcerpt().trim() : "");
                
                // Add to article's translations list to maintain bidirectional relationship
                // Cascade will handle saving when we save the article
                article.getTranslations().add(translation);
            } catch (IllegalArgumentException e) {
                // Skip invalid language codes
                continue;
            }
        }
        
        // Save article - cascade will save translations
        articleRepository.save(article);
    }
    
    private void updateTranslations(Article article, Map<String, ArticleTranslationDTO> translationsMap) {
        // Get existing translations
        List<ArticleTranslation> existingTranslations = translationRepository.findByArticle(article);
        
        // Update or create translations
        for (Map.Entry<String, ArticleTranslationDTO> entry : translationsMap.entrySet()) {
            String langStr = entry.getKey().toUpperCase();
            ArticleTranslationDTO transDTO = entry.getValue();
            
            // Skip if translation DTO is null or missing required fields
            if (transDTO == null || transDTO.getTitle() == null || transDTO.getContent() == null) {
                continue;
            }
            
            try {
                Language language = Language.valueOf(langStr);
                
                // Find existing translation for this language
                Optional<ArticleTranslation> existingTranslation = existingTranslations.stream()
                        .filter(t -> t.getLanguage() == language)
                        .findFirst();
                
                ArticleTranslation translation;
                if (existingTranslation.isPresent()) {
                    // Update existing translation
                    translation = existingTranslation.get();
                    translation.setTitle(transDTO.getTitle().trim());
                    translation.setContent(transDTO.getContent().trim());
                    translation.setExcerpt(transDTO.getExcerpt() != null && !transDTO.getExcerpt().trim().isEmpty() 
                        ? transDTO.getExcerpt().trim() : "");
                } else {
                    // Create new translation
                    translation = new ArticleTranslation();
                    translation.setArticle(article);
                    translation.setLanguage(language);
                    translation.setTitle(transDTO.getTitle().trim());
                    translation.setContent(transDTO.getContent().trim());
                    translation.setExcerpt(transDTO.getExcerpt() != null && !transDTO.getExcerpt().trim().isEmpty() 
                        ? transDTO.getExcerpt().trim() : "");
                    article.getTranslations().add(translation);
                }
                
                // Save the translation
                translationRepository.save(translation);
            } catch (IllegalArgumentException e) {
                // Skip invalid language codes
                continue;
            }
        }
        
        // Delete translations that are no longer in the map
        for (ArticleTranslation existingTranslation : existingTranslations) {
            String langKey = existingTranslation.getLanguage().name().toLowerCase();
            if (!translationsMap.containsKey(langKey)) {
                translationRepository.delete(existingTranslation);
            }
        }
        
        // Save article to ensure state is synchronized
        articleRepository.save(article);
    }
    
    /**
     * Find category by name or slug, or create a new one if not found.
     * This method tries to find by slug first, then by name.
     */
    private Categories findOrCreateCategory(String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name cannot be null or empty");
        }
        
        // Try to find by slug first
        return categoriesRepository.findBySlug(categoryName.toLowerCase().replaceAll("\\s+", "-"))
                .orElseGet(() -> {
                    // Try to find by name
                    return categoriesRepository.findByName(categoryName)
                            .orElseGet(() -> {
                                // Create new category if not found
                                Categories newCategory = new Categories();
                                newCategory.setName(categoryName);
                                newCategory.setSlug(categoryName.toLowerCase().replaceAll("\\s+", "-"));
                                newCategory.setDescription("Category: " + categoryName);
                                newCategory.setImageUrl("");
                                return categoriesRepository.save(newCategory);
                            });
                });
    }
}

