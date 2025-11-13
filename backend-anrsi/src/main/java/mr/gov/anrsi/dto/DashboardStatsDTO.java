package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalArticles;
    private Long publishedArticles;
    private Long draftArticles;
    private Long recentArticles; // Articles from last 7 days
    private Long totalUsers;
    private Long activeUsers;
    private Long totalVideos;
}

