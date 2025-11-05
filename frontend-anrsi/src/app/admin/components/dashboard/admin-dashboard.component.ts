import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleAdminService } from '../../services/article-admin.service';
import { AuthService } from '../../services/auth.service';
import { Article } from '../../../models/article.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  articles$: Observable<Article[]>;
  currentUser: User | null = null;
  stats = {
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    recentArticles: 0
  };

  constructor(
    private articleService: ArticleAdminService,
    private authService: AuthService
  ) {
    this.articles$ = this.articleService.getAllArticles();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.articles$.subscribe(articles => {
      this.calculateStats(articles);
    });
  }

  private calculateStats(articles: Article[]): void {
    this.stats.totalArticles = articles.length;
    this.stats.publishedArticles = articles.length; // All articles are considered published in this demo
    this.stats.draftArticles = 0; // No drafts in this demo
    this.stats.recentArticles = articles.filter(article => {
      const articleDate = new Date(article.publishDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return articleDate >= weekAgo;
    }).length;
  }

  getRecentArticles(): Observable<Article[]> {
    return this.articles$;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
