import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface ObjectiveItem {
  number: number;
  title: string;
  description: string;
}

interface ObjectivesContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  objectives: ObjectiveItem[];
}

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="objectives-hero">
      <div class="container">
        <h1>{{ heroTitle || 'Objectifs' }}</h1>
        <p>{{ heroSubtitle || "Les objectifs stratégiques de l'Agence Nationale de la Recherche Scientifique et de l'Innovation" }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading">
      <section class="section objectives-section">
        <div class="objectives-content">
          <h2>{{ sectionTitle || 'Nos Objectifs' }}</h2>
          <div class="objectives-list" *ngIf="objectives && objectives.length > 0">
            <div class="objective-item" *ngFor="let objective of objectives">
              <div class="objective-number">{{ objective.number }}</div>
              <div class="objective-text">
                <h3>{{ objective.title }}</h3>
                <p>{{ objective.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .objectives-hero {
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
    
    .objectives-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .objectives-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .objectives-hero p {
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
    
    .objectives-section {
      padding: var(--space-12) 0;
    }
    
    .objectives-content h2 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-3xl);
    }
    
    .objectives-list {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .objective-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .objective-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .objective-number {
      background: var(--primary-500);
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: var(--text-lg);
      flex-shrink: 0;
    }
    
    .objective-text h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .objective-text p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .objective-item {
        flex-direction: column;
        text-align: center;
        gap: var(--space-4);
      }
      
      .objective-number {
        align-self: center;
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
export class ObjectivesComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  objectives: ObjectiveItem[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultObjectives: ObjectiveItem[] = [
    {
      number: 1,
      title: 'Accroître la production scientifique Nationale',
      description: 'L\'ANRSI vise à stimuler et augmenter significativement la production scientifique nationale en soutenant les chercheurs et les institutions de recherche.'
    },
    {
      number: 2,
      title: 'Améliorer l\'excellence et le rayonnement de la recherche scientifique en Mauritanie',
      description: 'Nous nous engageons à promouvoir l\'excellence dans la recherche scientifique et à renforcer le rayonnement international de la recherche mauritanienne.'
    },
    {
      number: 3,
      title: 'Améliorer l\'impact de la recherche et l\'innovation sur l\'économie, la société et le développement durable',
      description: 'L\'ANRSI travaille à maximiser l\'impact de la recherche et de l\'innovation sur le développement économique, social et durable de la Mauritanie.'
    },
    {
      number: 4,
      title: 'Accroître la capacité d\'innovation et de création de richesses de notre pays par et grâce à la recherche',
      description: 'Nous visons à renforcer les capacités d\'innovation nationales et à favoriser la création de richesses grâce aux résultats de la recherche scientifique.'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('objectives').subscribe({
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
      const content: ObjectivesContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Objectifs';
      this.heroSubtitle = content.heroSubtitle || 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.sectionTitle = content.sectionTitle || 'Nos Objectifs';
      this.objectives = content.objectives || this.defaultObjectives;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Objectifs';
    this.heroSubtitle = 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.sectionTitle = 'Nos Objectifs';
    this.objectives = this.defaultObjectives;
  }
}
