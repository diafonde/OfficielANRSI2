package mr.gov.anrsi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCreateDTO {
    // Keep these for backward compatibility - will use first available translation if translations not provided
    private String title;
    private String content;
    private String excerpt;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    @NotNull(message = "Publish date is required")
    private LocalDateTime publishDate;
    
    private String imageUrl;
    
    private String attachmentUrl;
    
    private List<String> images = new ArrayList<>();
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private List<String> tags = new ArrayList<>();
    
    private Boolean featured = false;
    
    private Boolean published = true;
    
    // Translations map: { "fr": {...}, "ar": {...}, "en": {...} }
    private Map<String, ArticleTranslationDTO> translations = new HashMap<>();
}

