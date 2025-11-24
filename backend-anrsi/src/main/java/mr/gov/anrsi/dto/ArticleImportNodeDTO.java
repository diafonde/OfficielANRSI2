package mr.gov.anrsi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleImportNodeDTO {
    @JsonProperty("node_id")
    private Long nodeId;
    
    private String url;
    private String title;  // Original Arabic title
    
    // Multilingual title fields
    @JsonProperty("title_en")
    private String titleEn;
    
    @JsonProperty("title_fr")
    private String titleFr;
    
    private String date;
    private String image;
    
    @JsonProperty("content_html")
    private String contentHtml;
    
    @JsonProperty("content_text")
    private String contentText;  // Original Arabic content
    
    // Multilingual content fields
    @JsonProperty("content_text_en")
    private String contentTextEn;
    
    @JsonProperty("content_text_fr")
    private String contentTextFr;
    
    @JsonProperty("content_html_en")
    private String contentHtmlEn;
    
    @JsonProperty("content_html_fr")
    private String contentHtmlFr;
}

