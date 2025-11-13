package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Page;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDTO {
    private Long id;
    private String slug;
    private String title;
    private String heroTitle;
    private String heroSubtitle;
    private String heroImageUrl;
    private String content;
    private Page.PageType pageType;
    private String metadata;
    private Boolean isPublished;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static PageDTO fromEntity(Page page) {
        if (page == null) {
            throw new IllegalArgumentException("Page entity cannot be null");
        }
        
        PageDTO dto = new PageDTO();
        dto.setId(page.getId());
        dto.setSlug(page.getSlug());
        dto.setTitle(page.getTitle());
        dto.setHeroTitle(page.getHeroTitle());
        dto.setHeroSubtitle(page.getHeroSubtitle());
        dto.setHeroImageUrl(page.getHeroImageUrl());
        dto.setContent(page.getContent());
        dto.setPageType(page.getPageType()); // pageType is required, but handle gracefully if null
        dto.setMetadata(page.getMetadata());
        dto.setIsPublished(page.getIsPublished() != null ? page.getIsPublished() : false);
        dto.setIsActive(page.getIsActive() != null ? page.getIsActive() : true);
        dto.setCreatedAt(page.getCreatedAt());
        dto.setUpdatedAt(page.getUpdatedAt());
        return dto;
    }
}

