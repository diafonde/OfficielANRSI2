import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface OverviewItem {
  icon: string;
  title: string;
  content: { label: string; value: string }[];
}

interface ThemeItem {
  icon: string;
  title: string;
  items: string[];
}

interface Session {
  time: string;
  title: string;
  description: string;
}

interface ProgrammeDay {
  date: string;
  theme: string;
  sessions: Session[];
}

interface Speaker {
  avatar: string;
  name: string;
  title: string;
  bio: string;
}

interface RegistrationMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
  price: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ZoneHumideContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  overview: OverviewItem[];
  themes: ThemeItem[];
  programme: ProgrammeDay[];
  speakers: Speaker[];
  registrationModes: RegistrationMode[];
  processSteps: ProcessStep[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-zone-humide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="zone-humide-hero">
      <div class="container">
        <h1>{{ content?.heroTitle || 'Zone Humide' }}</h1>
        <p>{{ content?.heroSubtitle || 'Colloque International sur les Zones Humides du Sahel' }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading && content">
      <section class="section zone-humide-section">
        <div class="zone-humide-content">
          <h2>Colloque International sur les Zones Humides du Sahel</h2>
          <p class="intro-text">{{ content.introText }}</p>
          
          <div class="colloque-overview" *ngIf="content.overview && content.overview.length > 0">
            <div class="overview-item" *ngFor="let item of content.overview">
              <div class="overview-icon">{{ item.icon }}</div>
              <div class="overview-content">
                <h3>{{ item.title }}</h3>
                <p *ngFor="let contentItem of item.content"><strong>{{ contentItem.label }}</strong> {{ contentItem.value }}</p>
              </div>
            </div>
          </div>
          
          <div class="themes-section" *ngIf="content.themes && content.themes.length > 0">
            <h3>Thématiques du Colloque</h3>
            <div class="themes-grid">
              <div class="theme-item" *ngFor="let theme of content.themes">
                <div class="theme-icon">{{ theme.icon }}</div>
                <div class="theme-content">
                  <h4>{{ theme.title }}</h4>
                  <ul>
                    <li *ngFor="let item of theme.items">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="programme-section" *ngIf="content.programme && content.programme.length > 0">
            <h3>Programme du Colloque</h3>
            <div class="programme-timeline">
              <div class="programme-day" *ngFor="let day of content.programme">
                <div class="day-header">
                  <h4>{{ day.date }}</h4>
                  <span class="day-theme">{{ day.theme }}</span>
                </div>
                <div class="day-sessions">
                  <div class="session-item" *ngFor="let session of day.sessions">
                    <div class="session-time">{{ session.time }}</div>
                    <div class="session-content">
                      <h5>{{ session.title }}</h5>
                      <p>{{ session.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="speakers-section" *ngIf="content.speakers && content.speakers.length > 0">
            <h3>Conférenciers Invités</h3>
            <div class="speakers-grid">
              <div class="speaker-item" *ngFor="let speaker of content.speakers">
                <div class="speaker-avatar">{{ speaker.avatar }}</div>
                <div class="speaker-info">
                  <h4>{{ speaker.name }}</h4>
                  <p class="speaker-title">{{ speaker.title }}</p>
                  <p class="speaker-bio">{{ speaker.bio }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="registration-section" *ngIf="content.registrationModes && content.registrationModes.length > 0">
            <h3>Inscription et Participation</h3>
            <div class="registration-info">
              <div class="registration-modes">
                <div class="mode-item" *ngFor="let mode of content.registrationModes">
                  <div class="mode-icon">{{ mode.icon }}</div>
                  <div class="mode-content">
                    <h4>{{ mode.title }}</h4>
                    <p>{{ mode.description }}</p>
                    <ul>
                      <li *ngFor="let item of mode.items">{{ item }}</li>
                    </ul>
                    <div class="mode-price">{{ mode.price }}</div>
                  </div>
                </div>
              </div>
              
              <div class="registration-process" *ngIf="content.processSteps && content.processSteps.length > 0">
                <h4>Processus d'Inscription :</h4>
                <div class="process-steps">
                  <div class="process-step" *ngFor="let step of content.processSteps">
                    <div class="step-number">{{ step.number }}</div>
                    <div class="step-content">
                      <h5>{{ step.title }}</h5>
                      <p>{{ step.description }}</p>
                    </div>
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
    .zone-humide-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/zonehumide.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .zone-humide-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .zone-humide-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .zone-humide-hero p {
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
    
    .zone-humide-section {
      padding: var(--space-12) 0;
    }
    
    .zone-humide-content h2 {
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
    
    .colloque-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-12);
    }
    
    .overview-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .overview-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .overview-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .overview-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .overview-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .themes-section {
      margin: var(--space-12) 0;
    }
    
    .themes-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .themes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .theme-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .theme-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .theme-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .theme-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .theme-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .theme-content li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .programme-section {
      margin: var(--space-12) 0;
    }
    
    .programme-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .programme-timeline {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .programme-day {
      margin-bottom: var(--space-8);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .day-header {
      background: var(--primary-500);
      color: white;
      padding: var(--space-4) var(--space-6);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .day-header h4 {
      font-size: var(--text-lg);
      margin: 0;
    }
    
    .day-theme {
      font-size: var(--text-sm);
      opacity: 0.9;
    }
    
    .day-sessions {
      padding: var(--space-6);
    }
    
    .session-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      padding: var(--space-4);
      background: var(--neutral-50);
      border-radius: 8px;
    }
    
    .session-time {
      background: var(--primary-100);
      color: var(--primary-700);
      padding: var(--space-2) var(--space-3);
      border-radius: 6px;
      font-weight: 600;
      font-size: var(--text-sm);
      min-width: 100px;
      text-align: center;
    }
    
    .session-content h5 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-base);
    }
    
    .session-content p {
      color: var(--neutral-700);
      font-size: var(--text-sm);
      line-height: 1.5;
    }
    
    .speakers-section {
      margin: var(--space-12) 0;
    }
    
    .speakers-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .speakers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .speaker-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .speaker-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .speaker-avatar {
      font-size: 3rem;
      flex-shrink: 0;
    }
    
    .speaker-info h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-lg);
    }
    
    .speaker-title {
      color: var(--primary-500);
      font-weight: 600;
      margin-bottom: var(--space-2);
      font-size: var(--text-sm);
    }
    
    .speaker-bio {
      color: var(--neutral-700);
      line-height: 1.5;
      font-size: var(--text-sm);
    }
    
    .registration-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .registration-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .registration-modes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }
    
    .mode-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    .mode-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .mode-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .mode-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .mode-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
      text-align: left;
      margin-bottom: var(--space-4);
    }
    
    .mode-content li {
      margin-bottom: var(--space-1);
      font-size: var(--text-sm);
    }
    
    .mode-price {
      background: var(--primary-500);
      color: white;
      padding: var(--space-2) var(--space-4);
      border-radius: 20px;
      font-weight: bold;
      font-size: var(--text-sm);
    }
    
    .registration-process h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-lg);
    }
    
    .process-steps {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .process-step {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-4);
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .step-number {
      background: var(--primary-500);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: var(--text-sm);
      flex-shrink: 0;
    }
    
    .step-content h5 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-base);
    }
    
    .step-content p {
      color: var(--neutral-700);
      font-size: var(--text-sm);
      line-height: 1.5;
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
      .colloque-overview {
        grid-template-columns: 1fr;
      }
      
      .themes-grid {
        grid-template-columns: 1fr;
      }
      
      .speakers-grid {
        grid-template-columns: 1fr;
      }
      
      .registration-modes {
        grid-template-columns: 1fr;
      }
      
      .day-header {
        flex-direction: column;
        gap: var(--space-2);
        text-align: center;
      }
      
      .session-item {
        flex-direction: column;
        text-align: center;
      }
      
      .session-time {
        align-self: center;
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
export class ZoneHumideComponent implements OnInit {
  page: PageDTO | null = null;
  content: ZoneHumideContent | null = null;
  isLoading = true;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('zone-humide').subscribe({
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
      heroTitle: 'Zone Humide',
      heroSubtitle: 'Colloque International sur les Zones Humides du Sahel',
      introText: 'L\'ANRSI organise un colloque international majeur sur la préservation et la gestion durable des zones humides du Sahel, réunissant experts, chercheurs et décideurs pour échanger sur les enjeux environnementaux et climatiques.',
      overview: [
        {
          icon: '📅',
          title: 'Dates et Lieu',
          content: [
            { label: 'Date :', value: '15-17 Mars 2024' },
            { label: 'Lieu :', value: 'Centre International de Conférences, Nouakchott' },
            { label: 'Format :', value: 'Présentiel et en ligne' }
          ]
        },
        {
          icon: '👥',
          title: 'Participants Attendus',
          content: [
            { label: 'Experts internationaux :', value: '50+ spécialistes' },
            { label: 'Chercheurs :', value: '100+ scientifiques' },
            { label: 'Décideurs :', value: 'Ministres et responsables' },
            { label: 'ONG et OSC :', value: 'Organisations de la société civile' }
          ]
        },
        {
          icon: '🌍',
          title: 'Pays Participants',
          content: [
            { label: 'Afrique de l\'Ouest :', value: 'Sénégal, Mali, Niger, Burkina Faso' },
            { label: 'Afrique du Nord :', value: 'Maroc, Algérie, Tunisie' },
            { label: 'Europe :', value: 'France, Belgique, Espagne' },
            { label: 'Organisations :', value: 'UICN, Ramsar, PNUE' }
          ]
        }
      ],
      themes: [
        {
          icon: '💧',
          title: 'Gestion des Ressources Hydriques',
          items: ['Conservation des zones humides', 'Gestion intégrée des bassins versants', 'Technologies de traitement de l\'eau', 'Économie de l\'eau']
        },
        {
          icon: '🌱',
          title: 'Biodiversité et Écosystèmes',
          items: ['Protection de la faune et flore', 'Restauration écologique', 'Services écosystémiques', 'Corridors écologiques']
        },
        {
          icon: '🌡️',
          title: 'Changement Climatique',
          items: ['Adaptation aux changements climatiques', 'Atténuation des effets', 'Modélisation climatique', 'Stratégies de résilience']
        },
        {
          icon: '👨‍🌾',
          title: 'Développement Durable',
          items: ['Agriculture durable', 'Pêche responsable', 'Écotourisme', 'Économie verte']
        },
        {
          icon: '🏛️',
          title: 'Gouvernance et Politiques',
          items: ['Cadres législatifs', 'Politiques publiques', 'Participation communautaire', 'Coopération internationale']
        },
        {
          icon: '🔬',
          title: 'Recherche et Innovation',
          items: ['Technologies de monitoring', 'Innovation environnementale', 'Transfert de connaissances', 'Formation et éducation']
        }
      ],
      programme: [],
      speakers: [],
      registrationModes: [
        {
          icon: '🏢',
          title: 'Participation Présentielle',
          description: 'Accès complet au colloque avec hébergement et restauration inclus.',
          items: ['Accès à toutes les sessions', 'Matériel de conférence', 'Pause-café et déjeuners', 'Certificat de participation'],
          price: 'Gratuit'
        },
        {
          icon: '💻',
          title: 'Participation en Ligne',
          description: 'Suivi du colloque en direct via plateforme numérique.',
          items: ['Diffusion en direct', 'Interaction avec les speakers', 'Accès aux présentations', 'Certificat numérique'],
          price: 'Gratuit'
        }
      ],
      processSteps: [
        { number: 1, title: 'Formulaire d\'Inscription', description: 'Remplir le formulaire en ligne avec vos informations personnelles et professionnelles.' },
        { number: 2, title: 'Validation', description: 'Validation de votre inscription par l\'équipe organisatrice sous 48h.' },
        { number: 3, title: 'Confirmation', description: 'Réception de votre confirmation d\'inscription avec les détails pratiques.' }
      ],
      contactInfo: [
        { icon: 'fas fa-envelope', label: 'Email', value: 'zonehumide@anrsi.mr' },
        { icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' },
        { icon: 'fas fa-map-marker-alt', label: 'Lieu', value: 'Centre International de Conférences, Nouakchott' },
        { icon: 'fas fa-calendar', label: 'Date Limite', value: '28 Février 2024' }
      ]
    };
  }
}
