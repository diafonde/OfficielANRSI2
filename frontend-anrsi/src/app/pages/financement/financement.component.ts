import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface FinancementContent {
  heroTitle: string;
  heroSubtitle: string;
  process: ProcessStep[];
  requirements: string[];
  benefits: string[];
  ctaTitle?: string;
  ctaDescription?: string;
}

@Component({
  selector: 'app-financement',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './financement.component.html',
  styleUrls: ['./financement.component.scss']
})
export class FinancementComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  fundingInfo = {
    title: 'Financement',
    description: 'L\'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s\'inscrivent dans le cadre des programmes de l\'Agence qui sont annoncés annuellement.',
    process: [] as ProcessStep[],
    requirements: [] as string[],
    benefits: [] as string[]
  };
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
    this.pageService.getPageBySlug('financement').subscribe({
      next: (page) => {
        this.page = page;
        this.updateTranslatedContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
        this.fundingInfo = {
          title: '',
          description: '',
          process: [],
          requirements: [],
          benefits: []
        };
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
      this.fundingInfo = {
        title: '',
        description: '',
        process: [],
        requirements: [],
        benefits: []
      };
      this.ctaTitle = '';
      this.ctaDescription = '';
    }
  }

  parseContent(contentString: string): void {
    try {
      const content: FinancementContent = JSON.parse(contentString);
      
      this.fundingInfo = {
        title: content.heroTitle || '',
        description: content.heroSubtitle || '',
        process: content.process || [],
        requirements: content.requirements || [],
        benefits: content.benefits || []
      };
      
      this.ctaTitle = content.ctaTitle || '';
      this.ctaDescription = content.ctaDescription || '';
    } catch (e) {
      console.error('Error parsing content:', e);
      // Show empty state - data should come from database via DataInitializer
      this.fundingInfo = {
        title: '',
        description: '',
        process: [],
        requirements: [],
        benefits: []
      };
      this.ctaTitle = '';
      this.ctaDescription = '';
    }
  }
}
