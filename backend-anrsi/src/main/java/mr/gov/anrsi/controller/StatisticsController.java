package mr.gov.anrsi.controller;

import mr.gov.anrsi.dto.StatisticsDTO;
import mr.gov.anrsi.dto.StatisticsUpdateDTO;
import mr.gov.anrsi.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@ConditionalOnProperty(name = "spring.datasource.url")
public class StatisticsController {
    
    @Autowired
    private StatisticsService statisticsService;
    
    // Public endpoint to get statistics
    @GetMapping
    public ResponseEntity<StatisticsDTO> getStatistics() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }
    
    // Admin endpoint to update statistics
    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<StatisticsDTO> updateStatistics(@RequestBody StatisticsUpdateDTO updateDTO) {
        return ResponseEntity.ok(statisticsService.updateStatistics(updateDTO));
    }
}

