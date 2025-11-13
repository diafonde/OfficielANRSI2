import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageService, PageDTO } from '../../services/page.service';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface FinancementContent {
  heroTitle: string;
  heroSubtitle: string;
  process: ProcessStep[];
  requirements: string[];
  benefits: string[];
  ctaTitle?: string;
  ctaDescription?: string;
}

@Component({
  selector: 'app-financement',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './financement.component.html',
  styleUrls: ['./financement.component.scss']
})
export class FinancementComponent implements OnInit {
  page: PageDTO | null = null;
  fundingInfo = {
    title: 'Financement',
    description: 'L\'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s\'inscrivent dans le cadre des programmes de l\'Agence qui sont annoncés annuellement.',
    process: [] as ProcessStep[],
    requirements: [] as string[],
    benefits: [] as string[]
  };
  ctaTitle: string = '';
  ctaDescription: string = '';
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultFundingInfo = {
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
    
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('financement').subscribe({
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
      const content: FinancementContent = JSON.parse(this.page.content);
      
      this.fundingInfo = {
        title: content.heroTitle || this.defaultFundingInfo.title,
        description: content.heroSubtitle || this.defaultFundingInfo.description,
        process: content.process || this.defaultFundingInfo.process,
        requirements: content.requirements || this.defaultFundingInfo.requirements,
        benefits: content.benefits || this.defaultFundingInfo.benefits
      };
      
      this.ctaTitle = content.ctaTitle || 'Prêt à candidater ?';
      this.ctaDescription = content.ctaDescription || 'Consultez nos appels à candidatures et soumettez votre projet';
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.fundingInfo = this.defaultFundingInfo;
    this.ctaTitle = 'Prêt à candidater ?';
    this.ctaDescription = 'Consultez nos appels à candidatures et soumettez votre projet';
  }
}
