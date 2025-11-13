package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {
    Optional<Page> findBySlug(String slug);
    
    Optional<Page> findBySlugAndIsPublishedTrue(String slug);
    
    List<Page> findAllByIsActiveTrue();
    
    List<Page> findByPageType(Page.PageType pageType);
    
    List<Page> findByIsPublishedTrue();
    
    List<Page> findByIsPublishedTrueAndIsActiveTrue();
    
    Boolean existsBySlug(String slug);
    
    Boolean existsBySlugAndIdNot(String slug, Long id);
}

