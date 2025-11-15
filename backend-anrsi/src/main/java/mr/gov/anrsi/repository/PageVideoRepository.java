package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PageVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PageVideoRepository extends JpaRepository<PageVideo, Long> {
    List<PageVideo> findByPage(Page page);
    List<PageVideo> findByPageId(Long pageId);
    
    @Query("SELECT pv FROM PageVideo pv WHERE pv.page.id = :pageId ORDER BY pv.displayOrder ASC")
    List<PageVideo> findByPageIdOrderByDisplayOrder(Long pageId);
    
    void deleteByPage(Page page);
}

