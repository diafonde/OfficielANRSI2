package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.ArticleCreateDTO;
import mr.gov.anrsi.dto.ArticleDTO;
import mr.gov.anrsi.entity.Article;
import mr.gov.anrsi.entity.Categories;
import mr.gov.anrsi.exception.ArticleNotFoundException;
import mr.gov.anrsi.exception.CategoryNotFoundException;
import mr.gov.anrsi.repository.ArticleRepository;
import mr.gov.anrsi.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private CategoriesRepository categoriesRepository;
    
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
        return articleRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(searchTerm, searchTerm)
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
        Article saved = articleRepository.save(article);
        return convertToDTO(saved);
    }
    
    public ArticleDTO updateArticle(Long id, ArticleCreateDTO dto) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Article not found with id: " + id));
        
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setExcerpt(dto.getExcerpt());
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
        dto.setTitle(article.getTitle());
        dto.setContent(article.getContent());
        dto.setExcerpt(article.getExcerpt());
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
        return dto;
    }
    
    private Article convertToEntity(ArticleCreateDTO dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setExcerpt(dto.getExcerpt());
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

