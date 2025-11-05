import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cooperation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './cooperation.component.html',
  styleUrls: ['./cooperation.component.scss']
})
export class CooperationComponent implements OnInit {
  
  partnerships = [
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

  cooperationInfo = {
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
  }
}
