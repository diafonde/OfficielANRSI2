import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, ArticleCardComponent, TranslateModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  currentLang = 'fr';
  private langSubscription?: Subscription;

  constructor(
    private articleService: ArticleService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.filterArticles();
    });

    this.loadArticles();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  loadArticles() {
    this.articleService.getAllArticles().subscribe(articles => {
      this.articles = articles;
      this.filteredArticles = articles;
      this.extractCategories();
    });
  }

  extractCategories() {
    this.categories = [...new Set(this.articles.map(article => article.category))].sort();
  }

  filterArticles() {
    this.filteredArticles = this.articles.filter(article => {
      const matchesCategory = !this.selectedCategory || article.category === this.selectedCategory;
      
      // Get translated content for search
      const translation = this.getTranslation(article, this.currentLang);
      const searchText = this.searchTerm.toLowerCase();
      
      const matchesSearch = !this.searchTerm || 
        translation.title.toLowerCase().includes(searchText) ||
        translation.excerpt.toLowerCase().includes(searchText) ||
        translation.content.toLowerCase().includes(searchText) ||
        article.author.toLowerCase().includes(searchText) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchText));
      
      return matchesCategory && matchesSearch;
    });
  }

  /**
   * Get translation for a specific language, with fallback to default article fields
   */
  private getTranslation(article: Article, lang: string): { title: string; excerpt: string; content: string } {
    // Try to get translation for the requested language
    if (article.translations && article.translations[lang as 'fr' | 'ar' | 'en']) {
      return article.translations[lang as 'fr' | 'ar' | 'en']!;
    }
    
    // Fallback to default article fields
    return {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content
    };
  }

  clearFilters() {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.filteredArticles = this.articles;
  }
}
