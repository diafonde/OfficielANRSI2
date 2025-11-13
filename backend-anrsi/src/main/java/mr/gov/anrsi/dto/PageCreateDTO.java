package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Page;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageCreateDTO {
    @NotBlank(message = "Slug is required")
    private String slug;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String heroTitle;
    
    private String heroSubtitle;
    
    private String heroImageUrl;
    
    private String content;
    
    @NotNull(message = "Page type is required")
    private Page.PageType pageType;
    
    private String metadata;
    
    private Boolean isPublished = false;
    
    private Boolean isActive = true;
}

