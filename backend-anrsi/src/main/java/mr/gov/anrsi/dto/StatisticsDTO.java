package mr.gov.anrsi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private Long id;
    private Integer researchProjects;
    private Integer partnerInstitutions;
    private Integer publishedArticles;
    private Integer researchFunding;
}


