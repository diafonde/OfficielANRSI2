package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PagePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagePhotoRepository extends JpaRepository<PagePhoto, Long> {
    List<PagePhoto> findByPage(Page page);
    List<PagePhoto> findByPageId(Long pageId);
    
    @Query("SELECT pp FROM PagePhoto pp WHERE pp.page.id = :pageId ORDER BY pp.displayOrder ASC")
    List<PagePhoto> findByPageIdOrderByDisplayOrder(Long pageId);
    
    void deleteByPage(Page page);
}

