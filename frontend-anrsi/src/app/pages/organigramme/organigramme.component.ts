import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface Position {
  icon: string;
  title: string;
  description: string;
  isDirector?: boolean;
}

interface Level {
  levelNumber: number;
  positions: Position[];
}

interface Responsibility {
  icon: string;
  title: string;
  description: string;
}

interface OrganigrammeContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  levels: Level[];
  responsibilitiesTitle: string;
  responsibilities: Responsibility[];
}

@Component({
  selector: 'app-organigramme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss']
})
export class OrganigrammeComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  introText: string = '';
  levels: Level[] = [];
  responsibilitiesTitle: string = '';
  responsibilities: Responsibility[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultLevels: Level[] = [
    {
      levelNumber: 1,
      positions: [{
        icon: '👑',
        title: 'Haut Conseil de la Recherche Scientifique et de l\'Innovation',
        description: 'Présidé par Son Excellence le Premier Ministre',
        isDirector: true
      }]
    },
    {
      levelNumber: 2,
      positions: [{
        icon: '👔',
        title: 'Direction Générale',
        description: 'Directeur Général de l\'ANRSI',
        isDirector: true
      }]
    },
    {
      levelNumber: 3,
      positions: [
        {
          icon: '🔬',
          title: 'Direction de la Recherche',
          description: 'Gestion des programmes de recherche',
          isDirector: false
        },
        {
          icon: '💡',
          title: 'Direction de l\'Innovation',
          description: 'Promotion de l\'innovation technologique',
          isDirector: false
        },
        {
          icon: '💰',
          title: 'Direction Financière',
          description: 'Gestion des fonds et budgets',
          isDirector: false
        }
      ]
    },
    {
      levelNumber: 4,
      positions: [
        {
          icon: '📊',
          title: 'Service d\'Évaluation',
          description: 'Suivi et évaluation des projets',
          isDirector: false
        },
        {
          icon: '🤝',
          title: 'Service de Coopération',
          description: 'Partenariats internationaux',
          isDirector: false
        },
        {
          icon: '📋',
          title: 'Service Administratif',
          description: 'Gestion administrative',
          isDirector: false
        },
        {
          icon: '💻',
          title: 'Service Informatique',
          description: 'Support technique et numérique',
          isDirector: false
        }
      ]
    }
  ];
  
  defaultResponsibilities: Responsibility[] = [
    {
      icon: '🎯',
      title: 'Définition des Priorités',
      description: 'Le Haut Conseil définit les priorités nationales de recherche et d\'innovation'
    },
    {
      icon: '📝',
      title: 'Appels à Projets',
      description: 'L\'ANRSI lance des appels à projets selon les priorités définies'
    },
    {
      icon: '💼',
      title: 'Gestion des Fonds',
      description: 'Allocation transparente et efficace des fonds de recherche'
    },
    {
      icon: '📈',
      title: 'Suivi et Évaluation',
      description: 'Monitoring continu des projets financés et évaluation de leur impact'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('organigramme').subscribe({
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
      const content: OrganigrammeContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Organigramme';
      this.heroSubtitle = content.heroSubtitle || 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.sectionTitle = content.sectionTitle || 'Structure Organisationnelle';
      this.introText = content.introText || '';
      this.levels = content.levels || this.defaultLevels;
      this.responsibilitiesTitle = content.responsibilitiesTitle || 'Responsabilités Clés';
      this.responsibilities = content.responsibilities || this.defaultResponsibilities;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Organigramme';
    this.heroSubtitle = 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.sectionTitle = 'Structure Organisationnelle';
    this.introText = 'L\'ANRSI est structurée de manière hiérarchique pour assurer une gestion efficace de la recherche scientifique et de l\'innovation en Mauritanie.';
    this.levels = this.defaultLevels;
    this.responsibilitiesTitle = 'Responsabilités Clés';
    this.responsibilities = this.defaultResponsibilities;
  }
}
