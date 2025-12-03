package mr.gov.anrsi.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Page;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageUpdateDTO {
    private String slug;
    
    private Page.PageType pageType;
    
    private Integer ordre;
    
    private Long parentId;
    
    private String heroImageUrl;
    
    // Translations map: key = language code (fr, en, ar), value = translation data
    private Map<String, PageTranslationDTO> translations;
    
    private Boolean isPublished;
    
    private Boolean isActive;
}

