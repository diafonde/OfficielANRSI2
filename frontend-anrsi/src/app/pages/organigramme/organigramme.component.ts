import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface Position {
  icon: string;
  title: string;
  description: string;
  isDirector?: boolean;
}

interface Level {
  levelNumber: number;
  positions: Position[];
}

interface Responsibility {
  icon: string;
  title: string;
  description: string;
}

interface OrganigrammeContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  levels: Level[];
  responsibilitiesTitle: string;
  responsibilities: Responsibility[];
}

@Component({
  selector: 'app-organigramme',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss']
})
export class OrganigrammeComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  introText: string = '';
  levels: Level[] = [];
  responsibilitiesTitle: string = '';
  responsibilities: Responsibility[] = [];
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
    this.pageService.getPageBySlug('organigramme').subscribe({
      next: (page) => {
        this.page = page;
        this.updateTranslatedContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        // Show empty state - data should come from database via DataInitializer
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
      this.sectionTitle = '';
      this.introText = '';
      this.levels = [];
      this.responsibilitiesTitle = '';
      this.responsibilities = [];
    }
  }

  parseContent(contentString: string): void {
    try {
      const content: OrganigrammeContent = JSON.parse(contentString);
      
      this.heroTitle = content.heroTitle || '';
      this.heroSubtitle = content.heroSubtitle || '';
      this.sectionTitle = content.sectionTitle || '';
      this.introText = content.introText || '';
      this.levels = content.levels || [];
      this.responsibilitiesTitle = content.responsibilitiesTitle || '';
      this.responsibilities = content.responsibilities || [];
    } catch (e) {
      console.error('Error parsing content:', e);
      // Show empty state instead of loading defaults
      this.heroTitle = '';
      this.heroSubtitle = '';
      this.sectionTitle = '';
      this.introText = '';
      this.levels = [];
      this.responsibilitiesTitle = '';
      this.responsibilities = [];
    }
  }

}
