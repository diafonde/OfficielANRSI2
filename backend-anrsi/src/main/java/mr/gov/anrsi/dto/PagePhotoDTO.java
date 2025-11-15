package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagePhotoDTO {
    private Long id;
    private String url;
    private Integer displayOrder;
    private Map<String, PagePhotoTranslationDTO> translations = new HashMap<>();
}

