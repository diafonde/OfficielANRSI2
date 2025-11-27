import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface OverviewItem {
  icon: string;
  title: string;
  content: { label: string; value: string }[];
}

interface ThemeItem {
  icon: string;
  title: string;
  items: string[];
}

interface Session {
  time: string;
  title: string;
  description: string;
}

interface ProgrammeDay {
  date: string;
  theme: string;
  sessions: Session[];
}

interface Speaker {
  avatar: string;
  name: string;
  title: string;
  bio: string;
}

interface RegistrationMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
  price: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface MediaItem {
  image?: string;
  mediaText?: string;
  mediaLink?: string;
}

interface ZoneHumideContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  media?: MediaItem[];
  // Legacy support for old format
  image?: string;
  mediaText?: string;
  mediaLink?: string;
  overview: OverviewItem[];
  themes: ThemeItem[];
  programme: ProgrammeDay[];
  speakers: Speaker[];
  registrationModes: RegistrationMode[];
  processSteps: ProcessStep[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-zone-humide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './zone-humide.component.html',
  styleUrls: ['./zone-humide.component.scss']
})
export class ZoneHumideComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: ZoneHumideContent | null = null;
  isLoading = true;
  currentLang: string = 'fr';
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

  loadPage(): void {
    this.pageService.getPageBySlug('zone-humide').subscribe({
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

    // Try to get translation for current language
    const translation = this.page.translations?.[this.currentLang];
    
    if (translation && translation.content) {
      try {
        const parsedContent = JSON.parse(translation.content);
        // Check if it's the new format with translations
        if (parsedContent.translations) {
          // Get content for current language, fallback to 'fr'
          const lang = this.currentLang || 'fr';
          this.content = parsedContent.translations[lang] || parsedContent.translations.fr || null;
        } else {
          // Old format - use directly
          this.content = parsedContent;
        }
        // Update page title and hero from translation
        if (translation.heroTitle) {
          this.page.heroTitle = translation.heroTitle;
        }
        if (translation.heroSubtitle) {
          this.page.heroSubtitle = translation.heroSubtitle;
        }
        if (translation.title) {
          this.page.title = translation.title;
        }
      } catch (e) {
        console.error('Error parsing translated content:', e);
        this.loadContentFromPage();
      }
    } else {
      // Fallback to page.content or default
      this.loadContentFromPage();
    }
  }

  loadContentFromPage(): void {
    if (this.page?.content) {
      try {
        const parsedContent = JSON.parse(this.page.content);
        // Check if it's the new format with translations
        if (parsedContent.translations) {
          // Get content for current language, fallback to 'fr'
          const lang = this.currentLang || 'fr';
          this.content = parsedContent.translations[lang] || parsedContent.translations.fr || null;
        } else {
          // Old format - use directly
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

  getMediaItems(): MediaItem[] {
    return this.content?.media || [];
  }

  hasMedia(): boolean {
    return !!(this.content?.media && this.content.media.length > 0);
  }

  hasLegacyMedia(): boolean {
    return !this.content?.media && !!(this.content?.image || this.content?.mediaText || this.content?.mediaLink);
  }

  hasAnyImage(): boolean {
    const items = this.getMediaItems();
    return items.some(item => !!item.image);
  }

  hasAnyText(): boolean {
    const items = this.getMediaItems();
    return items.some(item => !!item.mediaText);
  }

  hasAnyLink(): boolean {
    const items = this.getMediaItems();
    return items.some(item => !!item.mediaLink);
  }
}
