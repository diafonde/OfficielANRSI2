import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageService, PageDTO } from '../../services/page.service';

interface ResearchPriority {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface PrioritesRecherche2026Content {
  heroTitle: string;
  heroSubtitle: string;
  introParagraphs: string[];
  sectionTitle: string;
  researchPriorities: ResearchPriority[];
  publicationDate: string;
}

@Component({
  selector: 'app-priorites-recherche-2026',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './priorites-recherche-2026.component.html',
  styleUrls: ['./priorites-recherche-2026.component.scss']
})
export class PrioritesRecherche2026Component implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  introParagraphs: string[] = [];
  sectionTitle: string = '';
  researchPriorities: ResearchPriority[] = [];
  publicationDate: string = '';
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultIntroParagraphs: string[] = [
    'Se basant sur la stratégie nationale de la recherche scientifique et de l\'innovation adoptée par le Gouvernement, l\'Agence nationale de la recherche scientifique et de l\'innovation publie les détails des sept axes de ladite stratégie.',
    'Ces axes sont répartis suivant les besoins de développement et en réponse aux défis actuels, pour couvrir des domaines variés allant de l\'autosuffisance alimentaire à la digitalisation et les défis émergents avec l\'explosion de l\'intelligence artificielle, en passant par la santé, les industries extractives.',
    'Les recherches humaines et sociales occupent une place de choix dans ces axes, la stratégie leur ayant consacré deux axes à travers lesquels il est possible d\'œuvrer pour "la valorisation des savoirs autochtones ancestraux afin d\'affronter les enjeux sociétaux, de combattre la vulnérabilité, les disparités sociales et l\'exclusion et de consolider l\'unité nationale".'
  ];
  
  defaultResearchPriorities: ResearchPriority[] = [
    {
      id: 1,
      title: 'Autosuffisance Alimentaire',
      description: 'Développement de stratégies pour assurer la sécurité alimentaire nationale et réduire la dépendance aux importations.',
      icon: 'fas fa-seedling'
    },
    {
      id: 2,
      title: 'Digitalisation et Intelligence Artificielle',
      description: 'Intégration des technologies numériques et de l\'IA pour moderniser les secteurs économiques et améliorer l\'efficacité.',
      icon: 'fas fa-robot'
    },
    {
      id: 3,
      title: 'Santé et Bien-être',
      description: 'Amélioration des systèmes de santé, prévention des maladies et promotion du bien-être de la population.',
      icon: 'fas fa-heartbeat'
    },
    {
      id: 4,
      title: 'Industries Extractives',
      description: 'Optimisation de l\'exploitation des ressources naturelles de manière durable et responsable.',
      icon: 'fas fa-mountain'
    },
    {
      id: 5,
      title: 'Recherches Humaines et Sociales I',
      description: 'Valorisation des savoirs autochtones ancestraux pour affronter les enjeux sociétaux contemporains.',
      icon: 'fas fa-users'
    },
    {
      id: 6,
      title: 'Recherches Humaines et Sociales II',
      description: 'Combattre la vulnérabilité, les disparités sociales et l\'exclusion pour consolider l\'unité nationale.',
      icon: 'fas fa-hands-helping'
    },
    {
      id: 7,
      title: 'Développement Durable',
      description: 'Promotion de pratiques respectueuses de l\'environnement et du développement durable à long terme.',
      icon: 'fas fa-leaf'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('priorites-recherche-2026').subscribe({
      next: (page) => {
        this.page = page;
        this.parseContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.loadDefaultContent();
        this.isLoading = false;
      }
    });
  }

  parseContent(): void {
    if (!this.page?.content) {
      this.loadDefaultContent();
      return;
    }

    try {
      const content: PrioritesRecherche2026Content = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'LES PRIORITÉS DE LA RECHERCHE À L\'HORIZON 2026';
      this.heroSubtitle = content.heroSubtitle || 'L\'ANRSI définit les priorités de la recherche scientifique et de l\'innovation pour le développement national';
      this.introParagraphs = content.introParagraphs || this.defaultIntroParagraphs;
      this.sectionTitle = content.sectionTitle || 'Les Sept Axes Stratégiques';
      this.researchPriorities = content.researchPriorities || this.defaultResearchPriorities;
      this.publicationDate = content.publicationDate || '';
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'LES PRIORITÉS DE LA RECHERCHE À L\'HORIZON 2026';
    this.heroSubtitle = 'L\'ANRSI définit les priorités de la recherche scientifique et de l\'innovation pour le développement national';
    this.introParagraphs = this.defaultIntroParagraphs;
    this.sectionTitle = 'Les Sept Axes Stratégiques';
    this.researchPriorities = this.defaultResearchPriorities;
    this.publicationDate = '18 Janvier 2023';
  }
}
