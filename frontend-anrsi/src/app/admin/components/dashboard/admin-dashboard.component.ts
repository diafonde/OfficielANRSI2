import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleAdminService } from '../../services/article-admin.service';
import { AuthService } from '../../services/auth.service';
import { Article } from '../../../models/article.model';
import { User } from '../../models/user.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  articles$: Observable<Article[]>;
  currentUser: User | null = null;
  currentLang = 'fr';
  isLangDropdownOpen = false;
  stats = {
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    recentArticles: 0
  };

  constructor(
    private articleService: ArticleAdminService,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    this.articles$ = this.articleService.getAllArticles();
    // Initialize current language
    this.currentLang = this.translate.currentLang || 'fr';
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.articles$.subscribe(articles => {
      this.calculateStats(articles);
    });

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const isClickInsideDropdown = target.closest('.language-switcher');
    if (!isClickInsideDropdown) {
      this.isLangDropdownOpen = false;
    }
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.isLangDropdownOpen = false;
  }

  toggleLangDropdown() {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  getLanguageFlag(lang: string): string {
    const flags: { [key: string]: string } = {
      'fr': '🇫🇷',
      'ar': '🇲🇷'
    };
    return flags[lang] || '🇫🇷';
  }

  getLanguageName(lang: string): string {
    const names: { [key: string]: string } = {
      'fr': 'Français',
      'ar': 'العربية'
    };
    return names[lang] || 'Français';
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
