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
  templateUrl: './appels-candidatures.component.html',
  styleUrls: ['./appels-candidatures.component.scss']
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
