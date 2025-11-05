import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-programmes',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss']
})
export class ProgrammesComponent implements OnInit {
  
  programmes = [
    {
      id: 'temkin',
      name: 'Programme Temkin (Autonomisation)',
      description: 'Programme d\'autonomisation des structures de recherche',
      objectives: [
        'Garantir le fonctionnement des structures de recherche (SR) reconnues',
        'Encourager la culture de mutualisation des moyens',
        'Briser l\'isolement des chercheurs',
        'Renforcer les capacités des Etablissements d\'Enseignement Supérieur et de Recherche et des chercheurs en matière de pilotage et de gouvernance de la recherche'
      ],
      icon: 'fas fa-university',
      color: '#0a3d62'
    },
    {
      id: 'temeyouz',
      name: 'Programme Temeyouz (Excellence)',
      description: 'Programme d\'excellence scientifique pour les jeunes chercheurs',
      objectives: [
        'Soutenir l\'excellence scientifique chez les jeunes chercheurs',
        'Encourager les doctorants à consacrer leur plein temps à leurs thèses',
        'Accroitre la production scientifique nationale et améliorer sa visibilité',
        'Inciter et motiver l\'encadrement et la production scientifique',
        'Développer la créativité et l\'esprit d\'entreprise chez les jeunes chercheurs'
      ],
      icon: 'fas fa-graduation-cap',
      color: '#20a39e'
    },
    {
      id: 'tethmin',
      name: 'Programme Tethmin (Valorisation)',
      description: 'Programme de valorisation de la recherche scientifique',
      objectives: [
        'Assurer la diffusion et le partage du savoir',
        'Faire connaitre les thématiques de recherche des Structures de Recherche',
        'Consolider le réseautage des chercheurs autour des thématiques prioritaires',
        'Promouvoir la visibilité de la production scientifique nationale',
        'Appuyer la mise en place des structures de valorisation de la recherche (incubateurs)',
        'Protéger la propriété intellectuelle'
      ],
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    },
    {
      id: 'temm',
      name: 'Programme TEMM pour le développement local',
      description: 'Programme de développement local et d\'industrialisation',
      objectives: [
        'Concevoir et financer des projets pilotes dans des domaines spécifiques de développement local',
        'Démontrer et exploiter les grandes potentialités du pays',
        'Encourager les investissements dans l\'industrialisation et la recherche scientifique',
        'Collaborer avec les partenaires techniques et scientifiques'
      ],
      details: 'Le programme TEMM parmi les programmes le plus récent adopté par le Conseil d\'Administration de l\'ANRSI. Ce programme conçoit et finance des projets pilotes dans des domaines spécifiques de développement local en vue de démontrer et exploiter les grandes potentialités du pays et d\'encourager les investissements dans l\'industrialisation et la recherche scientifique avec les partenaires techniques et scientifiques. Le premier projet de ce programme portera sur les cultures maraichères abritées, leur production, leur conservation et leur transformation, a été démarré effectivement dans le cadre de la convention signée le 04 novembre 2021 entre l\'ANRSI et L\'ISET.',
      icon: 'fas fa-industry',
      color: '#126564'
    }
  ];

  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
  }
}
