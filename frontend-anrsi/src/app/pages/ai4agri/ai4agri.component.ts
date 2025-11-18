import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface WorkshopItem {
  date: string;
  title: string;
  description: string;
  detailsTitle?: string;
  detailsItems: string[];
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface PartnershipHighlight {
  icon: string;
  title: string;
  description: string;
}

interface Ai4agriLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  workshops: WorkshopItem[];
  benefits: BenefitItem[];
  partnershipText: string;
  partnershipHighlights: PartnershipHighlight[];
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
  imports: [CommonModule, TranslateModule],
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
    if (!this.page) return;
    
    // Try to get translation from page.translations (new system)
    const translation = this.page.translations?.[this.currentLang];
    if (translation && translation.content) {
      try {
        const parsedContent = JSON.parse(translation.content);
        this.displayContent = parsedContent;
        if (translation.heroTitle) this.page.heroTitle = translation.heroTitle;
        if (translation.heroSubtitle) this.page.heroSubtitle = translation.heroSubtitle;
        if (translation.title) this.page.title = translation.title;
        return;
      } catch (e) {
        console.error('Error parsing translated content:', e);
      }
    }
    
    // Fallback to old format if available
    if (this.content) {
      const langContent = this.content.translations[this.currentLang as 'fr' | 'ar' | 'en'];
      this.displayContent = langContent || this.content.translations.fr;
    } else {
      this.loadContentFromPage();
    }
  }

  loadPage(): void {
    this.pageService.getPageBySlug('ai4agri').subscribe({
      next: (page) => {
        this.page = page;
        // Try new translation system first
        if (page.translations && Object.keys(page.translations).length > 0) {
          this.updateTranslatedContent();
        } else if (page.content) {
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
            console.error('Error parsing content:', e);
            // Show empty state - data should come from database via DataInitializer
            this.content = null;
            this.displayContent = null;
          }
        } else {
          // Show empty state - data should come from database via DataInitializer
          this.content = null;
          this.displayContent = null;
        }
        this.isLoading = false;
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
        const parsedContent = JSON.parse(this.page.content);
        if (parsedContent.translations) {
          this.content = parsedContent;
          this.updateTranslatedContent();
        } else {
          const oldContent: Ai4agriLanguageContent = parsedContent;
          this.displayContent = oldContent;
        }
      } catch (e) {
        console.error('Error parsing content:', e);
        // Show empty state - data should come from database via DataInitializer
        this.content = null;
        this.displayContent = null;
      }
    } else {
      // Show empty state - data should come from database via DataInitializer
      this.content = null;
      this.displayContent = null;
    }
  }

  private getEmptyLanguageContent(): Ai4agriLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      workshops: [],
      benefits: [],
      partnershipText: '',
      partnershipHighlights: []
    };
  }

}
