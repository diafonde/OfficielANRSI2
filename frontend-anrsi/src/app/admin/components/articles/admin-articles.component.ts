import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleAdminService } from '../../services/article-admin.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-admin-articles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-articles.component.html',
  styleUrls: ['./admin-articles.component.scss']
})
export class AdminArticlesComponent implements OnInit {
  articles$: Observable<Article[]>;
  searchTerm = '';
  selectedCategory = '';

  constructor(private articleService: ArticleAdminService) {
    this.articles$ = this.articleService.getAllArticles();
  }

  ngOnInit(): void {}

  deleteArticle(id: number): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('Article deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting article:', error);
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFilteredArticles(): Observable<Article[]> {
    return this.articles$;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
  }

  getCategories(): string[] {
    // This would typically come from a service
    return ['Research', 'Environment', 'Development', 'Technology', 'Collaboration'];
  }
}
