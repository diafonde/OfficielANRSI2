import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ArticleCardComponent],
  template: `
    <div class="articles-hero">
      <div class="container">
        <h1>Toutes les Actualités</h1>
        <p>Découvrez toutes les actualités et événements de l'ANRSI</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section articles-section">
        <div class="articles-header">
          <h2>Articles et Actualités</h2>
          <p class="articles-count">{{ articles.length }} article(s) trouvé(s)</p>
        </div>
        
        <div class="articles-filters">
          <div class="filter-group">
            <label for="category-filter">Catégorie:</label>
            <select id="category-filter" [(ngModel)]="selectedCategory" (change)="filterArticles()">
              <option value="">Toutes les catégories</option>
              <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="search-filter">Recherche:</label>
            <input 
              id="search-filter" 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="filterArticles()"
              placeholder="Rechercher un article...">
          </div>
        </div>
        
        <div class="articles-grid" *ngIf="filteredArticles.length > 0">
          <app-article-card 
            *ngFor="let article of filteredArticles" 
            [article]="article">
          </app-article-card>
        </div>
        
        <div class="no-articles" *ngIf="filteredArticles.length === 0">
          <div class="no-articles-content">
            <div class="no-articles-icon">📰</div>
            <h3>Aucun article trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou de filtrer par catégorie.</p>
            <button class="btn btn-primary" (click)="clearFilters()">Effacer les filtres</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .articles-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/anrsiback.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 60px;
    }
    
    .articles-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .articles-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .articles-hero p {
      font-size: clamp(1.1rem, 2vw, 1.5rem);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, rgba(10, 61, 98, 0.8), rgba(10, 61, 98, 0.6));
      z-index: 1;
    }
    
    .articles-section {
      padding: var(--space-12) 0;
    }
    
    .articles-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }
    
    .articles-header h2 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-3xl);
    }
    
    .articles-count {
      color: var(--neutral-600);
      font-size: var(--text-lg);
    }
    
    .articles-filters {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: var(--neutral-50);
      border-radius: 12px;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      min-width: 200px;
    }
    
    .filter-group label {
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .filter-group select,
    .filter-group input {
      padding: var(--space-3);
      border: 1px solid var(--neutral-300);
      border-radius: 6px;
      font-size: var(--text-sm);
      transition: border-color 0.3s ease;
    }
    
    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: var(--primary-500);
    }
    
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .no-articles {
      text-align: center;
      padding: var(--space-16) var(--space-4);
    }
    
    .no-articles-content {
      max-width: 400px;
      margin: 0 auto;
    }
    
    .no-articles-icon {
      font-size: 4rem;
      margin-bottom: var(--space-4);
    }
    
    .no-articles h3 {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .no-articles p {
      color: var(--neutral-600);
      margin-bottom: var(--space-6);
      line-height: 1.6;
    }
    
    .btn {
      display: inline-block;
      padding: var(--space-3) var(--space-6);
      background-color: var(--primary-500);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.3s ease;
      border: none;
      cursor: pointer;
    }
    
    .btn:hover {
      background-color: var(--primary-600);
    }
    
    .btn-primary {
      background-color: var(--primary-500);
    }
    
    .btn-primary:hover {
      background-color: var(--primary-600);
    }
    
    @media (max-width: 768px) {
      .articles-filters {
        flex-direction: column;
        gap: var(--space-4);
      }
      
      .filter-group {
        min-width: 100%;
      }
      
      .articles-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadArticles();
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
      const matchesSearch = !this.searchTerm || 
        article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }

  clearFilters() {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.filteredArticles = this.articles;
  }
}
