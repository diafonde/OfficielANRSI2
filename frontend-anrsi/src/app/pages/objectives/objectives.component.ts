import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface ObjectiveItem {
  number: number;
  title: string;
  description: string;
}

interface ObjectivesLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  objectives: ObjectiveItem[];
}

interface ObjectivesContent {
  translations: {
    fr: ObjectivesLanguageContent;
    ar: ObjectivesLanguageContent;
    en: ObjectivesLanguageContent;
  };
}

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: ObjectivesContent | null = null;
  displayContent: ObjectivesLanguageContent | null = null;
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
    this.pageService.getPageBySlug('objectives').subscribe({
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
              const oldContent: ObjectivesLanguageContent = parsedContent;
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
          const oldContent: ObjectivesLanguageContent = parsedContent;
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

  private getEmptyLanguageContent(): ObjectivesLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      sectionTitle: '',
      objectives: []
    };
  }


  // Getters for template
  get heroTitle(): string {
    return this.displayContent?.heroTitle || '';
  }

  get heroSubtitle(): string {
    return this.displayContent?.heroSubtitle || '';
  }

  get sectionTitle(): string {
    return this.displayContent?.sectionTitle || '';
  }

  get objectives(): ObjectiveItem[] {
    return this.displayContent?.objectives || [];
  }
}
