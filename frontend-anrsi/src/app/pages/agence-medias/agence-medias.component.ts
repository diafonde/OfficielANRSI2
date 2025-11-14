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
  templateUrl: './agence-medias.component.html',
  styleUrls: ['./agence-medias.component.scss']
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
