import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, TranslateModule],
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
      this.loadContentFromPage();
    }
  }

  loadContentFromPage(): void {
    if (this.page?.content) {
      try {
        this.content = JSON.parse(this.page.content);
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
