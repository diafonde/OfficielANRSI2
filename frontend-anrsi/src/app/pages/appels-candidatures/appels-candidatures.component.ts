import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface AppelDetail {
  label: string;
  value: string;
}

interface AppelAction {
  text: string;
  url: string;
  type: 'primary' | 'outline';
}

interface AppelItem {
  status: 'active' | 'upcoming' | 'closed';
  title: string;
  description: string;
  details: AppelDetail[];
  actions: AppelAction[];
}

interface CategoryItem {
  icon: string;
  title: string;
  items: string[];
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface CriteriaItem {
  icon: string;
  title: string;
  description: string;
}

interface SupportService {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface AppelsCandidaturesContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  appels: AppelItem[];
  categories: CategoryItem[];
  processSteps: ProcessStep[];
  criteria: CriteriaItem[];
  supportServices: SupportService[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-appels-candidatures',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="appels-hero">
      <div class="container">
        <h1>{{ content?.heroTitle || 'Appels à Candidatures' }}</h1>
        <p>{{ content?.heroSubtitle || 'Opportunités de recherche et d\'innovation en Mauritanie' }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading && content">
      <section class="section appels-section">
        <div class="appels-content">
          <h2>Appels à Candidatures Ouverts</h2>
          <p class="intro-text">{{ content.introText }}</p>
          
          <div class="appels-timeline" *ngIf="content.appels && content.appels.length > 0">
            <div class="appel-item" *ngFor="let appel of content.appels">
              <div class="appel-status" [ngClass]="{
                'active': appel.status === 'active',
                'upcoming': appel.status === 'upcoming',
                'closed': appel.status === 'closed'
              }">
                {{ appel.status === 'active' ? 'Ouvert' : appel.status === 'upcoming' ? 'Prochainement' : 'Fermé' }}
              </div>
              <div class="appel-content">
                <h3>{{ appel.title }}</h3>
                <p class="appel-description">{{ appel.description }}</p>
                <div class="appel-details" *ngIf="appel.details && appel.details.length > 0">
                  <div class="detail-item" *ngFor="let detail of appel.details">
                    <span class="detail-label">{{ detail.label }}</span>
                    <span class="detail-value">{{ detail.value }}</span>
                  </div>
                </div>
                <div class="appel-actions" *ngIf="appel.actions && appel.actions.length > 0">
                  <a *ngFor="let action of appel.actions" [href]="action.url" [class]="'btn btn-' + action.type">{{ action.text }}</a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="appels-categories" *ngIf="content.categories && content.categories.length > 0">
            <h3>Domaines Prioritaires</h3>
            <div class="categories-grid">
              <div class="category-item" *ngFor="let category of content.categories">
                <div class="category-icon">{{ category.icon }}</div>
                <h4>{{ category.title }}</h4>
                <ul>
                  <li *ngFor="let item of category.items">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="application-process" *ngIf="content.processSteps && content.processSteps.length > 0">
            <h3>Processus de Candidature</h3>
            <div class="process-steps">
              <div class="step-item" *ngFor="let step of content.processSteps">
                <div class="step-number">{{ step.number }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="criteria-section" *ngIf="content.criteria && content.criteria.length > 0">
            <h3>Critères d'Évaluation</h3>
            <div class="criteria-grid">
              <div class="criteria-item" *ngFor="let item of content.criteria">
                <h4>{{ item.icon }} {{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="support-section" *ngIf="content.supportServices && content.supportServices.length > 0">
            <h3>Support et Accompagnement</h3>
            <div class="support-info">
              <p>L'ANRSI offre un accompagnement complet aux porteurs de projets sélectionnés :</p>
              
              <div class="support-services">
                <div class="service-item" *ngFor="let service of content.supportServices">
                  <div class="service-icon">{{ service.icon }}</div>
                  <div class="service-content">
                    <h4>{{ service.title }}</h4>
                    <p>{{ service.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact-section" *ngIf="content.contactInfo && content.contactInfo.length > 0">
            <h3>Contact et Informations</h3>
            <div class="contact-info">
              <div class="contact-item" *ngFor="let contact of content.contactInfo">
                <i [class]="contact.icon"></i>
                <div class="contact-details">
                  <h4>{{ contact.label }}</h4>
                  <p>{{ contact.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .appels-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/candidatures.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .appels-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .appels-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .appels-hero p {
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
    
    .appels-section {
      padding: var(--space-12) 0;
    }
    
    .appels-content h2 {
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
    
    .appels-timeline {
      max-width: 1000px;
      margin: 0 auto var(--space-12);
    }
    
    .appel-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .appel-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .appel-status {
      padding: var(--space-2) var(--space-4);
      border-radius: 20px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 100px;
      height: fit-content;
      text-align: center;
    }
    
    .appel-status.active {
      background: #10b981;
      color: white;
    }
    
    .appel-status.upcoming {
      background: #f59e0b;
      color: white;
    }
    
    .appel-status.closed {
      background: #6b7280;
      color: white;
    }
    
    .appel-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .appel-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .appel-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .detail-label {
      font-weight: 600;
      color: var(--primary-600);
      font-size: var(--text-sm);
    }
    
    .detail-value {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .appel-actions {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .btn {
      padding: var(--space-2) var(--space-4);
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .btn-primary {
      background: var(--primary-500);
      color: white;
    }
    
    .btn-primary:hover {
      background: var(--primary-600);
    }
    
    .btn-outline {
      background: transparent;
      color: var(--primary-500);
      border-color: var(--primary-500);
    }
    
    .btn-outline:hover {
      background: var(--primary-500);
      color: white;
    }
    
    .appels-categories {
      margin: var(--space-12) 0;
    }
    
    .appels-categories h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .category-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .category-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .category-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      text-align: center;
    }
    
    .category-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
      text-align: center;
    }
    
    .category-item ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .category-item li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .application-process {
      margin: var(--space-12) 0;
    }
    
    .application-process h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .process-steps {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .step-item {
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
    
    .step-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .step-number {
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
    
    .step-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .step-content p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .criteria-section {
      margin: var(--space-12) 0;
    }
    
    .criteria-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .criteria-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .criteria-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .criteria-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .criteria-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .criteria-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .support-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .support-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .support-info p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .support-services {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .service-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .service-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .service-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .service-content p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .contact-section {
      margin: var(--space-12) 0;
    }
    
    .contact-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .contact-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .contact-item i {
      color: var(--primary-500);
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    .contact-details h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-lg);
    }
    
    .contact-details p {
      color: var(--neutral-700);
    }
    
    @media (max-width: 768px) {
      .appel-item {
        flex-direction: column;
        text-align: center;
      }
      
      .appel-status {
        align-self: center;
        min-width: auto;
      }
      
      .appel-details {
        grid-template-columns: 1fr;
      }
      
      .categories-grid {
        grid-template-columns: 1fr;
      }
      
      .step-item {
        flex-direction: column;
        text-align: center;
      }
      
      .step-number {
        align-self: center;
      }
      
      .criteria-grid {
        grid-template-columns: 1fr;
      }
      
      .support-services {
        grid-template-columns: 1fr;
      }
      
      .contact-info {
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
export class AppelsCandidaturesComponent implements OnInit {
  page: PageDTO | null = null;
  content: AppelsCandidaturesContent | null = null;
  isLoading = true;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('appels-candidatures').subscribe({
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
      heroTitle: 'Appels à Candidatures',
      heroSubtitle: 'Opportunités de recherche et d\'innovation en Mauritanie',
      introText: 'L\'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d\'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.',
      appels: [
        {
          status: 'active',
          title: 'Appel à Projets de Recherche 2024',
          description: 'Financement de projets de recherche dans les domaines prioritaires : agriculture durable, énergies renouvelables, technologies de l\'information, et sciences de l\'environnement.',
          details: [
            { label: 'Budget :', value: 'Jusqu\'à 50 millions MRO par projet' },
            { label: 'Durée :', value: '12-36 mois' },
            { label: 'Date limite :', value: '31 Mars 2024' },
            { label: 'Éligibilité :', value: 'Institutions de recherche, universités, entreprises' }
          ],
          actions: [
            { text: 'Consulter l\'appel', url: '#', type: 'primary' },
            { text: 'Télécharger le dossier', url: '#', type: 'outline' }
          ]
        },
        {
          status: 'upcoming',
          title: 'Programme Innovation Technologique',
          description: 'Soutien aux projets d\'innovation technologique et de transfert de technologie vers l\'industrie mauritanienne.',
          details: [
            { label: 'Budget :', value: 'Jusqu\'à 30 millions MRO par projet' },
            { label: 'Durée :', value: '6-24 mois' },
            { label: 'Ouverture :', value: 'Avril 2024' },
            { label: 'Éligibilité :', value: 'Startups, PME, centres de recherche' }
          ],
          actions: [
            { text: 'S\'inscrire aux alertes', url: '#', type: 'outline' }
          ]
        },
        {
          status: 'closed',
          title: 'Bourses de Doctorat 2023',
          description: 'Programme de bourses pour soutenir les étudiants mauritaniens dans leurs études doctorales en sciences et technologies.',
          details: [
            { label: 'Montant :', value: '500,000 MRO/an pendant 3 ans' },
            { label: 'Durée :', value: '3 ans' },
            { label: 'Date limite :', value: '15 Décembre 2023' },
            { label: 'Éligibilité :', value: 'Étudiants mauritaniens en master' }
          ],
          actions: [
            { text: 'Voir les résultats', url: '#', type: 'outline' }
          ]
        }
      ],
      categories: [
        {
          icon: '🌱',
          title: 'Agriculture & Sécurité Alimentaire',
          items: ['Techniques agricoles durables', 'Amélioration des rendements', 'Gestion des ressources hydriques', 'Biotechnologies agricoles']
        },
        {
          icon: '⚡',
          title: 'Énergies Renouvelables',
          items: ['Énergie solaire et éolienne', 'Stockage d\'énergie', 'Efficacité énergétique', 'Électrification rurale']
        },
        {
          icon: '💻',
          title: 'Technologies de l\'Information',
          items: ['Intelligence artificielle', 'Internet des objets (IoT)', 'Cybersécurité', 'Applications mobiles']
        },
        {
          icon: '🌍',
          title: 'Environnement & Climat',
          items: ['Changement climatique', 'Biodiversité', 'Gestion des déchets', 'Pollution et assainissement']
        },
        {
          icon: '🏥',
          title: 'Santé & Médecine',
          items: ['Médecine préventive', 'Télémédecine', 'Pharmacologie', 'Santé publique']
        },
        {
          icon: '🏭',
          title: 'Industrie & Innovation',
          items: ['Processus industriels', 'Matériaux avancés', 'Robotique', 'Transfert de technologie']
        }
      ],
      processSteps: [
        { number: 1, title: 'Préparation du Dossier', description: 'Rédaction du projet de recherche, budget détaillé, équipe de recherche, et lettres de recommandation.' },
        { number: 2, title: 'Soumission en Ligne', description: 'Dépôt du dossier complet via la plateforme de soumission électronique de l\'ANRSI.' },
        { number: 3, title: 'Évaluation Scientifique', description: 'Examen du projet par un comité d\'experts indépendants selon des critères scientifiques rigoureux.' },
        { number: 4, title: 'Entretien', description: 'Présentation orale du projet devant le comité d\'évaluation pour les projets présélectionnés.' },
        { number: 5, title: 'Décision et Financement', description: 'Notification des résultats et signature de la convention de financement pour les projets retenus.' }
      ],
      criteria: [
        { icon: '🔬', title: 'Excellence Scientifique', description: 'Qualité scientifique du projet, innovation, méthodologie rigoureuse, et faisabilité technique.' },
        { icon: '👥', title: 'Équipe de Recherche', description: 'Compétences et expérience de l\'équipe, complémentarité des profils, et leadership du projet.' },
        { icon: '💡', title: 'Impact et Innovation', description: 'Potentiel d\'innovation, impact attendu sur le développement national, et transfert de connaissances.' },
        { icon: '💰', title: 'Gestion Financière', description: 'Budget réaliste et justifié, coût-efficacité, et capacité de gestion financière du porteur.' }
      ],
      supportServices: [
        { icon: '📋', title: 'Formation à la Gestion de Projet', description: 'Formation aux outils de gestion de projet et aux procédures administratives.' },
        { icon: '🔍', title: 'Suivi et Évaluation', description: 'Accompagnement dans le suivi du projet et l\'évaluation des résultats.' },
        { icon: '🌐', title: 'Réseau et Partenariats', description: 'Facilitation des partenariats avec des institutions nationales et internationales.' },
        { icon: '📢', title: 'Valorisation des Résultats', description: 'Support dans la publication et la valorisation des résultats de recherche.' }
      ],
      contactInfo: [
        { icon: 'fas fa-envelope', label: 'Email', value: 'appels@anrsi.mr' },
        { icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' },
        { icon: 'fas fa-map-marker-alt', label: 'Adresse', value: 'ANRSI, Nouakchott, Mauritanie' },
        { icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 16h00' }
      ]
    };
  }
}
