package mr.gov.anrsi.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "page_translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"page_id", "lang"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageTranslation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    private Page page;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "lang", nullable = false, length = 10)
    private Language language;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(name = "hero_title", columnDefinition = "TEXT")
    private String heroTitle;
    
    @Column(name = "hero_subtitle", columnDefinition = "TEXT")
    private String heroSubtitle;
    
    @Column(name = "section_title", columnDefinition = "TEXT")
    private String sectionTitle;
    
    @Column(name = "intro_text", columnDefinition = "TEXT")
    private String introText;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String content; // Contenu HTML principal
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSONB")
    private String extra; // Pour stocker des listes complexes (rapports, programmes, vidéos, etc.)
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


