import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface PlateformeItem {
  icon: string;
  title: string;
  description: string;
  equipments: string[];
  services: string[];
  contact: string;
}

interface AccessMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface BookingStep {
  number: number;
  title: string;
  description: string;
}

interface SupportItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface PlateformesContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  plateformes: PlateformeItem[];
  accessModes: AccessMode[];
  bookingSteps: BookingStep[];
  bookingRequirements: string[];
  supportItems: SupportItem[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-plateformes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plateformes-hero">
      <div class="container">
        <h1>{{ content?.heroTitle || 'Plateformes' }}</h1>
        <p>{{ content?.heroSubtitle || 'Outils et technologies pour la recherche et l\'innovation' }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container" *ngIf="isLoading">
      <div class="loading-container">
        <div class="loading">Loading...</div>
      </div>
    </div>
    
    <div class="container" *ngIf="!isLoading && content">
      <section class="section plateformes-section">
        <div class="plateformes-content">
          <h2>Plateformes Technologiques ANRSI</h2>
          <p class="intro-text">{{ content.introText }}</p>
          
          <div class="plateformes-grid" *ngIf="content.plateformes && content.plateformes.length > 0">
            <div class="plateforme-item" *ngFor="let plateforme of content.plateformes">
              <div class="plateforme-icon">{{ plateforme.icon }}</div>
              <div class="plateforme-content">
                <h3>{{ plateforme.title }}</h3>
                <p class="plateforme-description">{{ plateforme.description }}</p>
                <div class="plateforme-equipments" *ngIf="plateforme.equipments && plateforme.equipments.length > 0">
                  <h4>Équipements :</h4>
                  <ul>
                    <li *ngFor="let equipment of plateforme.equipments">{{ equipment }}</li>
                  </ul>
                </div>
                <div class="plateforme-services" *ngIf="plateforme.services && plateforme.services.length > 0">
                  <h4>Services :</h4>
                  <ul>
                    <li *ngFor="let service of plateforme.services">{{ service }}</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">{{ plateforme.contact }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="access-section" *ngIf="content.accessModes && content.accessModes.length > 0">
            <h3>Accès aux Plateformes</h3>
            <div class="access-info">
              <p>Les plateformes ANRSI sont accessibles aux chercheurs, étudiants, et entreprises mauritaniennes selon des modalités spécifiques :</p>
              
              <div class="access-modes">
                <div class="access-mode" *ngFor="let mode of content.accessModes">
                  <div class="mode-icon">{{ mode.icon }}</div>
                  <div class="mode-content">
                    <h4>{{ mode.title }}</h4>
                    <p>{{ mode.description }}</p>
                    <ul>
                      <li *ngFor="let item of mode.items">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="booking-section" *ngIf="content.bookingSteps && content.bookingSteps.length > 0">
            <h3>Réservation et Utilisation</h3>
            <div class="booking-process">
              <div class="booking-steps">
                <div class="booking-step" *ngFor="let step of content.bookingSteps">
                  <div class="step-number">{{ step.number }}</div>
                  <div class="step-content">
                    <h4>{{ step.title }}</h4>
                    <p>{{ step.description }}</p>
                  </div>
                </div>
              </div>
              
              <div class="booking-requirements" *ngIf="content.bookingRequirements && content.bookingRequirements.length > 0">
                <h4>Exigences pour l'Accès :</h4>
                <ul>
                  <li *ngFor="let requirement of content.bookingRequirements">{{ requirement }}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="support-section" *ngIf="content.supportItems && content.supportItems.length > 0">
            <h3>Support et Formation</h3>
            <div class="support-services">
              <div class="support-item" *ngFor="let item of content.supportItems">
                <div class="support-icon">{{ item.icon }}</div>
                <div class="support-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
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
    .plateformes-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/plateforme.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .plateformes-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .plateformes-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .plateformes-hero p {
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
    
    .plateformes-section {
      padding: var(--space-12) 0;
    }
    
    .plateformes-content h2 {
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
    
    .plateformes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-12);
    }
    
    .plateforme-item {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .plateforme-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    }
    
    .plateforme-icon {
      background: var(--primary-500);
      color: white;
      font-size: 3rem;
      text-align: center;
      padding: var(--space-6);
    }
    
    .plateforme-content {
      padding: var(--space-6);
    }
    
    .plateforme-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .plateforme-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .plateforme-equipments,
    .plateforme-services {
      margin-bottom: var(--space-4);
    }
    
    .plateforme-equipments h4,
    .plateforme-services h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-base);
    }
    
    .plateforme-equipments ul,
    .plateforme-services ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
      font-size: var(--text-sm);
    }
    
    .plateforme-equipments li,
    .plateforme-services li {
      margin-bottom: var(--space-1);
    }
    
    .plateforme-contact {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    .contact-label {
      font-weight: 600;
      color: var(--primary-600);
      font-size: var(--text-sm);
    }
    
    .contact-value {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .access-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .access-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .access-info p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .access-modes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .access-mode {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .mode-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .mode-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .mode-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .mode-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
      font-size: var(--text-sm);
    }
    
    .mode-content li {
      margin-bottom: var(--space-1);
    }
    
    .booking-section {
      margin: var(--space-12) 0;
    }
    
    .booking-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .booking-process {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-8);
    }
    
    .booking-steps {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .booking-step {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .step-number {
      background: var(--primary-500);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: var(--text-base);
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
    
    .booking-requirements {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }
    
    .booking-requirements h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
      font-size: var(--text-lg);
    }
    
    .booking-requirements ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .booking-requirements li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .support-section {
      margin: var(--space-12) 0;
    }
    
    .support-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .support-services {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .support-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .support-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .support-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .support-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .support-content p {
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
      .plateformes-grid {
        grid-template-columns: 1fr;
      }
      
      .access-modes {
        grid-template-columns: 1fr;
      }
      
      .booking-process {
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
export class PlateformesComponent implements OnInit {
  page: PageDTO | null = null;
  content: PlateformesContent | null = null;
  isLoading = true;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('plateformes').subscribe({
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
      heroTitle: 'Plateformes',
      heroSubtitle: 'Outils et technologies pour la recherche et l\'innovation',
      introText: 'L\'ANRSI met à disposition des chercheurs et innovateurs mauritaniens des plateformes technologiques de pointe pour soutenir leurs projets de recherche et d\'innovation.',
      plateformes: [
        {
          icon: '🔬',
          title: 'Plateforme d\'Analyse Chimique',
          description: 'Laboratoire équipé d\'instruments de pointe pour l\'analyse chimique, spectroscopie, et caractérisation des matériaux.',
          equipments: ['Spectromètre de masse', 'Chromatographe en phase gazeuse', 'Diffractomètre RX', 'Microscope électronique'],
          services: ['Analyse de composition', 'Caractérisation de matériaux', 'Contrôle qualité', 'Formation technique'],
          contact: 'chimie@anrsi.mr'
        },
        {
          icon: '💻',
          title: 'Plateforme Informatique et Calcul',
          description: 'Infrastructure informatique haute performance pour le calcul scientifique, simulation numérique, et traitement de données.',
          equipments: ['Cluster de calcul haute performance', 'Serveurs de stockage massif', 'Réseau haute vitesse', 'Logiciels scientifiques'],
          services: ['Calcul parallèle', 'Simulation numérique', 'Analyse de données', 'Support technique'],
          contact: 'informatique@anrsi.mr'
        },
        {
          icon: '🌱',
          title: 'Plateforme Biotechnologique',
          description: 'Laboratoire spécialisé en biotechnologie pour la recherche en biologie moléculaire, génétique, et biologie végétale.',
          equipments: ['PCR en temps réel', 'Électrophorèse', 'Microscopes de fluorescence', 'Incubateurs contrôlés'],
          services: ['Analyse génétique', 'Culture cellulaire', 'Tests biologiques', 'Consultation scientifique'],
          contact: 'biotech@anrsi.mr'
        },
        {
          icon: '⚡',
          title: 'Plateforme Énergétique',
          description: 'Installation dédiée aux tests et développement de technologies énergétiques renouvelables et systèmes de stockage.',
          equipments: ['Simulateur solaire', 'Banc d\'essai éolien', 'Système de stockage batterie', 'Analyseur de puissance'],
          services: ['Tests de performance', 'Optimisation de systèmes', 'Études de faisabilité', 'Formation technique'],
          contact: 'energie@anrsi.mr'
        },
        {
          icon: '🌍',
          title: 'Plateforme Environnementale',
          description: 'Laboratoire d\'analyse environnementale pour l\'étude de la qualité de l\'air, de l\'eau, et des sols.',
          equipments: ['Analyseur de qualité d\'air', 'Spectromètre UV-Vis', 'pH-mètres de précision', 'Échantillonneurs automatiques'],
          services: ['Monitoring environnemental', 'Analyse de pollution', 'Études d\'impact', 'Consultation réglementaire'],
          contact: 'environnement@anrsi.mr'
        },
        {
          icon: '🏭',
          title: 'Plateforme de Prototypage',
          description: 'Atelier de fabrication numérique pour le prototypage rapide, impression 3D, et développement de produits.',
          equipments: ['Imprimantes 3D industrielles', 'Machine de découpe laser', 'Fraiseuse CNC', 'Scanner 3D'],
          services: ['Prototypage rapide', 'Design assisté par ordinateur', 'Fabrication sur mesure', 'Formation technique'],
          contact: 'prototypage@anrsi.mr'
        }
      ],
      accessModes: [
        {
          icon: '🎓',
          title: 'Accès Académique',
          description: 'Tarifs préférentiels pour les universités et institutions de recherche publiques.',
          items: ['50% de réduction sur les tarifs standards', 'Formation gratuite incluse', 'Support technique prioritaire']
        },
        {
          icon: '🏢',
          title: 'Accès Industriel',
          description: 'Services complets pour les entreprises et startups innovantes.',
          items: ['Tarifs compétitifs', 'Confidentialité garantie', 'Rapports détaillés']
        },
        {
          icon: '🤝',
          title: 'Partenariats',
          description: 'Collaborations à long terme avec des institutions partenaires.',
          items: ['Accès privilégié', 'Co-développement de projets', 'Formation du personnel']
        }
      ],
      bookingSteps: [
        { number: 1, title: 'Demande d\'Accès', description: 'Soumission d\'une demande détaillée avec description du projet et besoins techniques.' },
        { number: 2, title: 'Évaluation Technique', description: 'Analyse de la faisabilité technique et évaluation des ressources nécessaires.' },
        { number: 3, title: 'Formation', description: 'Formation obligatoire aux procédures de sécurité et d\'utilisation des équipements.' },
        { number: 4, title: 'Réservation', description: 'Planification des créneaux d\'utilisation selon la disponibilité des équipements.' },
        { number: 5, title: 'Utilisation', description: 'Accès aux plateformes avec support technique et supervision si nécessaire.' }
      ],
      bookingRequirements: [
        'Projet de recherche ou d\'innovation validé',
        'Formation aux procédures de sécurité',
        'Assurance responsabilité civile',
        'Respect des règles d\'utilisation',
        'Signature d\'un accord de confidentialité'
      ],
      supportItems: [
        { icon: '📚', title: 'Formation Technique', description: 'Formation complète sur l\'utilisation des équipements et les procédures de sécurité.' },
        { icon: '🔧', title: 'Support Technique', description: 'Assistance technique pendant l\'utilisation des plateformes et maintenance préventive.' },
        { icon: '📊', title: 'Analyse de Données', description: 'Support dans l\'analyse et l\'interprétation des résultats obtenus sur les plateformes.' },
        { icon: '🤝', title: 'Consultation Scientifique', description: 'Conseil scientifique pour l\'optimisation des protocoles et l\'amélioration des résultats.' }
      ],
      contactInfo: [
        { icon: 'fas fa-envelope', label: 'Email Général', value: 'plateformes@anrsi.mr' },
        { icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' },
        { icon: 'fas fa-map-marker-alt', label: 'Adresse', value: 'ANRSI, Nouakchott, Mauritanie' },
        { icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 18h00' }
      ]
    };
  }
}
