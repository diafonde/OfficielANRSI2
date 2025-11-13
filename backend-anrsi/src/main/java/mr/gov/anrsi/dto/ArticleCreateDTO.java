package mr.gov.anrsi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCreateDTO {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 500, message = "Title must be between 5 and 500 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 50, message = "Content must be at least 50 characters")
    private String content;
    
    @NotBlank(message = "Excerpt is required")
    @Size(min = 20, message = "Excerpt must be at least 20 characters")
    private String excerpt;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    @NotNull(message = "Publish date is required")
    private LocalDateTime publishDate;
    
    private String imageUrl;
    
    private List<String> images = new ArrayList<>();
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private List<String> tags = new ArrayList<>();
    
    private Boolean featured = false;
    
    private Boolean published = true;
}

