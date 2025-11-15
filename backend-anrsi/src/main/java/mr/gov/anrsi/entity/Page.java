package mr.gov.anrsi.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
    private String title; // Keep for backward compatibility, will be moved to translations
    
    @Column(name = "hero_title", columnDefinition = "TEXT")
    private String heroTitle; // Keep for backward compatibility
    
    @Column(name = "hero_subtitle", columnDefinition = "TEXT")
    private String heroSubtitle; // Keep for backward compatibility
    
    @Column(name = "hero_image_url", columnDefinition = "TEXT")
    private String heroImageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String content; // Keep for backward compatibility during migration, can be removed later
    
    @Enumerated(EnumType.STRING)
    @Column(name = "page_type", nullable = false, length = 50)
    private PageType pageType;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // Additional JSON metadata
    
    // New relationships - normalized structure
    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PageTranslation> translations = new ArrayList<>();
    
    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PageVideo> videos = new ArrayList<>();
    
    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PagePhoto> photos = new ArrayList<>();
    
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

