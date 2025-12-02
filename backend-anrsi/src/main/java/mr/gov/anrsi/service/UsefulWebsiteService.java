package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.UsefulWebsiteCreateDTO;
import mr.gov.anrsi.dto.UsefulWebsiteDTO;
import mr.gov.anrsi.entity.UsefulWebsite;
import mr.gov.anrsi.exception.UsefulWebsiteNotFoundException;
import mr.gov.anrsi.repository.UsefulWebsiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class UsefulWebsiteService {
    
    @Autowired
    private UsefulWebsiteRepository usefulWebsiteRepository;
    
    public List<UsefulWebsiteDTO> getAllWebsites() {
        return usefulWebsiteRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public UsefulWebsiteDTO getWebsiteById(Long id) {
        UsefulWebsite website = usefulWebsiteRepository.findById(id)
                .orElseThrow(() -> new UsefulWebsiteNotFoundException("Useful website not found with id: " + id));
        return convertToDTO(website);
    }
    
    public UsefulWebsiteDTO createWebsite(UsefulWebsiteCreateDTO dto) {
        UsefulWebsite website = convertToEntity(dto);
        UsefulWebsite saved = usefulWebsiteRepository.save(website);
        return convertToDTO(saved);
    }
    
    public UsefulWebsiteDTO updateWebsite(Long id, UsefulWebsiteCreateDTO dto) {
        UsefulWebsite website = usefulWebsiteRepository.findById(id)
                .orElseThrow(() -> new UsefulWebsiteNotFoundException("Useful website not found with id: " + id));
        
        website.setName(dto.getName());
        website.setUrl(dto.getUrl());
        website.setOrder(dto.getOrder());
        
        UsefulWebsite updated = usefulWebsiteRepository.save(website);
        return convertToDTO(updated);
    }
    
    public void deleteWebsite(Long id) {
        if (!usefulWebsiteRepository.existsById(id)) {
            throw new UsefulWebsiteNotFoundException("Useful website not found with id: " + id);
        }
        usefulWebsiteRepository.deleteById(id);
    }
    
    public void reorderWebsitesByIds(List<ReorderRequest> reorderRequests) {
        for (ReorderRequest request : reorderRequests) {
            UsefulWebsite website = usefulWebsiteRepository.findById(request.getId())
                    .orElseThrow(() -> new UsefulWebsiteNotFoundException("Useful website not found with id: " + request.getId()));
            website.setOrder(request.getOrder());
            usefulWebsiteRepository.save(website);
        }
    }
    
    private UsefulWebsiteDTO convertToDTO(UsefulWebsite website) {
        UsefulWebsiteDTO dto = new UsefulWebsiteDTO();
        dto.setId(website.getId());
        dto.setName(website.getName());
        dto.setUrl(website.getUrl());
        dto.setOrder(website.getOrder());
        dto.setCreatedAt(website.getCreatedAt());
        dto.setUpdatedAt(website.getUpdatedAt());
        return dto;
    }
    
    private UsefulWebsite convertToEntity(UsefulWebsiteCreateDTO dto) {
        UsefulWebsite website = new UsefulWebsite();
        website.setName(dto.getName());
        website.setUrl(dto.getUrl());
        website.setOrder(dto.getOrder());
        return website;
    }
    
    // Inner class for reorder requests
    public static class ReorderRequest {
        private Long id;
        private Integer order;
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public Integer getOrder() {
            return order;
        }
        
        public void setOrder(Integer order) {
            this.order = order;
        }
    }
}

