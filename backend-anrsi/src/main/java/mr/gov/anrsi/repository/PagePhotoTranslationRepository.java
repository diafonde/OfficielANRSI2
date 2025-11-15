package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.PagePhoto;
import mr.gov.anrsi.entity.PagePhotoTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagePhotoTranslationRepository extends JpaRepository<PagePhotoTranslation, Long> {
    List<PagePhotoTranslation> findByPagePhoto(PagePhoto pagePhoto);
    Optional<PagePhotoTranslation> findByPagePhotoAndLanguage(PagePhoto pagePhoto, Language language);
    List<PagePhotoTranslation> findByPagePhotoId(Long pagePhotoId);
}

