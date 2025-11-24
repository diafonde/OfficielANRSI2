package mr.gov.anrsi.dto;

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
public class ArticleDTO {
    private Long id;
    // Keep these for backward compatibility - will use first available translation
    private String title;
    private String content;
    private String excerpt;
    private String author;
    private LocalDateTime publishDate;
    private String imageUrl;
    private String attachmentUrl;
    private List<String> images = new ArrayList<>();
    private Boolean featured;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // Translations map: { "fr": {...}, "ar": {...}, "en": {...} }
    private Map<String, ArticleTranslationDTO> translations = new HashMap<>();
}

