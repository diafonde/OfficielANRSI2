package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByFeaturedTrue();
    
    List<Article> findByFeaturedFalse();
    
    List<Article> findByFeaturedFalseAndPublishedTrue();
    
    List<Article> findByPublishDateBeforeOrderByPublishDateDesc(LocalDateTime date);
    
    List<Article> findAllByOrderByPublishDateDesc();
    
    List<Article> findByPublishedTrue();
    
    Page<Article> findByPublishedTrue(Pageable pageable);
    
    List<Article> findByPublishedFalse();
    
    Page<Article> findByFeaturedFalseAndPublishedTrue(Pageable pageable);
    
    long countByPublishedTrue();
    
    long countByPublishedFalse();
}

