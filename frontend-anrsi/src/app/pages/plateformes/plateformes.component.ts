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
  templateUrl: './plateformes.component.html',
  styleUrls: ['./plateformes.component.scss']
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
