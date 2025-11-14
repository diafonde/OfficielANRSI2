import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageService, PageDTO } from '../../services/page.service';

interface Rapport {
  year: string;
  title: string;
  downloadUrl?: string;
}

interface RapportsContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  rapports: Rapport[];
}

@Component({
  selector: 'app-rapports-annuels',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './rapports-annuels.component.html',
  styleUrls: ['./rapports-annuels.component.scss']
})
export class RapportsAnnuelsComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  rapports: Rapport[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultRapports: Rapport[] = [
    {
      year: '2023',
      title: 'Rapport 2023',
      downloadUrl: '/uploads/rapport-2023.pdf'
    },
    {
      year: '2022',
      title: 'Rapport 2022',
      downloadUrl: '/uploads/rapport-2022.pdf'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('rapports-annuels').subscribe({
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
      const content: RapportsContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Rapports Annuels';
      this.heroSubtitle = content.heroSubtitle || 'Rapports annuels de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.sectionTitle = content.sectionTitle || 'Rapports Annuels';
      this.rapports = content.rapports || this.defaultRapports;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Rapports Annuels';
    this.heroSubtitle = 'Rapports annuels de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.sectionTitle = 'Rapports Annuels';
    this.rapports = this.defaultRapports;
  }

  downloadRapport(rapport: Rapport): void {
    if (rapport.downloadUrl) {
      window.open(rapport.downloadUrl, '_blank');
    }
  }
}

