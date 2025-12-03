import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface AppelDetail {
  label: string;
  value: string;
}

interface AppelAction {
  text: string;
  url: string;
  type: 'primary' | 'outline';
}

interface AppelItem {
  status: 'active' | 'upcoming' | 'closed';
  title: string;
  description: string;
  summary?: string; // Summary field for brief introduction
  fullText?: string; // Full text for "read more" expansion
  imageUrl?: string;
  documentUrl?: string; // Document URL for downloadable files
  details: AppelDetail[];
  actions: AppelAction[];
}

interface CategoryItem {
  icon: string;
  title: string;
  items: string[];
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface CriteriaItem {
  icon: string;
  title: string;
  description: string;
}

interface SupportService {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface AppelsCandidaturesContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  appels: AppelItem[];
  categories: CategoryItem[];
  processSteps: ProcessStep[];
  criteria: CriteriaItem[];
  supportServices: SupportService[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-appels-candidatures',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './appels-candidatures.component.html',
  styleUrls: ['./appels-candidatures.component.scss']
})
export class AppelsCandidaturesComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: AppelsCandidaturesContent | null = null;
  isLoading = true;
  currentLang: string = 'fr';
  private langSubscription?: Subscription;
  expandedItems = new Set<number>(); // Track which items are expanded

  constructor(
    private pageService: PageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
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

  loadPage(): void {
    this.pageService.getPageBySlug('appels-candidatures').subscribe({
      next: (page) => {
        this.page = page;
        this.updateTranslatedContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
        this.content = null;
        this.isLoading = false;
      }
    });
  }

  updateTranslatedContent(): void {
    if (!this.page) return;

    // First, try to get from page.content (where admin form saves the translations structure)
    if (this.page.content) {
      try {
        const parsedContent = JSON.parse(this.page.content);
        // Check if it's the new format with translations
        if (parsedContent.translations) {
          // Extract content for current language, fallback to French
          const langContent = parsedContent.translations[this.currentLang] 
            || parsedContent.translations['fr'] 
            || parsedContent.translations['ar'] 
            || parsedContent.translations['en'];
          
          if (langContent) {
            this.content = langContent;
            
            // Update page title and hero from the language content
            if (langContent.heroTitle) {
              this.page.heroTitle = langContent.heroTitle;
            }
            if (langContent.heroSubtitle) {
              this.page.heroSubtitle = langContent.heroSubtitle;
            }
            return;
          }
        }
      } catch (e) {
        console.error('Error parsing page.content:', e);
      }
    }

    // Fallback: Try to get translation for current language from page.translations
    const translation = this.page.translations?.[this.currentLang];
    
    if (translation && translation.content) {
      try {
        this.content = JSON.parse(translation.content);
        if (translation.heroTitle) this.page.heroTitle = translation.heroTitle;
        if (translation.heroSubtitle) this.page.heroSubtitle = translation.heroSubtitle;
        if (translation.title) this.page.title = translation.title;
      } catch (e) {
        console.error('Error parsing translated content:', e);
        this.loadContentFromPage();
      }
    } else {
      // Final fallback
      this.loadContentFromPage();
    }
  }

  loadContentFromPage(): void {
    if (this.page?.content) {
      try {
        const parsedContent = JSON.parse(this.page.content);
        // Check if it's the new format with translations
        if (parsedContent.translations) {
          // Extract content for current language, fallback to French
          const langContent = parsedContent.translations[this.currentLang] 
            || parsedContent.translations['fr'] 
            || parsedContent.translations['ar'] 
            || parsedContent.translations['en'];
          
          if (langContent) {
            this.content = langContent;
          } else {
            this.content = null;
          }
        } else {
          // Old format - single language
          this.content = parsedContent;
        }
      } catch (e) {
        console.error('Error parsing content:', e);
        // Show empty state - data should come from database via DataInitializer
        this.content = null;
      }
    } else {
      // Show empty state - data should come from database via DataInitializer
      this.content = null;
    }
  }

  getAppelDate(appel: AppelItem): string | null {
    if (!appel.details || appel.details.length === 0) {
      return null;
    }
    
    // Look for a date in the details
    const dateDetail = appel.details.find(detail => 
      detail.label && (
        detail.label.toLowerCase().includes('date') || 
        detail.label.toLowerCase().includes('publié') ||
        detail.label.toLowerCase().includes('publication')
      )
    );
    
    if (dateDetail && dateDetail.value) {
      return dateDetail.value;
    }
    
    // If no date found, return null
    return null;
  }

  /**
   * Check if an item is expanded
   */
  isExpanded(index: number): boolean {
    return this.expandedItems.has(index);
  }

  /**
   * Toggle expansion state of an item
   */
  toggleExpand(index: number): void {
    if (this.expandedItems.has(index)) {
      this.expandedItems.delete(index);
    } else {
      this.expandedItems.add(index);
    }
  }

  /**
   * Get the display text for an item (truncated or full)
   * Prioritizes fullText over description
   */
  getDisplayText(appel: AppelItem, index: number): string {
    // Always use fullText if available, otherwise fall back to description
    const textToDisplay = appel.fullText || appel.description;
    
    if (!textToDisplay) {
      return '';
    }
    
    // If expanded, show full text
    if (this.isExpanded(index)) {
      return textToDisplay;
    }
    
    // If text is short enough, show it all
    if (textToDisplay.length <= 250) {
      return textToDisplay;
    }
    
    // Otherwise, show truncated version
    return textToDisplay.substring(0, 250).trim() + '...';
  }

  /**
   * Check if an item has more text to show (needs read more)
   * Checks if fullText exists and is longer than 250 chars, or description is longer
   */
  hasMoreText(appel: AppelItem): boolean {
    // Prioritize fullText, but also check description if fullText doesn't exist
    const textToCheck = appel.fullText || appel.description;
    return textToCheck ? textToCheck.length > 250 : false;
  }

  /**
   * Get the read more/less text based on language
   */
  getReadMoreText(index: number): string {
    if (this.currentLang === 'ar') {
      return this.isExpanded(index) ? 'اقرأ أقل' : 'اقرأ المزيد';
    } else if (this.currentLang === 'en') {
      return this.isExpanded(index) ? 'Read less' : 'Read more';
    }
    // French (default)
    return this.isExpanded(index) ? 'Lire moins' : 'En savoir plus';
  }

  /**
   * Get the proper image URL for display
   * Handles both relative paths (/uploads/...) and absolute URLs
   */
  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return '';
    }
    
