package mr.gov.anrsi.repository;

import mr.gov.anrsi.entity.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    // Get the first (and should be only) statistics record
    Statistics findFirstByOrderByIdAsc();
}

