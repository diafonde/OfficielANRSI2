import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-financement',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './financement.component.html',
  styleUrls: ['./financement.component.scss']
})
export class FinancementComponent implements OnInit {
  
  fundingInfo = {
    title: 'Financement',
    description: 'L\'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s\'inscrivent dans le cadre des programmes de l\'Agence qui sont annoncés annuellement.',
    process: [
      {
        step: 1,
        title: 'Identifier le programme',
        description: 'Le candidat doit identifier le programme adapté à son activité',
        icon: 'fas fa-search'
      },
      {
        step: 2,
        title: 'Respecter les délais',
        description: 'Respecter les délais et conditions de candidature publiés sur le site internet de l\'Agence',
        icon: 'fas fa-clock'
      },
      {
        step: 3,
        title: 'Consulter la réglementation',
        description: 'Consulter l\'arrêté ministériel réglementant le financement pour plus de détails',
        icon: 'fas fa-file-alt'
      }
    ],
    requirements: [
      'Être une structure de recherche reconnue',
      'Avoir un projet conforme aux programmes de l\'ANRSI',
      'Respecter les délais de candidature',
      'Fournir tous les documents requis',
      'Justifier de la pertinence scientifique du projet'
    ],
    benefits: [
      'Financement des activités de recherche scientifique',
      'Soutien aux projets innovants',
      'Accompagnement dans la réalisation des projets',
      'Mise en réseau avec d\'autres chercheurs',
      'Valorisation des résultats de recherche'
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
