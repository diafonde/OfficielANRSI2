package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mr.gov.anrsi.entity.PageVideo;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageVideoDTO {
    private Long id;
    private String url;
    private PageVideo.VideoType type;
    private Integer displayOrder;
    private Map<String, PageVideoTranslationDTO> translations = new HashMap<>();
}

