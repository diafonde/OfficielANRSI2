package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.Language;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageTranslationDTO {
    private Long id;
    private Language language;
    private String title;
    private String heroTitle;
    private String heroSubtitle;
    private String content;
}


