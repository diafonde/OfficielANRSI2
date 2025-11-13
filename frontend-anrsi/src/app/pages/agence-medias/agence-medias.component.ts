import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface MediaOverview {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface CoverageItem {
  date: string;
  title: string;
  description: string;
  mediaOutlets: { type: string; name: string }[];
}

interface MediaType {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface PressRelease {
  date: string;
  title: string;
  description: string;
  link?: string;
}

interface MediaKitItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface SocialPlatform {
  icon: string;
  name: string;
  handle: string;
  link?: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface AgenceMediasContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  mediaOverview: MediaOverview[];
  recentCoverage: CoverageItem[];
  mediaTypes: MediaType[];
  pressReleases: PressRelease[];
  mediaKit: MediaKitItem[];
  socialMedia: SocialPlatform[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-agence-medias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="medias-hero">
      <div class="container">
        <h1>{{ content?.heroTitle || 'ANRSI dans les Médias' }}</h1>
        <p>{{ content?.heroSubtitle || 'Actualités, publications et visibilité médiatique' }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading && content">
      <section class="section medias-section">
        <div class="medias-content">
          <h2>Présence Médias de l'ANRSI</h2>
          <p class="intro-text">{{ content.introText }}</p>
          
          <div class="medias-overview" *ngIf="content.mediaOverview && content.mediaOverview.length > 0">
            <div class="overview-item" *ngFor="let item of content.mediaOverview">
              <div class="overview-icon">{{ item.icon }}</div>
              <div class="overview-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <ul>
                  <li *ngFor="let listItem of item.items">{{ listItem }}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="recent-coverage" *ngIf="content.recentCoverage && content.recentCoverage.length > 0">
            <h3>Couverture Médias Récente</h3>
            <div class="coverage-timeline">
              <div class="coverage-item" *ngFor="let item of content.recentCoverage">
                <div class="coverage-date">{{ item.date }}</div>
                <div class="coverage-content">
                  <h4>{{ item.title }}</h4>
                  <p class="coverage-description">{{ item.description }}</p>
                  <div class="coverage-media" *ngIf="item.mediaOutlets && item.mediaOutlets.length > 0">
                    <div class="media-outlet" *ngFor="let outlet of item.mediaOutlets">
                      <span class="media-type">{{ outlet.type }}</span>
                      <span class="media-name">{{ outlet.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="media-types" *ngIf="content.mediaTypes && content.mediaTypes.length > 0">
            <h3>Types de Couverture Médias</h3>
            <div class="types-grid">
              <div class="type-item" *ngFor="let item of content.mediaTypes">
                <div class="type-icon">{{ item.icon }}</div>
                <div class="type-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                  <ul>
                    <li *ngFor="let listItem of item.items">{{ listItem }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="press-releases" *ngIf="content.pressReleases && content.pressReleases.length > 0">
            <h3>Communiqués de Presse</h3>
            <div class="releases-list">
              <div class="release-item" *ngFor="let release of content.pressReleases">
                <div class="release-date">{{ release.date }}</div>
                <div class="release-content">
                  <h4>{{ release.title }}</h4>
                  <p>{{ release.description }}</p>
                  <a [href]="release.link || '#'" class="release-link" *ngIf="release.link">Lire le communiqué complet</a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="media-kit" *ngIf="content.mediaKit && content.mediaKit.length > 0">
            <h3>Kit Médias</h3>
            <div class="kit-content">
              <p>L'ANRSI met à disposition des médias un kit complet pour faciliter la couverture de ses activités :</p>
              
              <div class="kit-items">
                <div class="kit-item" *ngFor="let item of content.mediaKit">
                  <div class="kit-icon">{{ item.icon }}</div>
                  <div class="kit-details">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                    <a [href]="item.link || '#'" class="kit-link" *ngIf="item.link">Voir plus</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="social-media" *ngIf="content.socialMedia && content.socialMedia.length > 0">
            <h3>Réseaux Sociaux</h3>
            <div class="social-content">
              <p>Suivez l'ANRSI sur les réseaux sociaux pour les dernières actualités et informations :</p>
              
              <div class="social-platforms">
                <div class="platform-item" *ngFor="let platform of content.socialMedia">
                  <div class="platform-icon">{{ platform.icon }}</div>
                  <div class="platform-info">
                    <h4>{{ platform.name }}</h4>
                    <p>{{ platform.handle }}</p>
                    <a [href]="platform.link || '#'" class="platform-link" *ngIf="platform.link">Suivre</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact-section" *ngIf="content.contactInfo && content.contactInfo.length > 0">
            <h3>Contact Presse</h3>
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
    .medias-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/media.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .medias-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .medias-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .medias-hero p {
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
    
    .medias-section {
      padding: var(--space-12) 0;
    }
    
    .medias-content h2 {
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
    
    .medias-overview {
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
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .overview-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .overview-content li {
      margin-bottom: var(--space-1);
      font-size: var(--text-sm);
    }
    
    .recent-coverage {
      margin: var(--space-12) 0;
    }
    
    .recent-coverage h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .coverage-timeline {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .coverage-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .coverage-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .coverage-date {
      background: var(--primary-500);
      color: white;
      padding: var(--space-3) var(--space-4);
      border-radius: 8px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 120px;
      height: fit-content;
      text-align: center;
    }
    
    .coverage-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .coverage-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .coverage-media {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .media-outlet {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-2);
      background: var(--neutral-100);
      border-radius: 4px;
      font-size: var(--text-sm);
    }
    
    .media-type {
      font-size: var(--text-sm);
    }
    
    .media-name {
      color: var(--neutral-700);
    }
    
    .media-types {
      margin: var(--space-12) 0;
    }
    
    .media-types h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .type-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .type-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .type-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .type-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .type-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .type-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .type-content li {
      margin-bottom: var(--space-1);
      font-size: var(--text-sm);
    }
    
    .press-releases {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .press-releases h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .releases-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .release-item {
      display: flex;
      gap: var(--space-6);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .release-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .release-date {
      background: var(--primary-500);
      color: white;
      padding: var(--space-2) var(--space-3);
      border-radius: 6px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 100px;
      height: fit-content;
      text-align: center;
    }
    
    .release-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .release-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .release-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--text-sm);
    }
    
    .release-link:hover {
      text-decoration: underline;
    }
    
    .media-kit {
      margin: var(--space-12) 0;
    }
    
    .media-kit h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .kit-content p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .kit-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .kit-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .kit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .kit-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .kit-details h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .kit-details p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .kit-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--text-sm);
    }
    
    .kit-link:hover {
      text-decoration: underline;
    }
    
    .social-media {
      margin: var(--space-12) 0;
    }
    
    .social-media h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .social-content p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .social-platforms {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-6);
    }
    
    .platform-item {
      text-align: center;
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .platform-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .platform-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .platform-info h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .platform-info p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      font-size: var(--text-sm);
    }
    
    .platform-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--text-sm);
    }
    
    .platform-link:hover {
      text-decoration: underline;
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
      .medias-overview {
        grid-template-columns: 1fr;
      }
      
      .coverage-item {
        flex-direction: column;
        text-align: center;
      }
      
      .coverage-date {
        align-self: center;
        min-width: auto;
      }
      
      .types-grid {
        grid-template-columns: 1fr;
      }
      
      .release-item {
        flex-direction: column;
        text-align: center;
      }
      
      .release-date {
        align-self: center;
        min-width: auto;
      }
      
      .kit-items {
        grid-template-columns: 1fr;
      }
      
      .social-platforms {
        grid-template-columns: repeat(2, 1fr);
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
export class AgenceMediasComponent implements OnInit {
  page: PageDTO | null = null;
  content: AgenceMediasContent | null = null;
  isLoading = true;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('agence-medias').subscribe({
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
    // Load default static content as fallback
    this.content = {
      heroTitle: 'ANRSI dans les Médias',
      heroSubtitle: 'Actualités, publications et visibilité médiatique',
      introText: 'L\'Agence Nationale de la Recherche Scientifique et de l\'Innovation (ANRSI) maintient une présence active dans les médias pour promouvoir la recherche scientifique, l\'innovation technologique, et les initiatives de développement en Mauritanie.',
      mediaOverview: [
        {
          icon: '📺',
          title: 'Médias Audiovisuels',
          description: 'Interviews, reportages et émissions spéciales sur les chaînes de télévision et radios nationales et internationales.',
          items: ['TVM (Télévision de Mauritanie)', 'Radio Mauritanie', 'Chaînes internationales', 'Podcasts scientifiques']
        },
        {
          icon: '📰',
          title: 'Presse Écrite',
          description: 'Articles, tribunes et publications dans les journaux nationaux et internationaux.',
          items: ['Le Calame', 'Horizons', 'Mauritanie News', 'Revues scientifiques']
        },
        {
          icon: '🌐',
          title: 'Médias Numériques',
          description: 'Présence active sur les plateformes numériques et réseaux sociaux.',
          items: ['Site web officiel', 'Réseaux sociaux', 'Newsletters', 'Webinaires']
        }
      ],
      recentCoverage: [
        {
          date: '15 Février 2024',
          title: 'Colloque International sur l\'IA dans l\'Agriculture',
          description: 'L\'ANRSI organise un colloque international sur l\'application de l\'intelligence artificielle dans l\'agriculture de précision pour la sécurité alimentaire.',
          mediaOutlets: [
            { type: '📺', name: 'TVM - Journal 20h' },
            { type: '📰', name: 'Le Calame' },
            { type: '🌐', name: 'ANRSI.mr' }
          ]
        }
      ],
      mediaTypes: [
        {
          icon: '🎤',
          title: 'Interviews et Déclarations',
          description: 'Interviews exclusives avec le Directeur Général et les experts de l\'ANRSI sur les enjeux scientifiques et technologiques.',
          items: ['Interviews télévisées', 'Déclarations officielles', 'Points de presse', 'Conférences de presse']
        },
        {
          icon: '📊',
          title: 'Reportages et Documentaires',
          description: 'Reportages approfondis sur les projets de recherche, les innovations technologiques et les initiatives de développement.',
          items: ['Reportages terrain', 'Documentaires scientifiques', 'Émissions spéciales', 'Portraits d\'experts']
        },
        {
          icon: '📝',
          title: 'Articles et Publications',
          description: 'Articles de fond, tribunes et publications dans les médias nationaux et internationaux.',
          items: ['Articles d\'opinion', 'Tribunes libres', 'Publications scientifiques', 'Communiqués de presse']
        },
        {
          icon: '🎥',
          title: 'Contenu Multimédia',
          description: 'Production de contenu vidéo, audio et interactif pour les plateformes numériques.',
          items: ['Vidéos éducatives', 'Podcasts scientifiques', 'Webinaires', 'Contenu interactif']
        }
      ],
      pressReleases: [],
      mediaKit: [
        {
          icon: '📸',
          title: 'Photos et Images',
          description: 'Banque d\'images haute résolution des installations, équipements et événements de l\'ANRSI.',
          link: '#'
        },
        {
          icon: '🎥',
          title: 'Vidéos et B-Roll',
          description: 'Vidéos de présentation, interviews et séquences B-Roll pour les reportages télévisés.',
          link: '#'
        },
        {
          icon: '📄',
          title: 'Documents et Fiches',
          description: 'Fiches techniques, présentations et documents d\'information sur les programmes et projets.',
          link: '#'
        },
        {
          icon: '👥',
          title: 'Contacts Presse',
          description: 'Liste des contacts presse et experts disponibles pour interviews et commentaires.',
          link: '#'
        }
      ],
      socialMedia: [
        { icon: '📘', name: 'Facebook', handle: '@ANRSI.Mauritanie', link: '#' },
        { icon: '🐦', name: 'Twitter', handle: '@ANRSI_MR', link: '#' },
        { icon: '💼', name: 'LinkedIn', handle: 'ANRSI Mauritanie', link: '#' },
        { icon: '📺', name: 'YouTube', handle: 'ANRSI Mauritanie', link: '#' }
      ],
      contactInfo: [
        { icon: 'fas fa-envelope', label: 'Email Presse', value: 'presse@anrsi.mr' },
        { icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' },
        { icon: 'fas fa-user', label: 'Responsable Presse', value: 'Mme Fatima Mint Ahmed' },
        { icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 16h00' }
      ]
    };
  }
}
