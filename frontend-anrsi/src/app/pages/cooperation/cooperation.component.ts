import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface Partnership {
  id: string;
  title: string;
  description: string;
  type: string;
  country: string;
  flag: string;
  objectives: string[];
  status: string;
  icon: string;
  color: string;
  details?: string;
}

interface CooperationInfo {
  title: string;
  description: string;
  benefits: string[];
}

@Component({
  selector: 'app-cooperation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './cooperation.component.html',
  styleUrls: ['./cooperation.component.scss']
})
export class CooperationComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  partnerships: Partnership[] = [];
  cooperationInfo: CooperationInfo = {
    title: 'Coopération & Partenariats',
    description: 'L\'Agence est liée à des institutions d\'intérêt commun par le biais d\'accords de coopération et de partenariat pour atteindre des objectifs communs.',
    benefits: []
  };
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
    this.pageService.getPageBySlug('cooperation').subscribe({
      next: (page) => {
        this.page = page;
        this.updateTranslatedContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
        this.partnerships = [];
        this.cooperationInfo = {
          title: '',
          description: '',
          benefits: []
        };
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
      this.partnerships = [];
      this.cooperationInfo = {
        title: '',
        description: '',
        benefits: []
      };
    }
  }

  parseContent(contentString: string): void {
    try {
      const content = JSON.parse(contentString);
      
      // Handle new structured format
      if (content.cooperationInfo) {
        this.cooperationInfo = {
          title: content.cooperationInfo.title || '',
          description: content.cooperationInfo.description || '',
          benefits: content.cooperationInfo.benefits || []
        };
      } else {
        this.cooperationInfo = {
          title: '',
          description: '',
          benefits: []
        };
      }
      
      if (content.partnerships && Array.isArray(content.partnerships)) {
        this.partnerships = content.partnerships;
      } else if (Array.isArray(content)) {
        // Legacy format - content is directly an array of partnerships
        this.partnerships = content;
      } else {
        this.partnerships = [];
      }
    } catch (e) {
      console.error('Error parsing content:', e);
      // Show empty state - data should come from database via DataInitializer
      this.partnerships = [];
      this.cooperationInfo = {
        title: '',
        description: '',
        benefits: []
      };
    }
  }
}
