import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface Programme {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  icon: string;
  color: string;
  details?: string;
}

@Component({
  selector: 'app-programmes',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss']
})
export class ProgrammesComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  programmes: Programme[] = [];
  heroTitle: string = '';
  heroSubtitle: string = '';
  ctaTitle: string = '';
  ctaDescription: string = '';
  isLoading = true;
  currentLang: string = 'fr';
  private langSubscription?: Subscription;

  constructor(
    private pageService: PageService,
    private translate: TranslateService
  ) {}
  

  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
    
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
    this.pageService.getPageBySlug('programmes').subscribe({
      next: (page) => {
        this.page = page;
        this.updateTranslatedContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
        this.programmes = [];
        this.heroTitle = '';
        this.heroSubtitle = '';
        this.ctaTitle = '';
        this.ctaDescription = '';
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
      this.programmes = [];
      this.heroTitle = '';
      this.heroSubtitle = '';
      this.ctaTitle = '';
      this.ctaDescription = '';
    }
  }

  parseContent(contentString: string): void {
    try {
      const content = JSON.parse(contentString);
      
      // Handle new structured format
      if (content.programmes && Array.isArray(content.programmes)) {
        this.programmes = content.programmes;
        this.heroTitle = content.heroTitle || '';
        this.heroSubtitle = content.heroSubtitle || '';
        this.ctaTitle = content.ctaTitle || '';
        this.ctaDescription = content.ctaDescription || '';
      } else if (Array.isArray(content)) {
        // Legacy format - content is directly an array of programmes
        this.programmes = content;
        this.heroTitle = '';
        this.heroSubtitle = '';
        this.ctaTitle = '';
        this.ctaDescription = '';
      } else {
        // Show empty state - data should come from database via DataInitializer
        this.programmes = [];
        this.heroTitle = '';
        this.heroSubtitle = '';
        this.ctaTitle = '';
        this.ctaDescription = '';
      }
    } catch (e) {
      console.error('Error parsing content:', e);
      // Show empty state - data should come from database via DataInitializer
      this.programmes = [];
      this.heroTitle = '';
      this.heroSubtitle = '';
      this.ctaTitle = '';
      this.ctaDescription = '';
    }
  }
}
