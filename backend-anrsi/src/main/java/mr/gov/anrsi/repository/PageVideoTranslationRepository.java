package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.PageVideo;
import mr.gov.anrsi.entity.PageVideoTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageVideoTranslationRepository extends JpaRepository<PageVideoTranslation, Long> {
    List<PageVideoTranslation> findByPageVideo(PageVideo pageVideo);
    Optional<PageVideoTranslation> findByPageVideoAndLanguage(PageVideo pageVideo, Language language);
    List<PageVideoTranslation> findByPageVideoId(Long pageVideoId);
}

