package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String author;
    private LocalDateTime publishDate;
    private String imageUrl;
    private List<String> images = new ArrayList<>();
    private String category;
    private List<String> tags = new ArrayList<>();
    private Boolean featured;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

