package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Article;
import mr.gov.anrsi.entity.ArticleTranslation;
import mr.gov.anrsi.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleTranslationRepository extends JpaRepository<ArticleTranslation, Long> {
    List<ArticleTranslation> findByArticle(Article article);
    Optional<ArticleTranslation> findByArticleAndLanguage(Article article, Language language);
    void deleteByArticle(Article article);
    
    // Search in translations
    @Query("SELECT DISTINCT at.article FROM ArticleTranslation at WHERE " +
           "LOWER(at.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(at.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(at.excerpt) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Article> findArticlesByTranslationTitleOrContentOrExcerptContainingIgnoreCase(@Param("searchTerm") String searchTerm);
}

