package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PagePhotoTranslation;
import mr.gov.anrsi.entity.PageTranslation;
import mr.gov.anrsi.entity.PageVideoTranslation;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDTO {
    private Long id;
    private String slug;
    private String title; // Backward compatibility
    private String heroTitle; // Backward compatibility
    private String heroSubtitle; // Backward compatibility
    private String heroImageUrl;
    private String content; // Backward compatibility - keep for old JSON format
    private Page.PageType pageType;
    private String metadata;
    private Boolean isPublished;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // New normalized structure
    private Map<String, PageTranslationDTO> translations = new HashMap<>();
    private List<PageVideoDTO> videos = List.of();
    private List<PagePhotoDTO> photos = List.of();
    
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
        dto.setPageType(page.getPageType());
        dto.setMetadata(page.getMetadata());
        dto.setIsPublished(page.getIsPublished() != null ? page.getIsPublished() : false);
        dto.setIsActive(page.getIsActive() != null ? page.getIsActive() : true);
        dto.setCreatedAt(page.getCreatedAt());
        dto.setUpdatedAt(page.getUpdatedAt());
        
        // Map translations
        if (page.getTranslations() != null && !page.getTranslations().isEmpty()) {
            Map<String, PageTranslationDTO> translationsMap = new HashMap<>();
            for (PageTranslation translation : page.getTranslations()) {
                PageTranslationDTO transDTO = new PageTranslationDTO();
                transDTO.setId(translation.getId());
                transDTO.setLanguage(translation.getLanguage());
                transDTO.setTitle(translation.getTitle());
                transDTO.setHeroTitle(translation.getHeroTitle());
                transDTO.setHeroSubtitle(translation.getHeroSubtitle());
                transDTO.setContent(translation.getContent());
                translationsMap.put(translation.getLanguage().name().toLowerCase(), transDTO);
            }
            dto.setTranslations(translationsMap);
            
            // Set backward compatibility fields from French translation (prefer fr, then ar, then en)
            PageTranslation firstTranslation = page.getTranslations().stream()
                    .filter(t -> t.getLanguage() == Language.FR)
                    .findFirst()
                    .orElse(page.getTranslations().stream()
                            .filter(t -> t.getLanguage() == Language.AR)
                            .findFirst()
                            .orElse(page.getTranslations().stream()
                                    .filter(t -> t.getLanguage() == Language.EN)
                                    .findFirst()
                                    .orElse(page.getTranslations().get(0))));
            
            // Update main fields from translation if they exist
            if (firstTranslation.getTitle() != null) {
                dto.setTitle(firstTranslation.getTitle());
            }
            if (firstTranslation.getHeroTitle() != null) {
                dto.setHeroTitle(firstTranslation.getHeroTitle());
            }
            if (firstTranslation.getHeroSubtitle() != null) {
                dto.setHeroSubtitle(firstTranslation.getHeroSubtitle());
            }
            if (firstTranslation.getContent() != null) {
                dto.setContent(firstTranslation.getContent());
            }
        }
        
        // Map videos
        if (page.getVideos() != null && !page.getVideos().isEmpty()) {
            List<PageVideoDTO> videosList = page.getVideos().stream()
                .sorted((v1, v2) -> Integer.compare(
                    v1.getDisplayOrder() != null ? v1.getDisplayOrder() : 0,
                    v2.getDisplayOrder() != null ? v2.getDisplayOrder() : 0
                ))
                .map(video -> {
                    PageVideoDTO videoDTO = new PageVideoDTO();
                    videoDTO.setId(video.getId());
                    videoDTO.setUrl(video.getUrl());
                    videoDTO.setType(video.getType());
                    videoDTO.setDisplayOrder(video.getDisplayOrder());
                    
                    Map<String, PageVideoTranslationDTO> videoTranslations = new HashMap<>();
                    if (video.getTranslations() != null) {
                        for (PageVideoTranslation trans : video.getTranslations()) {
                            PageVideoTranslationDTO transDTO = new PageVideoTranslationDTO();
                            transDTO.setId(trans.getId());
                            transDTO.setLanguage(trans.getLanguage());
                            transDTO.setTitle(trans.getTitle());
                            transDTO.setDescription(trans.getDescription());
                            videoTranslations.put(trans.getLanguage().name().toLowerCase(), transDTO);
                        }
                    }
                    videoDTO.setTranslations(videoTranslations);
                    return videoDTO;
                })
                .collect(Collectors.toList());
            dto.setVideos(videosList);
        }
        
        // Map photos
        if (page.getPhotos() != null && !page.getPhotos().isEmpty()) {
            List<PagePhotoDTO> photosList = page.getPhotos().stream()
                .sorted((p1, p2) -> Integer.compare(
                    p1.getDisplayOrder() != null ? p1.getDisplayOrder() : 0,
                    p2.getDisplayOrder() != null ? p2.getDisplayOrder() : 0
                ))
                .map(photo -> {
                    PagePhotoDTO photoDTO = new PagePhotoDTO();
                    photoDTO.setId(photo.getId());
                    photoDTO.setUrl(photo.getUrl());
                    photoDTO.setDisplayOrder(photo.getDisplayOrder());
                    
                    Map<String, PagePhotoTranslationDTO> photoTranslations = new HashMap<>();
                    if (photo.getTranslations() != null) {
                        for (PagePhotoTranslation trans : photo.getTranslations()) {
                            PagePhotoTranslationDTO transDTO = new PagePhotoTranslationDTO();
                            transDTO.setId(trans.getId());
                            transDTO.setLanguage(trans.getLanguage());
                            transDTO.setTitle(trans.getTitle());
                            transDTO.setDescription(trans.getDescription());
                            photoTranslations.put(trans.getLanguage().name().toLowerCase(), transDTO);
                        }
                    }
                    photoDTO.setTranslations(photoTranslations);
                    return photoDTO;
                })
                .collect(Collectors.toList());
            dto.setPhotos(photosList);
        }
        
        return dto;
    }
}

