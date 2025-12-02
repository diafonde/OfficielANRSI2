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
  imageUrl?: string;
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

}