    // If it's already an absolute URL (starts with http:// or https://), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path starting with /uploads/, return as is (proxy will handle it)
    if (imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    
    // If it doesn't start with /, add /uploads/ prefix
    if (!imageUrl.startsWith('/')) {
      return '/uploads/' + imageUrl;
    }
    
    // Otherwise return as is
    return imageUrl;
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Hide the image on error
    if (img && img.parentElement) {
      img.parentElement.style.display = 'none';
    }
  }

  /**
   * Get the document URL for download
   * Handles both relative paths (/uploads/...) and absolute URLs
   */
  getDocumentUrl(documentUrl: string | undefined): string {
    if (!documentUrl) {
      return '';
    }
    
    // If it's already an absolute URL (starts with http:// or https://), return as is
    if (documentUrl.startsWith('http://') || documentUrl.startsWith('https://')) {
      return documentUrl;
    }
    
    // If it's a relative path starting with /uploads/, return as is (proxy will handle it)
    if (documentUrl.startsWith('/uploads/')) {
      return documentUrl;
    }
    
    // If it doesn't start with /, add /uploads/ prefix
    if (!documentUrl.startsWith('/')) {
      return '/uploads/' + documentUrl;
    }
    
    // Otherwise return as is
    return documentUrl;
  }

  /**
   * Get file name from URL
   */
  getFileNameFromUrl(url: string): string {
    if (!url) return '';
    try {
      const urlObj = new URL(url, window.location.origin);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop() || '';
      return fileName || 'document';
    } catch {
      // If URL parsing fails, try to extract from path
      const parts = url.split('/');
      return parts[parts.length - 1] || 'document';
    }
  }

  /**
   * Get file icon class based on file extension
   */
  getFileIconClass(url: string): string {
    if (!url) return 'fa-file';
    const fileName = this.getFileNameFromUrl(url).toLowerCase();
    if (fileName.endsWith('.pdf')) return 'fa-file-pdf';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'fa-file-word';
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return 'fa-file-excel';
    if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return 'fa-file-powerpoint';
    return 'fa-file';
  }

}
