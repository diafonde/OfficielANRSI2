import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface ObjectiveItem {
  number: number;
  title: string;
  description: string;
}

interface ObjectivesContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  objectives: ObjectiveItem[];
}

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  objectives: ObjectiveItem[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultObjectives: ObjectiveItem[] = [
    {
      number: 1,
      title: 'Accroître la production scientifique Nationale',
      description: 'L\'ANRSI vise à stimuler et augmenter significativement la production scientifique nationale en soutenant les chercheurs et les institutions de recherche.'
    },
    {
      number: 2,
      title: 'Améliorer l\'excellence et le rayonnement de la recherche scientifique en Mauritanie',
      description: 'Nous nous engageons à promouvoir l\'excellence dans la recherche scientifique et à renforcer le rayonnement international de la recherche mauritanienne.'
    },
    {
      number: 3,
      title: 'Améliorer l\'impact de la recherche et l\'innovation sur l\'économie, la société et le développement durable',
      description: 'L\'ANRSI travaille à maximiser l\'impact de la recherche et de l\'innovation sur le développement économique, social et durable de la Mauritanie.'
    },
    {
      number: 4,
      title: 'Accroître la capacité d\'innovation et de création de richesses de notre pays par et grâce à la recherche',
      description: 'Nous visons à renforcer les capacités d\'innovation nationales et à favoriser la création de richesses grâce aux résultats de la recherche scientifique.'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('objectives').subscribe({
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
      const content: ObjectivesContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Objectifs';
      this.heroSubtitle = content.heroSubtitle || 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.sectionTitle = content.sectionTitle || 'Nos Objectifs';
      this.objectives = content.objectives || this.defaultObjectives;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Objectifs';
    this.heroSubtitle = 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.sectionTitle = 'Nos Objectifs';
    this.objectives = this.defaultObjectives;
  }
}
