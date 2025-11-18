import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface ResearchPriority {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface PrioritesRecherche2026Content {
  heroTitle: string;
  heroSubtitle: string;
  introParagraphs: string[];
  sectionTitle: string;
  researchPriorities: ResearchPriority[];
  publicationDate: string;
}

@Component({
  selector: 'app-priorites-recherche-2026',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './priorites-recherche-2026.component.html',
  styleUrls: ['./priorites-recherche-2026.component.scss']
})
export class PrioritesRecherche2026Component implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  introParagraphs: string[] = [];
  sectionTitle: string = '';
  researchPriorities: ResearchPriority[] = [];
  publicationDate: string = '';
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
    this.pageService.getPageBySlug('priorites-recherche-2026').subscribe({
      next: (page) => {
        this.page = page;
        this.updateTranslatedContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
        this.heroTitle = '';
        this.heroSubtitle = '';
        this.introParagraphs = [];
        this.sectionTitle = '';
        this.researchPriorities = [];
        this.publicationDate = '';
        this.isLoading = false;
      }
    });
  }

  updateTranslatedContent(): void {
    if (!this.page) return;
    const translation = this.page.translations?.[this.currentLang];
    if (translation && translation.content) {
      try {
        this.parseContent(translation.content);
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
      this.parseContent(this.page.content);
    } else {
      // Show empty state - data should come from database via DataInitializer
      this.heroTitle = '';
      this.heroSubtitle = '';
      this.introParagraphs = [];
      this.sectionTitle = '';
      this.researchPriorities = [];
      this.publicationDate = '';
    }
  }

  parseContent(contentString: string): void {
    try {
      const content: PrioritesRecherche2026Content = JSON.parse(contentString);
      
      this.heroTitle = content.heroTitle || '';
      this.heroSubtitle = content.heroSubtitle || '';
      this.introParagraphs = content.introParagraphs || [];
      this.sectionTitle = content.sectionTitle || '';
      this.researchPriorities = content.researchPriorities || [];
      this.publicationDate = content.publicationDate || '';
    } catch (e) {
      console.error('Error parsing content:', e);
      // Show empty state - data should come from database via DataInitializer
      this.heroTitle = '';
      this.heroSubtitle = '';
      this.introParagraphs = [];
      this.sectionTitle = '';
      this.researchPriorities = [];
      this.publicationDate = '';
    }
  }
}
