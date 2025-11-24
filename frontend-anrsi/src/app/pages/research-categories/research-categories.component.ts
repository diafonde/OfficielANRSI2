import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleService, PaginatedResponse } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-research-categories',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent],
  template: `
    <div class="categories-hero">
      <div class="container">
        <h1>Research Fields</h1>
        <p>Explore our diverse research areas and latest discoveries</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section categories-nav-section">
        <div class="categories-nav">
          <button
            *ngFor="let category of categories"
            class="category-btn"
            [class.active]="selectedCategory === category"
            (click)="selectCategory(category)">
            {{ category }}
          </button>
        </div>
        
        <div class="category-description" *ngIf="selectedCategory">
          <h2>{{ selectedCategory }}</h2>
          <p>{{ getCategoryDescription(selectedCategory) }}</p>
        </div>
      </section>
      
      <section class="section articles-section">
        <div class="grid grid-4" *ngIf="filteredArticles.length > 0">
          <app-article-card 
            *ngFor="let article of filteredArticles" 
            [article]="article">
          </app-article-card>
        </div>
        
        <div class="no-articles" *ngIf="filteredArticles.length === 0">
          <p>No articles found for this category. Please check back later for updates.</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .categories-hero {
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
    
    .categories-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .categories-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .categories-hero p {
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
    
    .categories-nav-section {
      padding-top: var(--space-12);
      padding-bottom: var(--space-8);
    }
    
    .categories-nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      justify-content: center;
      margin-bottom: var(--space-8);
    }
    
    .category-btn {
      padding: var(--space-2) var(--space-4);
      background-color: var(--neutral-100);
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .category-btn.active {
      background-color: var(--primary-500);
      color: white;
    }
    
    .category-btn:hover:not(.active) {
      background-color: var(--neutral-200);
    }
    
    .category-description {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-in;
    }
    
    .category-description h2 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
    }
    
    .articles-section {
      padding-top: 0;
      min-height: 400px;
    }
    
    .no-articles {
      text-align: center;
      padding: var(--space-16) var(--space-4);
      color: var(--neutral-600);
      font-size: var(--text-lg);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ResearchCategoriesComponent implements OnInit {
  categories: string[] = [
    'All Topics',
    'Quantum Physics',
    'Environmental Science',
    'Medical Research',
    'Artificial Intelligence',
    'Renewable Energy',
    'Astronomy'
  ];
  
  categoryDescriptions: { [key: string]: string } = {
    'All Topics': 'Explore all research articles across our diverse scientific disciplines.',
    'Quantum Physics': 'Investigating the fundamental nature of reality at the quantum level, including quantum computing, quantum field theory, and quantum entanglement.',
    'Environmental Science': 'Researching ecological systems, climate dynamics, pollution mitigation, and sustainable development strategies.',
    'Medical Research': 'Advancing medical knowledge through studies in genetics, drug development, disease mechanisms, and innovative treatment approaches.',
    'Artificial Intelligence': 'Developing intelligent systems that can learn, reason, and adapt, with applications in natural language processing, computer vision, and decision-making.',
    'Renewable Energy': 'Researching sustainable energy sources including solar, wind, geothermal, and advanced energy storage solutions.',
    'Astronomy': 'Studying celestial objects, space phenomena, and the universe'
  };
  
  selectedCategory: string = 'All Topics';
  allArticles: Article[] = [];
  filteredArticles: Article[] = [];
  
  constructor(private articleService: ArticleService) {}
  
  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe({
      next: (result) => {
        // Handle both paginated and array responses
        if ('content' in result) {
          this.allArticles = (result as PaginatedResponse<Article>).content;
        } else {
          this.allArticles = result as Article[];
        }
        this.filterArticles();
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.allArticles = [];
        this.filterArticles();
      }
    });
  }
  
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterArticles();
  }
  
  filterArticles(): void {
    if (this.selectedCategory === 'All Topics') {
      this.filteredArticles = this.allArticles;
    } else {
      this.filteredArticles = this.allArticles.filter(
        article => article.category === this.selectedCategory
      );
    }
  }
  
  getCategoryDescription(category: string): string {
    return this.categoryDescriptions[category] || '';
  }
}