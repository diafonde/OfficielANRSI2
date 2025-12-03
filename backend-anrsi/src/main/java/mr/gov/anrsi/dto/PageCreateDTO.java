package mr.gov.anrsi.dto;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Page;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageCreateDTO {
    @NotBlank(message = "Slug is required")
    private String slug;
    
    @NotNull(message = "Page type is required")
    private Page.PageType pageType;
    
    private Integer ordre;
    
    private Long parentId;
    
    private String heroImageUrl;
    
    // Translations map: key = language code (fr, en, ar), value = translation data
    @NotNull(message = "At least one translation is required")
    private Map<String, PageTranslationDTO> translations;
    
    private Boolean isPublished = false;
    
    private Boolean isActive = true;
}

