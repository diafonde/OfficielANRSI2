import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService, PageDTO } from '../../services/page.service';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface StrategicVisionContent {
  heroTitle: string;
  heroSubtitle: string;
  visionTitle: string;
  visionText: string;
  messageTitle: string;
  messageText: string;
  valuesTitle: string;
  values: ValueItem[];
}

@Component({
  selector: 'app-strategic-vision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './strategic-vision.component.html',
  styleUrls: ['./strategic-vision.component.scss']
})
export class StrategicVisionComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  visionTitle: string = '';
  visionText: string = '';
  messageTitle: string = '';
  messageText: string = '';
  valuesTitle: string = '';
  values: ValueItem[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultValues: ValueItem[] = [
    {
      icon: '🔬',
      title: 'Excellence Scientifique',
      description: 'Promouvoir la qualité et l\'excellence dans toutes nos initiatives de recherche'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'Encourager la coopération entre chercheurs, institutions et partenaires'
    },
    {
      icon: '🌱',
      title: 'Innovation',
      description: 'Favoriser l\'innovation technologique et scientifique pour le développement'
    },
    {
      icon: '🎯',
      title: 'Impact',
      description: 'Maximiser l\'impact de la recherche sur la société et l\'économie'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('strategic-vision').subscribe({
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
      const content: StrategicVisionContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Vision Stratégique';
      this.heroSubtitle = content.heroSubtitle || 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.visionTitle = content.visionTitle || 'Vision';
      this.visionText = content.visionText || '';
      this.messageTitle = content.messageTitle || 'Le Message';
      this.messageText = content.messageText || '';
      this.valuesTitle = content.valuesTitle || 'Nos Valeurs';
      this.values = content.values || this.defaultValues;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Vision Stratégique';
    this.heroSubtitle = 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.visionTitle = 'Vision';
    this.visionText = 'L\'Agence aspire à renforcer les capacités et les compétences en recherche scientifique pour être un leader régional et une référence dans le domaine de la science et de la technologie.';
    this.messageTitle = 'Le Message';
    this.messageText = 'Soutenir l\'innovation et promouvoir la recherche scientifique au service du développement du pays et de ses industries.';
    this.valuesTitle = 'Nos Valeurs';
    this.values = this.defaultValues;
  }
}
