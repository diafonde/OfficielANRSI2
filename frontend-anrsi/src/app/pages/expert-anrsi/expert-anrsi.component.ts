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
  templateUrl: './expert-anrsi.component.html',
  styleUrls: ['./expert-anrsi.component.scss']
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
