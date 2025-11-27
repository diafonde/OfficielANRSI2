import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface RequirementItem {
  icon: string;
  title: string;
  items: string[];
}

interface DomainItem {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ExpertAnrsiContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  requirements: RequirementItem[];
  domains: DomainItem[];
  processSteps: ProcessStep[];
  benefits: BenefitItem[];
  applicationText: string;
  contactInfo: ContactItem[];
  requiredDocuments: string[];
  applicationLink: string;
}

@Component({
  selector: 'app-expert-anrsi',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './expert-anrsi.component.html',
  styleUrls: ['./expert-anrsi.component.scss']
})
export class ExpertAnrsiComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: ExpertAnrsiContent | null = null;
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
    this.pageService.getPageBySlug('expert-anrsi').subscribe({
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
    const translation = this.page.translations?.[this.currentLang];
    if (translation && translation.content) {
      try {
        this.content = JSON.parse(translation.content);
        // Ensure heroTitle and heroSubtitle are in content
        if (translation.heroTitle) {
          this.page.heroTitle = translation.heroTitle;
          if (this.content) {
            this.content.heroTitle = translation.heroTitle;
          }
        }
        if (translation.heroSubtitle) {
          this.page.heroSubtitle = translation.heroSubtitle;
          if (this.content) {
            this.content.heroSubtitle = translation.heroSubtitle;
          }
        }
        if (translation.title) this.page.title = translation.title;
      } catch (e) {
        console.error('Error parsing translated content:', e);
        this.loadContentFromPage();
      }
    } else {
      this.loadContentFromPage();
    }
  }

  loadContentFromPage(): void {
    if (this.page?.content) {
      try {
        this.content = JSON.parse(this.page.content);
        // Ensure heroTitle and heroSubtitle are in content if they exist in page
        if (this.content && this.page.heroTitle && !this.content.heroTitle) {
          this.content.heroTitle = this.page.heroTitle;
        }
        if (this.content && this.page.heroSubtitle && !this.content.heroSubtitle) {
          this.content.heroSubtitle = this.page.heroSubtitle;
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

  // Getters for template
  get heroTitle(): string {
    return this.content?.heroTitle || this.page?.heroTitle || '';
  }

  get heroSubtitle(): string {
    return this.content?.heroSubtitle || this.page?.heroSubtitle || '';
  }

}
