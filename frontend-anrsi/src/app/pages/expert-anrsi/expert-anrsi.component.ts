import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface RequirementItem {
  icon: string;
  title: string;
  items: string[];
}

interface DomainItem {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ExpertAnrsiContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  requirements: RequirementItem[];
  domains: DomainItem[];
  processSteps: ProcessStep[];
  benefits: BenefitItem[];
  applicationText: string;
  contactInfo: ContactItem[];
  requiredDocuments: string[];
}

@Component({
  selector: 'app-expert-anrsi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="expert-hero">
      <div class="container">
        <h1>{{ content?.heroTitle || 'Expert à l\'ANRSI' }}</h1>
        <p>{{ content?.heroSubtitle || 'Rejoignez notre réseau d\'experts scientifiques et technologiques' }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading && content">
      <section class="section expert-section">
        <div class="expert-content">
          <h2>Devenir Expert ANRSI</h2>
          <p class="intro-text">{{ content.introText }}</p>
          
          <div class="expert-requirements" *ngIf="content.requirements && content.requirements.length > 0">
            <h3>Profil Requis</h3>
            <div class="requirements-grid">
              <div class="requirement-item" *ngFor="let requirement of content.requirements">
                <div class="requirement-icon">{{ requirement.icon }}</div>
                <h4>{{ requirement.title }}</h4>
                <ul>
                  <li *ngFor="let item of requirement.items">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="expert-domains" *ngIf="content.domains && content.domains.length > 0">
            <h3>Domaines d'Expertise Recherchés</h3>
            <div class="domains-grid">
              <div class="domain-item" *ngFor="let domain of content.domains">
                <h4>{{ domain.icon }} {{ domain.title }}</h4>
                <p>{{ domain.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="expert-process" *ngIf="content.processSteps && content.processSteps.length > 0">
            <h3>Processus de Recrutement</h3>
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
          
          <div class="expert-benefits" *ngIf="content.benefits && content.benefits.length > 0">
            <h3>Avantages d'être Expert ANRSI</h3>
            <div class="benefits-list">
              <div class="benefit-item" *ngFor="let benefit of content.benefits">
                <div class="benefit-icon">{{ benefit.icon }}</div>
                <div class="benefit-content">
                  <h4>{{ benefit.title }}</h4>
                  <p>{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="application-section" *ngIf="content.applicationText">
            <h3>Comment Postuler</h3>
            <div class="application-info">
              <p>{{ content.applicationText }}</p>
              <div class="contact-info" *ngIf="content.contactInfo && content.contactInfo.length > 0">
                <div class="contact-item" *ngFor="let contact of content.contactInfo">
                  <i [class]="contact.icon"></i>
                  <span>{{ contact.value }}</span>
                </div>
              </div>
              
              <div class="required-documents" *ngIf="content.requiredDocuments && content.requiredDocuments.length > 0">
                <h4>Documents Requis :</h4>
                <ul>
                  <li *ngFor="let doc of content.requiredDocuments">{{ doc }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .expert-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/expert.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .expert-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .expert-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .expert-hero p {
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
    
    .expert-section {
      padding: var(--space-12) 0;
    }
    
    .expert-content h2 {
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
    
    .expert-requirements {
      margin: var(--space-12) 0;
    }
    
    .expert-requirements h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .requirements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .requirement-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .requirement-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .requirement-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      text-align: center;
    }
    
    .requirement-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
      text-align: center;
    }
    
    .requirement-item ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .requirement-item li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .expert-domains {
      margin: var(--space-12) 0;
    }
    
    .expert-domains h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .domains-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .domain-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .domain-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .domain-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .domain-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .expert-process {
      margin: var(--space-12) 0;
    }
    
    .expert-process h3 {
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
    
    .expert-benefits {
      margin: var(--space-12) 0;
    }
    
    .expert-benefits h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .benefits-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .benefit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .benefit-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .benefit-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .benefit-content p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .application-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin-top: var(--space-12);
    }
    
    .application-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .application-info p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-6);
      font-size: var(--text-lg);
    }
    
    .contact-info {
      display: flex;
      justify-content: center;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--primary-600);
      font-weight: 500;
    }
    
    .contact-item i {
      color: var(--primary-500);
    }
    
    .required-documents {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .required-documents h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
      font-size: var(--text-lg);
    }
    
    .required-documents ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .required-documents li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    @media (max-width: 768px) {
      .requirements-grid {
        grid-template-columns: 1fr;
      }
      
      .domains-grid {
        grid-template-columns: 1fr;
      }
      
      .step-item {
        flex-direction: column;
        text-align: center;
      }
      
      .step-number {
        align-self: center;
      }
      
      .benefits-list {
        grid-template-columns: 1fr;
      }
      
      .contact-info {
        flex-direction: column;
        gap: var(--space-4);
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
export class ExpertAnrsiComponent implements OnInit {
  page: PageDTO | null = null;
  content: ExpertAnrsiContent | null = null;
  isLoading = true;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('expert-anrsi').subscribe({
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
      heroTitle: 'Expert à l\'ANRSI',
      heroSubtitle: 'Rejoignez notre réseau d\'experts scientifiques et technologiques',
      introText: 'L\'Agence Nationale de la Recherche Scientifique et de l\'Innovation (ANRSI) recrute des experts qualifiés pour évaluer les projets de recherche et contribuer au développement scientifique de la Mauritanie.',
      requirements: [
        {
          icon: '🎓',
          title: 'Formation Académique',
          items: [
            'Doctorat dans un domaine scientifique ou technologique',
            'Expérience significative en recherche',
            'Publications scientifiques reconnues',
            'Maîtrise du français et/ou de l\'anglais'
          ]
        },
        {
          icon: '🔬',
          title: 'Expertise Technique',
          items: [
            'Connaissance approfondie du domaine d\'expertise',
            'Expérience en évaluation de projets',
            'Capacité d\'analyse et de synthèse',
            'Rigueur scientifique et éthique'
          ]
        },
        {
          icon: '🌍',
          title: 'Engagement',
          items: [
            'Disponibilité pour les évaluations',
            'Engagement envers le développement scientifique',
            'Respect des délais et procédures',
            'Confidentialité et impartialité'
          ]
        }
      ],
      domains: [
        { icon: '🔬', title: 'Sciences Exactes', description: 'Mathématiques, Physique, Chimie, Sciences de la Terre' },
        { icon: '🌱', title: 'Sciences de la Vie', description: 'Biologie, Agriculture, Médecine, Sciences Vétérinaires' },
        { icon: '💻', title: 'Technologies de l\'Information', description: 'Informatique, Intelligence Artificielle, Télécommunications' },
        { icon: '⚡', title: 'Sciences de l\'Ingénieur', description: 'Génie Civil, Mécanique, Électrique, Énergies Renouvelables' },
        { icon: '🌍', title: 'Sciences Sociales', description: 'Économie, Sociologie, Droit, Sciences Politiques' },
        { icon: '🌿', title: 'Sciences de l\'Environnement', description: 'Écologie, Climatologie, Gestion des Ressources Naturelles' }
      ],
      processSteps: [
        { number: 1, title: 'Candidature', description: 'Soumission du dossier de candidature avec CV détaillé, liste des publications et lettre de motivation.' },
        { number: 2, title: 'Évaluation', description: 'Examen du dossier par un comité d\'experts de l\'ANRSI selon des critères objectifs.' },
        { number: 3, title: 'Entretien', description: 'Entretien avec les candidats retenus pour évaluer leurs compétences et leur motivation.' },
        { number: 4, title: 'Formation', description: 'Formation aux procédures d\'évaluation de l\'ANRSI et aux outils utilisés.' },
        { number: 5, title: 'Intégration', description: 'Intégration dans le réseau d\'experts et attribution des premières missions d\'évaluation.' }
      ],
      benefits: [
        { icon: '💼', title: 'Rémunération', description: 'Rémunération attractive pour chaque mission d\'évaluation selon l\'expertise et la complexité.' },
        { icon: '🌐', title: 'Réseau International', description: 'Intégration dans un réseau d\'experts internationaux et opportunités de collaboration.' },
        { icon: '📚', title: 'Formation Continue', description: 'Accès à des formations et séminaires pour maintenir et développer ses compétences.' },
        { icon: '🏆', title: 'Reconnaissance', description: 'Reconnaissance officielle en tant qu\'expert scientifique et contribution au développement national.' }
      ],
      applicationText: 'Pour postuler en tant qu\'expert ANRSI, veuillez envoyer votre dossier de candidature à :',
      contactInfo: [
        { icon: 'fas fa-envelope', label: 'Email', value: 'expert@anrsi.mr' },
        { icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' }
      ],
      requiredDocuments: [
        'CV détaillé avec liste des publications',
        'Lettre de motivation',
        'Copies des diplômes et certifications',
        'Lettres de recommandation (optionnel)',
        'Liste des projets de recherche dirigés'
      ]
    };
  }
}
