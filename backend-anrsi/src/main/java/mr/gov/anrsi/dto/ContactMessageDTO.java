package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageDTO {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}


