import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface Ai4agriNewsItem {
  title: string;
  imageUrls?: string[];
  imageUrl?: string; // Support old format for backward compatibility
  documentUrls?: string[]; // Array of document URLs (PDFs, DOC, etc.)
  documentUrl?: string; // Support old format for backward compatibility
  description?: string;
  date?: string;
  url?: string;
}

interface Ai4agriLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  newsItems: Ai4agriNewsItem[];
}

interface Ai4agriContent {
  translations: {
    fr: Ai4agriLanguageContent;
    ar: Ai4agriLanguageContent;
    en: Ai4agriLanguageContent;
  };
}

@Component({
  selector: 'app-ai4agri',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './ai4agri.component.html',
  styleUrls: ['./ai4agri.component.scss']
})
export class Ai4agriComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: Ai4agriContent | null = null;
  displayContent: Ai4agriLanguageContent | null = null;
  isLoading = true;
  currentLang = 'fr';
  private langSubscription?: Subscription;
  expandedItems: Set<number> = new Set(); // Track which items are expanded

  constructor(
    private pageService: PageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updateTranslatedContent();
    });

    this.loadPage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private updateTranslatedContent(): void {
    if (!this.page) {
      console.warn('updateTranslatedContent: page is null');
      return;
    }
    
    console.log('updateTranslatedContent called:', {
      currentLang: this.currentLang,
      hasTranslations: !!this.page.translations,
      translationKeys: this.page.translations ? Object.keys(this.page.translations) : [],
      pageContent: this.page.content ? 'exists' : 'null'
    });
    
    // Try to get translation from page.translations (new system)
    const translation = this.page.translations?.[this.currentLang];
    if (translation && translation.content) {
      try {
        console.log('Parsing translation content for language:', this.currentLang);
        const parsedContent = JSON.parse(translation.content);
        console.log('Parsed content:', parsedContent);
        
        // Validate that parsedContent has the expected structure
        if (parsedContent && typeof parsedContent === 'object') {
          this.displayContent = parsedContent;
          if (translation.heroTitle) this.page.heroTitle = translation.heroTitle;
          if (translation.heroSubtitle) this.page.heroSubtitle = translation.heroSubtitle;
          if (translation.title) this.page.title = translation.title;
          
          // Debug: Log the content structure
          if (this.displayContent?.newsItems) {
            console.log('AI4AGRI News Items loaded:', this.displayContent.newsItems);
            this.displayContent.newsItems.forEach((item, index) => {
              console.log(`News Item ${index}:`, {
                title: item.title,
                imageUrls: item.imageUrls,
                imageUrl: item.imageUrl,
                hasImages: this.getNewsItemImages(item).length > 0
              });
            });
          } else {
            console.warn('displayContent has no newsItems:', this.displayContent);
          }
          return;
        } else {
          console.error('Parsed content is not a valid object:', parsedContent);
        }
      } catch (e) {
        console.error('Error parsing translated content:', e, translation.content);
      }
    } else {
      console.log('No translation found for language:', this.currentLang, {
        hasTranslation: !!translation,
        hasContent: translation?.content ? 'yes' : 'no'
      });
    }
    
    // Fallback to old format if available
    if (this.content) {
      console.log('Using fallback content');
      const langContent = this.content.translations[this.currentLang as 'fr' | 'ar' | 'en'];
      this.displayContent = langContent || this.content.translations.fr;
    } else {
      console.log('Loading content from page.content');
      this.loadContentFromPage();
    }
    
    // Ensure displayContent is always set (even if empty)
    if (!this.displayContent) {
      console.warn('displayContent is null after all attempts, setting empty content');
      this.displayContent = this.getEmptyLanguageContent();
    }
    
    console.log('Final displayContent:', this.displayContent);
  }

  loadPage(): void {
    console.log('Loading page with slug: ai4agri');
    this.pageService.getPageBySlug('ai4agri').subscribe({
      next: (page) => {
        console.log('Page loaded successfully:', {
          id: page.id,
          slug: page.slug,
          hasTranslations: !!page.translations,
          translationKeys: page.translations ? Object.keys(page.translations) : [],
          hasContent: !!page.content,
          isPublished: page.isPublished,
          isActive: page.isActive
        });
        
        this.page = page;
        // Try new translation system first
        if (page.translations && Object.keys(page.translations).length > 0) {
          console.log('Using new translation system');
          this.updateTranslatedContent();
        } else if (page.content) {
          console.log('Using old content format');
          // Fallback to old format
          try {
            const parsedContent = JSON.parse(page.content);
            if (parsedContent.translations) {
              this.content = parsedContent;
            } else {
              const oldContent: Ai4agriLanguageContent = parsedContent;
              this.content = {
                translations: {
                  fr: oldContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
            }
            this.updateTranslatedContent();
          } catch (e) {
            console.error('Error parsing content:', e, page.content);
            // Show empty state - data should come from database via DataInitializer
            this.content = null;
            this.displayContent = null;
          }
        } else {
          console.warn('Page has no translations and no content');
          // Show empty state - data should come from database via DataInitializer
          this.content = null;
          this.displayContent = null;
        }
        this.isLoading = false;
        console.log('Loading complete. displayContent:', this.displayContent);
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
        this.content = null;
        this.displayContent = null;
        this.isLoading = false;
      }
    });
  }

  loadContentFromPage(): void {
    if (this.page?.content) {
      try {
        console.log('Parsing page.content:', this.page.content.substring(0, 200));
        const parsedContent = JSON.parse(this.page.content);
        if (parsedContent.translations) {
          this.content = parsedContent;
          this.updateTranslatedContent();
        } else {
          const oldContent: Ai4agriLanguageContent = parsedContent;
          this.displayContent = oldContent;
        }
      } catch (e) {
        console.error('Error parsing content:', e, this.page.content);
        // Show empty state - data should come from database via DataInitializer
        this.content = null;
        this.displayContent = this.getEmptyLanguageContent();
      }
    } else {
      console.warn('Page has no content property');
      // Show empty state - data should come from database via DataInitializer
      this.content = null;
      this.displayContent = this.getEmptyLanguageContent();
    }
  }

  private getEmptyLanguageContent(): Ai4agriLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      newsItems: []
    };
  }

  getNewsDate(newsItem: Ai4agriNewsItem): string | null {
    return newsItem.date || null;
  }

  getNewsItemImages(newsItem: Ai4agriNewsItem): string[] {
    // Support new format (imageUrls array) and old format (imageUrl string)
    let images: string[] = [];
    
    if (newsItem.imageUrls && Array.isArray(newsItem.imageUrls) && newsItem.imageUrls.length > 0) {
      images = newsItem.imageUrls;
    } else if (newsItem.imageUrl) {
      images = [newsItem.imageUrl];
    }
    
    // Normalize and filter out empty/null URLs
    const normalizedImages = images
      .filter(url => url && typeof url === 'string' && url.trim().length > 0)
      .map(url => this.normalizeImageUrl(url.trim()));
    
    // Debug logging (can be removed in production)
    if (normalizedImages.length > 0) {
      console.log('News item images:', newsItem.title, normalizedImages);
    }
    
    return normalizedImages;
  }

  /**
   * Normalize image URL to handle different formats
   */
  private normalizeImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }

    // If it's already a full URL (http/https), use it as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it starts with /uploads/, it's already a valid backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    // If it starts with uploads/ (no leading slash), add the slash
    if (imageUrl.startsWith('uploads/')) {
      return '/' + imageUrl;
    }
    // If it's an assets path, keep it as-is
    if (imageUrl.startsWith('assets/')) {
      return imageUrl;
    }
    // For any other relative path, ensure it starts with /
    if (!imageUrl.startsWith('/')) {
      return '/' + imageUrl;
    }
    
    return imageUrl;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.warn('Failed to load image:', img.src);
    img.style.display = 'none';
  }

  trackByImageUrl(index: number, imageUrl: string): string {
    return imageUrl || index.toString();
  }

  /**
   * Check if description needs truncation (rough estimate based on length)
   * CSS line-clamp will handle the actual visual truncation
   * Also consider if there are images or documents - if there are, we should show the button
   */
  needsTruncation(description: string | undefined, newsItem: Ai4agriNewsItem): boolean {
    if (!description && this.getNewsItemImages(newsItem).length === 0 && this.getNewsItemDocuments(newsItem).length === 0) return false;
    // Show button if description is long OR if there are images OR if there are documents
    const hasLongDescription = description && description.length > 150;
    const hasImages = this.getNewsItemImages(newsItem).length > 0;
    const hasDocuments = this.getNewsItemDocuments(newsItem).length > 0;
    return hasLongDescription || hasImages || hasDocuments;
  }

  /**
   * Get document URLs for a news item (supports both new array format and old single URL format)
   */
  getNewsItemDocuments(newsItem: Ai4agriNewsItem): string[] {
    let documents: string[] = [];
    
    if (newsItem.documentUrls && Array.isArray(newsItem.documentUrls) && newsItem.documentUrls.length > 0) {
      documents = newsItem.documentUrls;
    } else if (newsItem.documentUrl) {
      documents = [newsItem.documentUrl];
    }
    
    // Normalize and filter out empty/null URLs
    const normalizedDocuments = documents
      .filter(url => url && typeof url === 'string' && url.trim().length > 0)
      .map(url => this.normalizeDocumentUrl(url.trim()));
    
    return normalizedDocuments;
  }

  /**
   * Normalize document URL to handle different formats
   */
  private normalizeDocumentUrl(documentUrl: string): string {
    if (!documentUrl) {
      return '';
    }

    // If it's already a full URL (http/https), use it as-is
    if (documentUrl.startsWith('http://') || documentUrl.startsWith('https://')) {
      return documentUrl;
    }
    // If it starts with /uploads/, it's already a valid backend URL
    if (documentUrl.startsWith('/uploads/')) {
      return documentUrl;
    }
    // If it starts with uploads/ (no leading slash), add the slash
    if (documentUrl.startsWith('uploads/')) {
      return '/' + documentUrl;
    }
    // For any other relative path, ensure it starts with /
    if (!documentUrl.startsWith('/')) {
      return '/' + documentUrl;
    }
    
    return documentUrl;
  }

  /**
   * Get document file name from URL
   */
  getDocumentFileName(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  /**
   * Get document file type icon class
   */
  getDocumentIconClass(url: string): string {
    if (!url) return 'fas fa-file';
    const fileName = this.getDocumentFileName(url).toLowerCase();
    if (fileName.endsWith('.pdf')) return 'fas fa-file-pdf';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'fas fa-file-word';
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return 'fas fa-file-excel';
    return 'fas fa-file';
  }

  /**
   * Toggle expansion state for an article
   */
  toggleExpand(index: number): void {
    if (this.expandedItems.has(index)) {
      this.expandedItems.delete(index);
    } else {
      this.expandedItems.add(index);
    }
  }

  /**
   * Check if an article is expanded
   */
  isExpanded(index: number): boolean {
    return this.expandedItems.has(index);
  }

}
