import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageAdminService, PageDTO } from '../../services/page-admin.service';

@Component({
  selector: 'app-admin-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-pages.component.html',
  styleUrls: ['./admin-pages.component.scss']
})
export class AdminPagesComponent implements OnInit {
  pages: PageDTO[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  filterType = '';

  pageTypes = ['SIMPLE', 'LIST', 'STRUCTURED', 'FAQ'];

  constructor(private pageService: PageAdminService) {}

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.pageService.getAllPages().subscribe({
      next: (pages) => {
        this.pages = pages;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading pages';
        this.isLoading = false;
        console.error('Error loading pages:', error);
      }
    });
  }

  get filteredPages(): PageDTO[] {
    let filtered = this.pages;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(page =>
        (page.title || '').toLowerCase().includes(term) ||
        page.slug.toLowerCase().includes(term)
      );
    }

    if (this.filterType) {
      filtered = filtered.filter(page => page.pageType === this.filterType);
    }

    return filtered;
  }

  deletePage(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this page?')) {
      this.pageService.deletePage(id).subscribe({
        next: () => {
          this.loadPages();
        },
        error: (error) => {
          this.errorMessage = 'Error deleting page';
          console.error('Error deleting page:', error);
        }
      });
    }
  }

  togglePublish(page: PageDTO): void {
    if (!page.id) return;

    const operation = page.isPublished
      ? this.pageService.unpublishPage(page.id)
      : this.pageService.publishPage(page.id);

    operation.subscribe({
      next: () => {
        this.loadPages();
      },
      error: (error) => {
        this.errorMessage = 'Error updating page status';
        console.error('Error updating page:', error);
      }
    });
  }

  getPageTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'SIMPLE': 'Simple',
      'LIST': 'List',
      'STRUCTURED': 'Structured',
      'FAQ': 'FAQ'
    };
    return labels[type] || type;
  }

  getSlugFromComponent(componentName: string): string {
    // Map component names to slugs
    const slugMap: { [key: string]: string } = {
      'missions': 'missions',
      'objectives': 'objectives',
      'organigramme': 'organigramme',
      'plateformes': 'plateformes',
      'priorites-recherche-2026': 'priorites-recherche-2026',
      'programmes': 'programmes',
      'strategic-vision': 'strategic-vision',
      'zone-humide': 'zone-humide',
      'expert-anrsi': 'expert-anrsi',
      'cooperation': 'cooperation',
      'contact': 'contact',
      'conseil-administration': 'conseil-administration',
      'appels-candidatures': 'appels-candidatures',
      'ai4agri': 'ai4agri',
      'agence-medias': 'agence-medias'
    };
    return slugMap[componentName] || componentName;
  }
}

