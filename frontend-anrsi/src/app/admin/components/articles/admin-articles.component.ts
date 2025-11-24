import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, map, BehaviorSubject, combineLatest, of, startWith } from 'rxjs';
import { ArticleAdminService } from '../../services/article-admin.service';
import { Article } from '../../../models/article.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-articles',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './admin-articles.component.html',
  styleUrls: ['./admin-articles.component.scss']
})
export class AdminArticlesComponent implements OnInit {
  articles$: Observable<Article[]>;
  filteredArticles$: Observable<Article[]>;
  paginatedArticles$: Observable<Article[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  itemsPerPage = 10;
  totalPages$ = new BehaviorSubject<number>(1);

  get currentPage(): number {
    return this.currentPage$.value;
  }

  set currentPage(value: number) {
    this.currentPage$.next(value);
  }

  get totalPages(): number {
    return this.totalPages$.value;
  }

  constructor(
    private articleService: ArticleAdminService,
    private translate: TranslateService
  ) {
    // Use the service's articles$ observable which automatically updates when articles change
    this.articles$ = this.articleService.articles$;
    // Initialize with empty observables, will be set in initializeFiltering
    this.filteredArticles$ = of([]);
    this.paginatedArticles$ = of([]);
  }

  ngOnInit(): void {
    // Load articles initially if not already loaded
    this.articleService.getAllArticles().subscribe();
    this.initializeFiltering();
  }

  private initializeFiltering(): void {
    // Create filtered articles observable that reacts to articles and search term
    this.filteredArticles$ = combineLatest([
      this.articles$,
      this.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([articles, searchTerm]) => {
        const filtered = this.applyFilters(articles, searchTerm);
        const totalPages = Math.max(1, Math.ceil(filtered.length / this.itemsPerPage));
        this.totalPages$.next(totalPages);
        
        // Ensure current page is valid
        const currentPage = this.currentPage$.value;
        if (currentPage > totalPages && totalPages > 0) {
          this.currentPage$.next(Math.max(1, totalPages));
        }
        return filtered;
      })
    );

    // Create paginated articles observable that reacts to both filtered articles and page changes
    this.paginatedArticles$ = combineLatest([
      this.filteredArticles$,
      this.currentPage$
    ]).pipe(
      map(([articles, page]) => {
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return articles.slice(startIndex, endIndex);
      })
    );
  }

  private applyFilters(articles: Article[], searchTerm: string): Article[] {
    let filtered = [...articles];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt?.toLowerCase().includes(searchLower) ||
        article.author?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  deleteArticle(id: number): void {
    this.translate.get('ADMIN_ARTICLES_DELETE_CONFIRM').subscribe(confirmMsg => {
      if (confirm(confirmMsg)) {
        this.articleService.deleteArticle(id).subscribe({
          next: (success) => {
            if (success) {
              console.log('Article deleted successfully');
              // The service automatically updates articles$ via BehaviorSubject
            }
          },
          error: (error) => {
            console.error('Error deleting article:', error);
            this.translate.get('ADMIN_ARTICLES_DELETE_ERROR').subscribe(errorMsg => {
              alert(errorMsg);
            });
          }
        });
      }
    });
  }

  toggleFeatured(article: Article): void {
    const newFeaturedStatus = !article.featured;
    this.articleService.toggleFeatured(article.id, newFeaturedStatus).subscribe({
      next: () => {
        // The service updates the BehaviorSubject, so the view will automatically update
        // via the async pipe
      },
      error: (error) => {
        console.error('Error toggling featured status:', error);
        this.translate.get('ADMIN_ARTICLES_FEATURED_ERROR').subscribe(errorMsg => {
          alert(errorMsg);
        });
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFilteredArticles(): Observable<Article[]> {
    return this.paginatedArticles$;
  }

  getTotalArticlesCount(): Observable<number> {
    return this.filteredArticles$.pipe(
      map(articles => articles.length)
    );
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm$.next(target.value.toLowerCase());
    this.currentPage = 1; // Reset to first page on search
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const totalPages = this.totalPages;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  hasTranslation(article: Article, lang: 'fr' | 'ar' | 'en'): boolean {
    // Check if article has translations object and the specific language
    if (article.translations && article.translations[lang]) {
      const translation = article.translations[lang];
      return !!(translation && translation.title && translation.content);
    }
    // Fallback: check if article language matches (for backward compatibility)
    if (article.language === lang) {
      return !!(article.title && article.content);
    }
    return false;
  }

  // Expose Math to template
  Math = Math;
}
