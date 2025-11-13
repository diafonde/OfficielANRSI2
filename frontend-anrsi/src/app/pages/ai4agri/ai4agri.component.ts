import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface WorkshopItem {
  date: string;
  title: string;
  description: string;
  detailsTitle?: string;
  detailsItems: string[];
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface PartnershipHighlight {
  icon: string;
  title: string;
  description: string;
}

interface Ai4agriContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  workshops: WorkshopItem[];
  benefits: BenefitItem[];
  partnershipText: string;
  partnershipHighlights: PartnershipHighlight[];
}

@Component({
  selector: 'app-ai4agri',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai4agri-hero">
      <div class="container">
        <h1>{{ content?.heroTitle || 'AI 4 AGRI' }}</h1>
        <p>{{ content?.heroSubtitle || 'Intelligence Artificielle pour l\'Agriculture de Précision' }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading && content">
      <section class="section ai4agri-section">
        <div class="ai4agri-content">
          <h2>Ateliers Internationaux sur l'IA dans l'Agriculture</h2>
          <p class="intro-text">{{ content.introText }}</p>
          
          <div class="workshops-timeline" *ngIf="content.workshops && content.workshops.length > 0">
            <div class="workshop-item" *ngFor="let workshop of content.workshops">
              <div class="workshop-date">{{ workshop.date }}</div>
              <div class="workshop-content">
                <h3>{{ workshop.title }}</h3>
                <p>{{ workshop.description }}</p>
                <div class="workshop-details" *ngIf="workshop.detailsItems && workshop.detailsItems.length > 0">
                  <h4 *ngIf="workshop.detailsTitle">{{ workshop.detailsTitle }}</h4>
                  <ul>
                    <li *ngFor="let item of workshop.detailsItems">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ai-benefits" *ngIf="content.benefits && content.benefits.length > 0">
            <h3>Bénéfices de l'IA dans l'Agriculture</h3>
            <div class="benefits-grid">
              <div class="benefit-item" *ngFor="let benefit of content.benefits">
                <div class="benefit-icon">{{ benefit.icon }}</div>
                <h4>{{ benefit.title }}</h4>
                <p>{{ benefit.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="partnership-section" *ngIf="content.partnershipHighlights && content.partnershipHighlights.length > 0">
            <h3>Partenariats et Collaboration</h3>
            <p>{{ content.partnershipText }}</p>
            
            <div class="partnership-highlights">
              <div class="highlight-item" *ngFor="let highlight of content.partnershipHighlights">
                <h4>{{ highlight.icon }} {{ highlight.title }}</h4>
                <p>{{ highlight.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .ai4agri-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/aiagri.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .ai4agri-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .ai4agri-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .ai4agri-hero p {
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
    
    .ai4agri-section {
      padding: var(--space-12) 0;
    }
    
    .ai4agri-content h2 {
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
    
    .workshops-timeline {
      max-width: 900px;
      margin: 0 auto var(--space-12);
    }
    
    .workshop-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .workshop-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .workshop-date {
      background: var(--primary-500);
      color: white;
      padding: var(--space-4);
      border-radius: 8px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 120px;
      height: fit-content;
      text-align: center;
    }
    
    .workshop-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .workshop-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .workshop-details h4 {
      color: var(--primary-500);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .workshop-details ul {
      color: var(--neutral-600);
      padding-left: var(--space-4);
    }
    
    .workshop-details li {
      margin-bottom: var(--space-1);
    }
    
    .ai-benefits {
      margin: var(--space-12) 0;
    }
    
    .ai-benefits h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .benefit-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .benefit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .benefit-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .benefit-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .benefit-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .partnership-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin-top: var(--space-12);
    }
    
    .partnership-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .partnership-section p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .partnership-highlights {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .highlight-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .highlight-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .highlight-item p {
      color: var(--neutral-700);
      line-height: 1.6;
      text-align: left;
    }
    
    @media (max-width: 768px) {
      .workshop-item {
        flex-direction: column;
        text-align: center;
      }
      
      .workshop-date {
        align-self: center;
        min-width: auto;
      }
      
      .benefits-grid {
        grid-template-columns: 1fr;
      }
      
      .partnership-highlights {
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
export class Ai4agriComponent implements OnInit {
  page: PageDTO | null = null;
  content: Ai4agriContent | null = null;
  isLoading = true;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('ai4agri').subscribe({
      next: (page) => {
        this.page = page;
        if (page.content) {
          try {
            this.content = JSON.parse(page.content);
          } catch (e) {
            console.error('Error parsing content:', e);
            this.loadDefaultContent();
          }
        } else {
          this.loadDefaultContent();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.loadDefaultContent();
        this.isLoading = false;
      }
    });
  }

  loadDefaultContent(): void {
    this.content = {
      heroTitle: 'AI 4 AGRI',
      heroSubtitle: 'Intelligence Artificielle pour l\'Agriculture de Précision',
      introText: 'L\'ANRSI organise des ateliers internationaux sur l\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire.',
      workshops: [
        {
          date: '13-15 Février 2024',
          title: 'Ouverture de l\'atelier international sur les applications de l\'IA dans l\'agriculture',
          description: 'Atelier International sur "L\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire"',
          detailsTitle: 'Programme AI 4 AGRI 13-15 Février 2024',
          detailsItems: [
            'Présentations sur l\'IA agricole',
            'Échantillons de présentations',
            'Démonstrations pratiques',
            'Réseautage et collaboration'
          ]
        },
        {
          date: 'Février 2024',
          title: 'AI 4 Agri - Initiative Continue',
          description: 'Programme continu de développement et d\'application de l\'IA dans le secteur agricole mauritanien.',
          detailsTitle: 'Objectifs du Programme',
          detailsItems: [
            'Moderniser l\'agriculture grâce à l\'IA',
            'Améliorer la productivité agricole',
            'Renforcer la sécurité alimentaire',
            'Former les agriculteurs aux nouvelles technologies'
          ]
        }
      ],
      benefits: [
        { icon: '🌱', title: 'Agriculture de Précision', description: 'Optimisation des ressources et augmentation des rendements grâce à l\'analyse de données précises.' },
        { icon: '📊', title: 'Analyse Prédictive', description: 'Prédiction des conditions météorologiques et des maladies pour une meilleure planification.' },
        { icon: '🤖', title: 'Automatisation', description: 'Robotisation des tâches agricoles pour améliorer l\'efficacité et réduire les coûts.' },
        { icon: '🌍', title: 'Développement Durable', description: 'Promotion d\'une agriculture respectueuse de l\'environnement et durable.' }
      ],
      partnershipText: 'L\'ANRSI collabore avec des institutions internationales et des experts en IA pour développer des solutions innovantes pour l\'agriculture mauritanienne.',
      partnershipHighlights: [
        { icon: '🔬', title: 'Recherche et Développement', description: 'Collaboration avec des centres de recherche internationaux spécialisés en IA agricole.' },
        { icon: '🎓', title: 'Formation et Éducation', description: 'Programmes de formation pour les agriculteurs et les professionnels du secteur.' },
        { icon: '🤝', title: 'Coopération Internationale', description: 'Échange d\'expertise et de technologies avec des partenaires internationaux.' }
      ]
    };
  }
}
