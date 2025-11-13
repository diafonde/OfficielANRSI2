import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface Position {
  icon: string;
  title: string;
  description: string;
  isDirector?: boolean;
}

interface Level {
  levelNumber: number;
  positions: Position[];
}

interface Responsibility {
  icon: string;
  title: string;
  description: string;
}

interface OrganigrammeContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  levels: Level[];
  responsibilitiesTitle: string;
  responsibilities: Responsibility[];
}

@Component({
  selector: 'app-organigramme',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="organigramme-hero">
      <div class="container">
        <h1>{{ heroTitle || 'Organigramme' }}</h1>
        <p>{{ heroSubtitle || "Structure organisationnelle de l'Agence Nationale de la Recherche Scientifique et de l'Innovation" }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading">
      <section class="section organigramme-section">
        <div class="organigramme-content">
          <h2>{{ sectionTitle || 'Structure Organisationnelle' }}</h2>
          <p class="intro-text" *ngIf="introText">
            {{ introText }}
          </p>
          
          <div class="organigramme-chart" *ngIf="levels && levels.length > 0">
            <div class="level" [class]="'level-' + level.levelNumber" *ngFor="let level of levels">
              <div class="position-card" [class.director]="position.isDirector" *ngFor="let position of level.positions">
                <div class="position-icon">{{ position.icon }}</div>
                <h3>{{ position.title }}</h3>
                <p>{{ position.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="organigramme-info" *ngIf="responsibilities && responsibilities.length > 0">
            <h3>{{ responsibilitiesTitle || 'Responsabilités Clés' }}</h3>
            <div class="responsibilities-grid">
              <div class="responsibility-item" *ngFor="let responsibility of responsibilities">
                <h4>{{ responsibility.icon }} {{ responsibility.title }}</h4>
                <p>{{ responsibility.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .organigramme-hero {
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
    
    .organigramme-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .organigramme-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .organigramme-hero p {
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
    
    .organigramme-section {
      padding: var(--space-12) 0;
    }
    
    .organigramme-content h2 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-3xl);
    }
    
    .intro-text {
      text-align: center;
      color: var(--neutral-700);
      font-size: var(--text-lg);
      max-width: 800px;
      margin: 0 auto var(--space-12);
      line-height: 1.6;
    }
    
    .organigramme-chart {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .level {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: var(--space-8);
      flex-wrap: wrap;
      gap: var(--space-4);
    }
    
    .level-1 {
      margin-bottom: var(--space-12);
    }
    
    .level-2 {
      margin-bottom: var(--space-10);
    }
    
    .level-3 {
      margin-bottom: var(--space-8);
    }
    
    .position-card {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      min-width: 200px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .position-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .position-card.director {
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      border: 2px solid var(--primary-200);
    }
    
    .position-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-3);
    }
    
    .position-card h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .position-card p {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .organigramme-info {
      margin-top: var(--space-12);
      padding: var(--space-8);
      background: var(--neutral-50);
      border-radius: 16px;
    }
    
    .organigramme-info h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .responsibilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .responsibility-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .responsibility-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    .responsibility-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .responsibility-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .level {
        flex-direction: column;
        align-items: center;
      }
      
      .position-card {
        min-width: 100%;
        max-width: 300px;
      }
      
      .responsibilities-grid {
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
export class OrganigrammeComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  introText: string = '';
  levels: Level[] = [];
  responsibilitiesTitle: string = '';
  responsibilities: Responsibility[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultLevels: Level[] = [
    {
      levelNumber: 1,
      positions: [{
        icon: '👑',
        title: 'Haut Conseil de la Recherche Scientifique et de l\'Innovation',
        description: 'Présidé par Son Excellence le Premier Ministre',
        isDirector: true
      }]
    },
    {
      levelNumber: 2,
      positions: [{
        icon: '👔',
        title: 'Direction Générale',
        description: 'Directeur Général de l\'ANRSI',
        isDirector: true
      }]
    },
    {
      levelNumber: 3,
      positions: [
        {
          icon: '🔬',
          title: 'Direction de la Recherche',
          description: 'Gestion des programmes de recherche',
          isDirector: false
        },
        {
          icon: '💡',
          title: 'Direction de l\'Innovation',
          description: 'Promotion de l\'innovation technologique',
          isDirector: false
        },
        {
          icon: '💰',
          title: 'Direction Financière',
          description: 'Gestion des fonds et budgets',
          isDirector: false
        }
      ]
    },
    {
      levelNumber: 4,
      positions: [
        {
          icon: '📊',
          title: 'Service d\'Évaluation',
          description: 'Suivi et évaluation des projets',
          isDirector: false
        },
        {
          icon: '🤝',
          title: 'Service de Coopération',
          description: 'Partenariats internationaux',
          isDirector: false
        },
        {
          icon: '📋',
          title: 'Service Administratif',
          description: 'Gestion administrative',
          isDirector: false
        },
        {
          icon: '💻',
          title: 'Service Informatique',
          description: 'Support technique et numérique',
          isDirector: false
        }
      ]
    }
  ];
  
  defaultResponsibilities: Responsibility[] = [
    {
      icon: '🎯',
      title: 'Définition des Priorités',
      description: 'Le Haut Conseil définit les priorités nationales de recherche et d\'innovation'
    },
    {
      icon: '📝',
      title: 'Appels à Projets',
      description: 'L\'ANRSI lance des appels à projets selon les priorités définies'
    },
    {
      icon: '💼',
      title: 'Gestion des Fonds',
      description: 'Allocation transparente et efficace des fonds de recherche'
    },
    {
      icon: '📈',
      title: 'Suivi et Évaluation',
      description: 'Monitoring continu des projets financés et évaluation de leur impact'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('organigramme').subscribe({
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
      const content: OrganigrammeContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Organigramme';
      this.heroSubtitle = content.heroSubtitle || 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.sectionTitle = content.sectionTitle || 'Structure Organisationnelle';
      this.introText = content.introText || '';
      this.levels = content.levels || this.defaultLevels;
      this.responsibilitiesTitle = content.responsibilitiesTitle || 'Responsabilités Clés';
      this.responsibilities = content.responsibilities || this.defaultResponsibilities;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Organigramme';
    this.heroSubtitle = 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.sectionTitle = 'Structure Organisationnelle';
    this.introText = 'L\'ANRSI est structurée de manière hiérarchique pour assurer une gestion efficace de la recherche scientifique et de l\'innovation en Mauritanie.';
    this.levels = this.defaultLevels;
    this.responsibilitiesTitle = 'Responsabilités Clés';
    this.responsibilities = this.defaultResponsibilities;
  }
}
