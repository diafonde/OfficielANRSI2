import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Article, ArticleTranslation } from '../../models/article.model';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit, OnDestroy {
  @Input() article!: Article;
  @Input() isFeatured: boolean = false;
  
  currentLang = 'fr';
  displayTitle = '';
  displayExcerpt = '';
  private langSubscription?: Subscription;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updateTranslatedContent();
    });

    this.updateTranslatedContent();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  /**
   * Update translated content based on current language
   */
  private updateTranslatedContent(): void {
    if (!this.article) return;

    const translation = this.getTranslation(this.article, this.currentLang);
    this.displayTitle = translation.title;
    this.displayExcerpt = translation.excerpt;
  }

  /**
   * Get translation for a specific language, with fallback to default article fields
   */
  private getTranslation(article: Article, lang: string): ArticleTranslation {
    // Try to get translation for the requested language
    if (article.translations && article.translations[lang as 'fr' | 'ar' | 'en']) {
      return article.translations[lang as 'fr' | 'ar' | 'en']!;
    }
    
    // Fallback to default article fields
    return {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt
    };
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/article1.jpeg';
  }
}