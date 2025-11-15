package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.StatisticsDTO;
import mr.gov.anrsi.dto.StatisticsUpdateDTO;
import mr.gov.anrsi.entity.Statistics;
import mr.gov.anrsi.repository.StatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@ConditionalOnProperty(name = "spring.datasource.url")
public class StatisticsService {
    
    @Autowired
    private StatisticsRepository statisticsRepository;
    
    public StatisticsDTO getStatistics() {
        Statistics stats = statisticsRepository.findFirstByOrderByIdAsc();
        
        // If no statistics exist, create default ones
        if (stats == null) {
            stats = new Statistics();
            stats = statisticsRepository.save(stats);
        }
        
        return convertToDTO(stats);
    }
    
    @Transactional
    public StatisticsDTO updateStatistics(StatisticsUpdateDTO updateDTO) {
        Statistics stats = statisticsRepository.findFirstByOrderByIdAsc();
        
        // If no statistics exist, create new ones
        if (stats == null) {
            stats = new Statistics();
        }
        
        // Update values
        if (updateDTO.getResearchProjects() != null) {
            stats.setResearchProjects(updateDTO.getResearchProjects());
        }
        if (updateDTO.getPartnerInstitutions() != null) {
            stats.setPartnerInstitutions(updateDTO.getPartnerInstitutions());
        }
        if (updateDTO.getPublishedArticles() != null) {
            stats.setPublishedArticles(updateDTO.getPublishedArticles());
        }
        if (updateDTO.getResearchFunding() != null) {
            stats.setResearchFunding(updateDTO.getResearchFunding());
        }
        
        stats = statisticsRepository.save(stats);
        return convertToDTO(stats);
    }
    
    private StatisticsDTO convertToDTO(Statistics stats) {
        StatisticsDTO dto = new StatisticsDTO();
        dto.setId(stats.getId());
        dto.setResearchProjects(stats.getResearchProjects());
        dto.setPartnerInstitutions(stats.getPartnerInstitutions());
        dto.setPublishedArticles(stats.getPublishedArticles());
        dto.setResearchFunding(stats.getResearchFunding());
        return dto;
    }
}

