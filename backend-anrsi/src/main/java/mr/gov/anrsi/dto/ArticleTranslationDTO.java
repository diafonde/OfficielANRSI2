package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleTranslationDTO {
    private String language; // "fr", "ar", "en"
    private String title;
    private String content;
    private String excerpt;
}




