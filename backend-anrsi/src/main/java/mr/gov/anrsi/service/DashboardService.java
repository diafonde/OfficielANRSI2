package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.DashboardStatsDTO;
import mr.gov.anrsi.repository.ArticleRepository;
import mr.gov.anrsi.repository.UserRepository;
import mr.gov.anrsi.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@ConditionalOnProperty(name = "spring.datasource.url")
public class DashboardService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VideoRepository videoRepository;
    
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Article statistics
        long totalArticles = articleRepository.count();
        stats.setTotalArticles(totalArticles);
        
        // Published and draft articles
        long publishedArticles = articleRepository.countByPublishedTrue();
        stats.setPublishedArticles(publishedArticles);
        
        long draftArticles = articleRepository.countByPublishedFalse();
        stats.setDraftArticles(draftArticles);
        
        // Recent articles (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long recentArticles = articleRepository.findAll().stream()
                .filter(article -> article.getPublishDate() != null && 
                        article.getPublishDate().isAfter(weekAgo))
                .count();
        stats.setRecentArticles(recentArticles);
        
        // User statistics
        long totalUsers = userRepository.count();
        stats.setTotalUsers(totalUsers);
        
        long activeUsers = userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .count();
        stats.setActiveUsers(activeUsers);
        
        // Video statistics
        long totalVideos = videoRepository.count();
        stats.setTotalVideos(totalVideos);
        
        return stats;
    }
}

