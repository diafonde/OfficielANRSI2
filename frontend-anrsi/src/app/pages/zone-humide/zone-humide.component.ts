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
  templateUrl: './zone-humide.component.html',
  styleUrls: ['./zone-humide.component.scss']
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
