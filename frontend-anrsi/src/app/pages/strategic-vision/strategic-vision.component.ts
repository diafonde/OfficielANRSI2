import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface StrategicVisionContent {
  heroTitle: string;
  heroSubtitle: string;
  visionTitle: string;
  visionText: string;
  messageTitle: string;
  messageText: string;
  valuesTitle: string;
  values: ValueItem[];
}

@Component({
  selector: 'app-strategic-vision',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vision-hero">
      <div class="container">
        <h1>{{ heroTitle || 'Vision Stratégique' }}</h1>
        <p>{{ heroSubtitle || "La vision et le message de l'Agence Nationale de la Recherche Scientifique et de l'Innovation" }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading">
      <section class="section vision-section">
        <div class="vision-content">
          <div class="vision-card" *ngIf="visionTitle || visionText">
            <div class="vision-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h2>{{ visionTitle || 'Vision' }}</h2>
            <p class="vision-text" *ngIf="visionText">
              {{ visionText }}
            </p>
          </div>
          
          <div class="message-card" *ngIf="messageTitle || messageText">
            <div class="message-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2>{{ messageTitle || 'Le Message' }}</h2>
            <p class="message-text" *ngIf="messageText">
              {{ messageText }}
            </p>
          </div>
          
          <div class="values-section" *ngIf="values && values.length > 0">
            <h3>{{ valuesTitle || 'Nos Valeurs' }}</h3>
            <div class="values-grid">
              <div class="value-item" *ngFor="let value of values">
                <div class="value-icon">{{ value.icon }}</div>
                <h4>{{ value.title }}</h4>
                <p>{{ value.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .vision-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/anrsiback.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .vision-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .vision-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .vision-hero p {
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
    
    .vision-section {
      padding: var(--space-12) 0;
    }
    
    .vision-content {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .vision-card,
    .message-card {
      background: white;
      padding: var(--space-8);
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      margin-bottom: var(--space-8);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .vision-card:hover,
    .message-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }
    
    .vision-icon,
    .message-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--space-4);
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--primary-50);
      border-radius: 50%;
      color: var(--primary-600);
    }
    
    .vision-icon svg,
    .message-icon svg {
      width: 40px;
      height: 40px;
    }
    
    .vision-card h2,
    .message-card h2 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
      font-size: var(--text-2xl);
    }
    
    .vision-text,
    .message-text {
      color: var(--neutral-700);
      font-size: var(--text-lg);
      line-height: 1.7;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .values-section {
      margin-top: var(--space-12);
    }
    
    .values-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .value-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .value-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .value-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .value-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .value-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .vision-card,
      .message-card {
        padding: var(--space-6);
      }
      
      .values-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .loading-container {
      padding: var(--space-12);
      text-align: center;
    }
    
    .loading {
      color: var(--neutral-600);
      font-size: var(--text-lg);
    }
  `]
})
export class StrategicVisionComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  visionTitle: string = '';
  visionText: string = '';
  messageTitle: string = '';
  messageText: string = '';
  valuesTitle: string = '';
  values: ValueItem[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultValues: ValueItem[] = [
    {
      icon: '🔬',
      title: 'Excellence Scientifique',
      description: 'Promouvoir la qualité et l\'excellence dans toutes nos initiatives de recherche'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'Encourager la coopération entre chercheurs, institutions et partenaires'
    },
    {
      icon: '🌱',
      title: 'Innovation',
      description: 'Favoriser l\'innovation technologique et scientifique pour le développement'
    },
    {
      icon: '🎯',
      title: 'Impact',
      description: 'Maximiser l\'impact de la recherche sur la société et l\'économie'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('strategic-vision').subscribe({
      next: (page) => {
        this.page = page;
        this.parseContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.loadDefaultContent();
        this.isLoading = false;
      }
    });
  }

  parseContent(): void {
    if (!this.page?.content) {
      this.loadDefaultContent();
      return;
    }

    try {
      const content: StrategicVisionContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Vision Stratégique';
      this.heroSubtitle = content.heroSubtitle || 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.visionTitle = content.visionTitle || 'Vision';
      this.visionText = content.visionText || '';
      this.messageTitle = content.messageTitle || 'Le Message';
      this.messageText = content.messageText || '';
      this.valuesTitle = content.valuesTitle || 'Nos Valeurs';
      this.values = content.values || this.defaultValues;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Vision Stratégique';
    this.heroSubtitle = 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.visionTitle = 'Vision';
    this.visionText = 'L\'Agence aspire à renforcer les capacités et les compétences en recherche scientifique pour être un leader régional et une référence dans le domaine de la science et de la technologie.';
    this.messageTitle = 'Le Message';
    this.messageText = 'Soutenir l\'innovation et promouvoir la recherche scientifique au service du développement du pays et de ses industries.';
    this.valuesTitle = 'Nos Valeurs';
    this.values = this.defaultValues;
  }
}
