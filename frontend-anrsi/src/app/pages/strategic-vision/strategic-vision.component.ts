import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface StrategicVisionContent {
  heroTitle: string;
  heroSubtitle: string;
  visionTitle: string;
  visionText: string;
  messageTitle: string;
  messageText: string;
  valuesTitle: string;
  values: ValueItem[];
}

@Component({
  selector: 'app-strategic-vision',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './strategic-vision.component.html',
  styleUrls: ['./strategic-vision.component.scss']
})
export class StrategicVisionComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  visionTitle: string = '';
  visionText: string = '';
  messageTitle: string = '';
  messageText: string = '';
  valuesTitle: string = '';
  values: ValueItem[] = [];
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
    this.pageService.getPageBySlug('strategic-vision').subscribe({
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
        this.visionTitle = '';
        this.visionText = '';
        this.messageTitle = '';
        this.messageText = '';
        this.valuesTitle = '';
        this.values = [];
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
      this.visionTitle = '';
      this.visionText = '';
      this.messageTitle = '';
      this.messageText = '';
      this.valuesTitle = '';
      this.values = [];
    }
  }

  parseContent(contentString: string): void {
    try {
      const content: StrategicVisionContent = JSON.parse(contentString);
      
      this.heroTitle = content.heroTitle || '';
      this.heroSubtitle = content.heroSubtitle || '';
      this.visionTitle = content.visionTitle || '';
      this.visionText = content.visionText || '';
      this.messageTitle = content.messageTitle || '';
      this.messageText = content.messageText || '';
      this.valuesTitle = content.valuesTitle || '';
      this.values = content.values || [];
    } catch (e) {
      console.error('Error parsing content:', e);
      // Show empty state - data should come from database via DataInitializer
      this.heroTitle = '';
      this.heroSubtitle = '';
      this.visionTitle = '';
      this.visionText = '';
      this.messageTitle = '';
      this.messageText = '';
      this.valuesTitle = '';
      this.values = [];
    }
  }
}
