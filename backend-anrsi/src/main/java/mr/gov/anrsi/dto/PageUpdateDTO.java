package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Page;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageUpdateDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String heroTitle;
    
    private String heroSubtitle;
    
    private String heroImageUrl;
    
    private String content;
    
    private Page.PageType pageType;
    
    private String metadata;
    
    private Boolean isPublished;
    
    private Boolean isActive;
}

