import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface ResearchPriority {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-priorites-recherche-2026',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="priorities-hero">
      <div class="container">
        <h1>LES PRIORITÉS DE LA RECHERCHE À L'HORIZON 2026</h1>
        <p>L'ANRSI définit les priorités de la recherche scientifique et de l'innovation pour le développement national</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section priorities-section">
        <div class="priorities-content">
          <div class="intro-text">
            <p>Se basant sur la stratégie nationale de la recherche scientifique et de l'innovation adoptée par le Gouvernement, l'Agence nationale de la recherche scientifique et de l'innovation publie les détails des sept axes de ladite stratégie.</p>
            
            <p>Ces axes sont répartis suivant les besoins de développement et en réponse aux défis actuels, pour couvrir des domaines variés allant de l'autosuffisance alimentaire à la digitalisation et les défis émergents avec l'explosion de l'intelligence artificielle, en passant par la santé, les industries extractives.</p>
            
            <p>Les recherches humaines et sociales occupent une place de choix dans ces axes, la stratégie leur ayant consacré deux axes à travers lesquels il est possible d'œuvrer pour "la valorisation des savoirs autochtones ancestraux afin d'affronter les enjeux sociétaux, de combattre la vulnérabilité, les disparités sociales et l'exclusion et de consolider l'unité nationale".</p>
          </div>
          
          <h2>{{ 'Les Sept Axes Stratégiques' | translate }}</h2>
          
          <div class="priorities-grid">
            <div class="priority-card" *ngFor="let priority of researchPriorities">
              <div class="priority-icon">
                <i [class]="priority.icon"></i>
              </div>
              <div class="priority-content">
                <h3>{{ priority.title }}</h3>
                <p>{{ priority.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="priorities-date">
            <p><strong>{{ 'Date de publication' | translate }} :</strong> 18 Janvier 2023</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .priorities-hero {
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
    
    .priorities-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .priorities-hero h1 {
      font-size: clamp(1.8rem, 4vw, 3rem);
      margin-bottom: var(--space-3);
      color: white;
      line-height: 1.2;
    }
    
    .priorities-hero p {
      font-size: clamp(1rem, 2vw, 1.3rem);
      max-width: 700px;
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
    
    .priorities-section {
      padding: var(--space-12) 0;
    }
    
    .intro-text {
      max-width: 900px;
      margin: 0 auto var(--space-8);
      text-align: center;
    }
    
    .intro-text p {
      color: var(--neutral-700);
      font-size: var(--text-lg);
      line-height: 1.6;
      margin-bottom: var(--space-4);
    }
    
    .priorities-content h2 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-3xl);
    }
    
    .priorities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }
    
    .priority-card {
      background: white;
      border-radius: 12px;
      padding: var(--space-6);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-left: 4px solid var(--primary-500);
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
    }
    
    .priority-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .priority-icon {
      background: var(--primary-50);
      color: var(--primary-600);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 1.5rem;
    }
    
    .priority-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
      font-weight: 600;
    }
    
    .priority-content p {
      color: var(--neutral-700);
      line-height: 1.5;
      font-size: var(--text-sm);
    }
    
    .priorities-date {
      text-align: center;
      padding: var(--space-4);
      background: var(--neutral-100);
      border-radius: 8px;
      color: var(--neutral-600);
    }
    
    @media (max-width: 768px) {
      .priorities-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }
      
      .priority-card {
        flex-direction: column;
        text-align: center;
        padding: var(--space-4);
      }
      
      .priority-icon {
        align-self: center;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
      }
      
      .priority-content h3 {
        font-size: var(--text-base);
      }
      
      .priority-content p {
        font-size: var(--text-xs);
      }
      
      .intro-text p {
        font-size: var(--text-base);
      }
    }
    
    @media (max-width: 480px) {
      .priorities-grid {
        grid-template-columns: 1fr;
      }
      
      .priority-card {
        padding: var(--space-3);
      }
      
      .priority-icon {
        width: 45px;
        height: 45px;
        font-size: 1rem;
      }
    }
  `]
})
export class PrioritesRecherche2026Component {
  researchPriorities: ResearchPriority[] = [
    {
      id: 1,
      title: "Autosuffisance Alimentaire",
      description: "Développement de stratégies pour assurer la sécurité alimentaire nationale et réduire la dépendance aux importations.",
      icon: "fas fa-seedling"
    },
    {
      id: 2,
      title: "Digitalisation et Intelligence Artificielle",
      description: "Intégration des technologies numériques et de l'IA pour moderniser les secteurs économiques et améliorer l'efficacité.",
      icon: "fas fa-robot"
    },
    {
      id: 3,
      title: "Santé et Bien-être",
      description: "Amélioration des systèmes de santé, prévention des maladies et promotion du bien-être de la population.",
      icon: "fas fa-heartbeat"
    },
    {
      id: 4,
      title: "Industries Extractives",
      description: "Optimisation de l'exploitation des ressources naturelles de manière durable et responsable.",
      icon: "fas fa-mountain"
    },
    {
      id: 5,
      title: "Recherches Humaines et Sociales I",
      description: "Valorisation des savoirs autochtones ancestraux pour affronter les enjeux sociétaux contemporains.",
      icon: "fas fa-users"
    },
    {
      id: 6,
      title: "Recherches Humaines et Sociales II",
      description: "Combattre la vulnérabilité, les disparités sociales et l'exclusion pour consolider l'unité nationale.",
      icon: "fas fa-hands-helping"
    },
    {
      id: 7,
      title: "Développement Durable",
      description: "Promotion de pratiques respectueuses de l'environnement et du développement durable à long terme.",
      icon: "fas fa-leaf"
    }
  ];
}
