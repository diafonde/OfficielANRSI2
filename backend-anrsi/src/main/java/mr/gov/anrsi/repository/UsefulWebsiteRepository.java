package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.UsefulWebsite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsefulWebsiteRepository extends JpaRepository<UsefulWebsite, Long> {
    @Query("SELECT w FROM UsefulWebsite w ORDER BY w.order ASC")
    List<UsefulWebsite> findAllByOrderByOrderAsc();
}

