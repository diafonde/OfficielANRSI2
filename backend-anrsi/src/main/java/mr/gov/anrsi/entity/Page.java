package mr.gov.anrsi.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Page {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 255)
    private String slug;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(name = "hero_title", columnDefinition = "TEXT")
    private String heroTitle;
    
    @Column(name = "hero_subtitle", columnDefinition = "TEXT")
    private String heroSubtitle;
    
    @Column(name = "hero_image_url", columnDefinition = "TEXT")
    private String heroImageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String content; // JSON content
    
    @Enumerated(EnumType.STRING)
    @Column(name = "page_type", nullable = false, length = 50)
    private PageType pageType;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // Additional JSON metadata
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_published")
    private Boolean isPublished = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum PageType {
        SIMPLE,        // Simple text content (About, Strategic Vision)
        LIST,          // List of items (Missions, Objectives)
        STRUCTURED,    // Complex structure (Programmes, Financement)
        FAQ            // FAQ format (Contact page)
    }
}

