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
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private PageType pageType;
    
    @Column(name = "ordre")
    private Integer ordre; // Pour l'ordre dans le menu
    
    @Column(name = "parent_id")
    private Long parentId; // Pour créer des sous-pages / catégories
    
    @Column(name = "hero_image_url", columnDefinition = "TEXT")
    private String heroImageUrl; // Bannière de la page
    
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

