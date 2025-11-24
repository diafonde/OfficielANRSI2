import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleService, PaginatedResponse } from '../../services/article.service';
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
  searchTerm = '';
  currentLang = 'fr';
  
  // Pagination properties
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  hasMore = true;
  initialLoad = true;
  
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

    this.loadArticles(true);
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.loading || !this.hasMore || this.searchTerm) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    
    // Load more when user scrolls within 300px of bottom
    if (scrollPosition >= pageHeight - 300) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  loadArticles(reset: boolean = false) {
    if (this.loading) return;
    
    this.loading = true;
    if (reset) {
      this.currentPage = 0;
      this.articles = [];
      this.filteredArticles = [];
      this.hasMore = true;
    }

    const response = this.articleService.getAllArticles(this.currentPage, this.pageSize);
    
    response.subscribe({
      next: (result) => {
        this.loading = false;
        this.initialLoad = false;
        
        // Check if it's a paginated response
        if ('content' in result) {
          const paginatedResult = result as PaginatedResponse<Article>;
          if (reset) {
            this.articles = paginatedResult.content;
          } else {
            this.articles = [...this.articles, ...paginatedResult.content];
          }
          this.totalPages = paginatedResult.totalPages;
          this.totalElements = paginatedResult.totalElements;
          this.hasMore = this.currentPage < paginatedResult.totalPages - 1;
        } else {
          // Backward compatibility: handle array response
          const articlesArray = result as Article[];
          if (reset) {
            this.articles = articlesArray.sort((a, b) => {
              const dateA = new Date(a.publishDate).getTime();
              const dateB = new Date(b.publishDate).getTime();
              return dateB - dateA;
            });
          } else {
            this.articles = [...this.articles, ...articlesArray].sort((a, b) => {
              const dateA = new Date(a.publishDate).getTime();
              const dateB = new Date(b.publishDate).getTime();
              return dateB - dateA;
            });
          }
          this.hasMore = false; // No pagination info, assume all loaded
        }
        
        this.filteredArticles = this.articles;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.loading = false;
        this.initialLoad = false;
      }
    });
  }
  
  loadMore() {
    if (this.hasMore && !this.loading && !this.searchTerm) {
      this.currentPage++;
      this.loadArticles(false);
    }
  }

  filterArticles() {
    // If search term is cleared, reload articles with pagination
    if (!this.searchTerm && this.articles.length === 0) {
      this.loadArticles(true);
      return;
    }
    
    this.filteredArticles = this.articles.filter(article => {
      // Get translated content for search
      const translation = this.getTranslation(article, this.currentLang);
      const searchText = this.searchTerm.toLowerCase();
      
      const matchesSearch = !this.searchTerm || 
        translation.title.toLowerCase().includes(searchText) ||
        translation.excerpt.toLowerCase().includes(searchText) ||
        translation.content.toLowerCase().includes(searchText) ||
        article.author.toLowerCase().includes(searchText);
      
      return matchesSearch;
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
    this.searchTerm = '';
    this.filteredArticles = this.articles;
  }
}
