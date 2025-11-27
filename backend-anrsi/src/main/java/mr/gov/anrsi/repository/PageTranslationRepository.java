package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PageTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageTranslationRepository extends JpaRepository<PageTranslation, Long> {
    List<PageTranslation> findByPage(Page page);
    Optional<PageTranslation> findByPageAndLanguage(Page page, Language language);
    List<PageTranslation> findByPageId(Long pageId);
    void deleteByPage(Page page);
}


