import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface PlateformeItem {
  icon: string;
  title: string;
  description: string;
  equipments: string[];
  services: string[];
  contact: string;
}

interface AccessMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface BookingStep {
  number: number;
  title: string;
  description: string;
}

interface SupportItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface PlateformesContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  mediaLink?: string;
  plateformes: PlateformeItem[];
  accessModes: AccessMode[];
  bookingSteps: BookingStep[];
  bookingRequirements: string[];
  supportItems: SupportItem[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-plateformes',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './plateformes.component.html',
  styleUrls: ['./plateformes.component.scss']
})
export class PlateformesComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: PlateformesContent | null = null;
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
    this.pageService.getPageBySlug('plateformes').subscribe({
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
