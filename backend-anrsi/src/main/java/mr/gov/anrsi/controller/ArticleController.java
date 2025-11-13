package mr.gov.anrsi.controller;

import jakarta.validation.Valid;
import mr.gov.anrsi.dto.ArticleCreateDTO;
import mr.gov.anrsi.dto.ArticleDTO;
import mr.gov.anrsi.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@ConditionalOnProperty(name = "spring.datasource.url")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    @GetMapping
    public ResponseEntity<List<ArticleDTO>> getAllArticles() {
        // Public endpoint returns only published articles
        return ResponseEntity.ok(articleService.getPublishedArticles());
    }
    
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<List<ArticleDTO>> getAllArticlesAdmin() {
        // Admin endpoint returns all articles including drafts
        return ResponseEntity.ok(articleService.getAllArticles());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticleById(@PathVariable Long id) {
        ArticleDTO article = articleService.getArticleById(id);
        // Public endpoint - only return if published
        if (Boolean.FALSE.equals(article.getPublished())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<ArticleDTO>> getFeaturedArticles() {
        return ResponseEntity.ok(articleService.getFeaturedArticles());
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<ArticleDTO>> getRecentArticles() {
        return ResponseEntity.ok(articleService.getRecentArticles());
    }
    
    @GetMapping("/non-featured")
    public ResponseEntity<List<ArticleDTO>> getNonFeaturedArticles() {
        return ResponseEntity.ok(articleService.getNonFeaturedArticles());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ArticleDTO>> searchArticles(@RequestParam String q) {
        return ResponseEntity.ok(articleService.searchArticles(q));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ArticleDTO>> getArticlesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(articleService.getArticlesByCategory(category));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<ArticleDTO> createArticle(@Valid @RequestBody ArticleCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.createArticle(dto));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<ArticleDTO> updateArticle(@PathVariable Long id, @Valid @RequestBody ArticleCreateDTO dto) {
        return ResponseEntity.ok(articleService.updateArticle(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}

