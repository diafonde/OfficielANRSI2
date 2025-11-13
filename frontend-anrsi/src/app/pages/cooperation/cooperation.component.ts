import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageService, PageDTO } from '../../services/page.service';

interface Partnership {
  id: string;
  title: string;
  description: string;
  type: string;
  country: string;
  flag: string;
  objectives: string[];
  status: string;
  icon: string;
  color: string;
  details?: string;
}

interface CooperationInfo {
  title: string;
  description: string;
  benefits: string[];
}

@Component({
  selector: 'app-cooperation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './cooperation.component.html',
  styleUrls: ['./cooperation.component.scss']
})
export class CooperationComponent implements OnInit {
  page: PageDTO | null = null;
  partnerships: Partnership[] = [];
  cooperationInfo: CooperationInfo = {
    title: 'Coopération & Partenariats',
    description: 'L\'Agence est liée à des institutions d\'intérêt commun par le biais d\'accords de coopération et de partenariat pour atteindre des objectifs communs.',
    benefits: []
  };
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultPartnerships = [
    {
      id: 'anrsa-senegal',
      title: 'Convention de partenariat avec l\'ANRSA Sénégal',
      description: 'Partenariat stratégique avec l\'Agence Nationale de la Recherche Scientifique Appliquée du Sénégal',
      type: 'Partenariat',
      country: 'Sénégal',
      flag: '🇸🇳',
      objectives: [
        'Échange d\'expertise en recherche scientifique',
        'Collaboration sur des projets communs',
        'Renforcement des capacités de recherche',
        'Partage des ressources et infrastructures'
      ],
      status: 'Actif',
      icon: 'fas fa-handshake',
      color: '#0a3d62'
    },
    {
      id: 'cnrst-maroc',
      title: 'Convention de coopération avec le CNRST Maroc',
      description: 'Coopération avec le Centre National de la Recherche Scientifique et Technique du Maroc',
      type: 'Coopération',
      country: 'Maroc',
      flag: '🇲🇦',
      objectives: [
        'Développement de projets de recherche conjoints',
        'Formation et échange de chercheurs',
        'Valorisation des résultats de recherche',
        'Innovation technologique'
      ],
      status: 'Actif',
      icon: 'fas fa-microscope',
      color: '#20a39e'
    },
    {
      id: 'tunisie-dri',
      title: 'Partenariat avec le DRI Tunisie',
      description: 'Collaboration avec le Département de la Recherche Scientifique et de l\'Innovation en Tunisie',
      type: 'Partenariat',
      country: 'Tunisie',
      flag: '🇹🇳',
      objectives: [
        'Recherche appliquée et innovation',
        'Transfert de technologie',
        'Formation spécialisée',
        'Développement de solutions innovantes'
      ],
      status: 'Actif',
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    },
    {
      id: 'iset-rosso',
      title: 'Partenariat avec l\'ISET Rosso',
      description: 'Collaboration avec l\'Institut Supérieur d\'Enseignement Technologique de Rosso pour la production de légumes protégés',
      type: 'Partenariat Local',
      country: 'Mauritanie',
      flag: '🇲🇷',
      objectives: [
        'Production de légumes protégés',
        'Techniques agricoles innovantes',
        'Formation technique spécialisée',
        'Développement agricole local'
      ],
      details: 'Ce partenariat local vise à développer des techniques innovantes pour la production de légumes protégés, contribuant ainsi au développement agricole et à la sécurité alimentaire en Mauritanie.',
      status: 'Actif',
      icon: 'fas fa-seedling',
      color: '#126564'
    }
  ];

  defaultCooperationInfo: CooperationInfo = {
    title: 'Coopération & Partenariats',
    description: 'L\'Agence est liée à des institutions d\'intérêt commun par le biais d\'accords de coopération et de partenariat pour atteindre des objectifs communs.',
    benefits: [
      'Renforcement des capacités de recherche',
      'Échange d\'expertise et de connaissances',
      'Développement de projets innovants',
      'Mise en réseau des chercheurs',
      'Valorisation des résultats de recherche',
      'Transfert de technologie'
    ]
  };

  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
    
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('cooperation').subscribe({
      next: (page) => {
        this.page = page;
        this.parseContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.partnerships = this.defaultPartnerships;
        this.cooperationInfo = this.defaultCooperationInfo;
        this.isLoading = false;
      }
    });
  }

  parseContent(): void {
    if (!this.page?.content) {
      this.partnerships = this.defaultPartnerships;
      this.cooperationInfo = this.defaultCooperationInfo;
      return;
    }

    try {
      const content = JSON.parse(this.page.content);
      
      // Handle new structured format
      if (content.cooperationInfo) {
        this.cooperationInfo = {
          title: content.cooperationInfo.title || this.defaultCooperationInfo.title,
          description: content.cooperationInfo.description || this.defaultCooperationInfo.description,
          benefits: content.cooperationInfo.benefits || this.defaultCooperationInfo.benefits
        };
      } else {
        this.cooperationInfo = this.defaultCooperationInfo;
      }
      
      if (content.partnerships && Array.isArray(content.partnerships)) {
        this.partnerships = content.partnerships;
      } else if (Array.isArray(content)) {
        // Legacy format - content is directly an array of partnerships
        this.partnerships = content;
      } else {
        this.partnerships = this.defaultPartnerships;
      }
    } catch (e) {
      console.error('Error parsing content:', e);
      this.partnerships = this.defaultPartnerships;
      this.cooperationInfo = this.defaultCooperationInfo;
    }
  }
}
