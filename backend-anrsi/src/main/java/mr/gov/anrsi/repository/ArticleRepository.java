package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Article;
import mr.gov.anrsi.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByFeaturedTrue();
    
    List<Article> findByFeaturedFalse();
    
    List<Article> findByFeaturedFalseAndPublishedTrue();
    
    List<Article> findByCategory(Categories category);
    
    List<Article> findByCategoryId(Long categoryId);
    
    List<Article> findByCategorySlug(String slug);
    
    List<Article> findByPublishDateBeforeOrderByPublishDateDesc(LocalDateTime date);
    
    List<Article> findAllByOrderByPublishDateDesc();
    
    List<Article> findByPublishedTrue();
    
    List<Article> findByPublishedFalse();
    
    long countByPublishedTrue();
    
    long countByPublishedFalse();
}

