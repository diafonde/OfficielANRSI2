import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter, skip } from 'rxjs/operators';
import { PageService, PageDTO } from '../../services/page.service';

interface MediaOverview {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface CoverageItem {
  date: string;
  title: string;
  description: string;
  mediaOutlets: { type: string; name: string }[];
}

interface MediaType {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface PressRelease {
  date: string;
  title: string;
  description: string;
  link?: string;
}

interface MediaKitItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface SocialPlatform {
  icon: string;
  name: string;
  handle: string;
  link?: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface MediaLink {
  label: string;
  url: string;
}

interface ArticleLink {
  title: string;
  url: string;
}

interface AgenceMediasContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  mediaLinks?: MediaLink[];
  articleLinks?: ArticleLink[];
  mediaOverview: MediaOverview[];
  recentCoverage: CoverageItem[];
  mediaTypes: MediaType[];
  pressReleases: PressRelease[];
  
  socialMedia: SocialPlatform[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-agence-medias',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './agence-medias.component.html',
  styleUrls: ['./agence-medias.component.scss']
})
export class AgenceMediasComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: AgenceMediasContent | null = null;
  isLoading = true;
  currentLang: string = 'fr';
  private langSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private pageService: PageService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updateTranslatedContent();
    });

    // Load page on initial load
    this.loadPage();

    // Subscribe to router events to reload data when navigating to this route
    // Skip the first event (initial load) since we already loaded above
    this.routerSubscription = this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        skip(1) // Skip the initial navigation event
      )
      .subscribe((event) => {
        // Reload data when navigating to /agence-medias route
        if (event.urlAfterRedirects === '/agence-medias' || event.urlAfterRedirects.startsWith('/agence-medias')) {
          console.log('Route activated, reloading agence-medias data');
          this.loadPage();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadPage(): void {
    this.pageService.getPageBySlug('agence-medias').subscribe({
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
            // Ensure mediaLinks and articleLinks are initialized as arrays if they don't exist
            if (!langContent.mediaLinks) {
              langContent.mediaLinks = [];
            }
            if (!langContent.articleLinks) {
              langContent.articleLinks = [];
            }
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
        const parsedContent = JSON.parse(translation.content);
        // Ensure mediaLinks and articleLinks are initialized as arrays if they don't exist
        if (!parsedContent.mediaLinks) {
          parsedContent.mediaLinks = [];
        }
        if (!parsedContent.articleLinks) {
          parsedContent.articleLinks = [];
        }
        this.content = parsedContent;
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
            // Ensure mediaLinks is initialized as an array if it doesn't exist
            if (!langContent.mediaLinks) {
              langContent.mediaLinks = [];
            }
            this.content = langContent;
          } else {
            this.content = null;
          }
        } else {
          // Old format - single language
          // Ensure mediaLinks and articleLinks are initialized as arrays if they don't exist
          if (!parsedContent.mediaLinks) {
            parsedContent.mediaLinks = [];
          }
          if (!parsedContent.articleLinks) {
            parsedContent.articleLinks = [];
          }
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

}
