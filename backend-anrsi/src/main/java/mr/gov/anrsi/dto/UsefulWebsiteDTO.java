package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsefulWebsiteDTO {
    private Long id;
    private String name;
    private String url;
    private Integer order;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}




