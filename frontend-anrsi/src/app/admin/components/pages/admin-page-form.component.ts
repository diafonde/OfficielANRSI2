import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

@Component({
  selector: 'app-admin-page-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-page-form.component.html',
  styleUrls: ['./admin-page-form.component.scss']
})
export class AdminPageFormComponent implements OnInit {
  pageForm: FormGroup;
  isEditMode = false;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  page: PageDTO | null = null;

  pageTypes = [
    { value: 'SIMPLE', label: 'Simple' },
    { value: 'LIST', label: 'List' },
    { value: 'STRUCTURED', label: 'Structured' },
    { value: 'FAQ', label: 'FAQ' }
  ];

  // Map component names to slugs for quick access
  componentSlugs: { [key: string]: string } = {
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
    'agence-medias': 'agence-medias',
    'rapports-annuels': 'rapports-annuels',
    'texts-juridiques': 'texts-juridiques'
  };

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pageForm = this.fb.group({
      slug: ['', [Validators.required]],
      title: ['', [Validators.required]],
      heroTitle: [''],
      heroSubtitle: [''],
      heroImageUrl: [''],
      content: [''],
      pageType: ['SIMPLE', [Validators.required]],
      metadata: [''],
      isPublished: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const slug = this.route.snapshot.queryParamMap.get('slug');

    if (id) {
      this.isEditMode = true;
      this.pageId = +id;
      this.loadPage(+id);
    } else if (slug) {
      this.isEditMode = true;
      this.loadPageBySlug(slug);
    }
  }

  loadPage(id: number): void {
    this.isLoading = true;
    this.pageService.getPageById(id).subscribe({
      next: (page) => {
        this.page = page;
        this.populateForm(page);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading page';
        this.isLoading = false;
        console.error('Error loading page:', error);
      }
    });
  }

  loadPageBySlug(slug: string): void {
    this.isLoading = true;
    this.pageService.getPageBySlug(slug).subscribe({
      next: (page) => {
        this.page = page;
        this.pageId = page.id || null;
        this.populateForm(page);
        this.isLoading = false;
      },
      error: (error) => {
        // If page doesn't exist, create a new one with this slug
        if (error.status === 404) {
          this.pageForm.patchValue({ slug });
          this.isEditMode = false;
          this.pageId = null;
        } else {
          this.errorMessage = 'Error loading page';
        }
        this.isLoading = false;
        console.error('Error loading page:', error);
      }
    });
  }

  populateForm(page: PageDTO): void {
    this.pageForm.patchValue({
      slug: page.slug,
      title: page.title,
      heroTitle: page.heroTitle || '',
      heroSubtitle: page.heroSubtitle || '',
      heroImageUrl: page.heroImageUrl || '',
      content: page.content || '',
      pageType: page.pageType,
      metadata: page.metadata || '',
      isPublished: page.isPublished || false,
      isActive: page.isActive !== false
    });
  }

  setSlugFromComponent(componentName: string): void {
    const slug = this.componentSlugs[componentName];
    if (slug) {
      this.pageForm.patchValue({ slug });
    }
  }

  getSlugKeys(): string[] {
    return Object.keys(this.componentSlugs);
  }

  onSubmit(): void {
    if (this.pageForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.pageForm.value;

      if (this.isEditMode && this.pageId) {
        const updateData: PageUpdateDTO = {
          title: formValue.title,
          heroTitle: formValue.heroTitle || undefined,
          heroSubtitle: formValue.heroSubtitle || undefined,
          heroImageUrl: formValue.heroImageUrl || undefined,
          content: formValue.content || undefined,
          pageType: formValue.pageType,
          metadata: formValue.metadata || undefined,
          isPublished: formValue.isPublished,
          isActive: formValue.isActive
        };

        this.pageService.updatePage(this.pageId, updateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/admin/pages']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error updating page';
            console.error('Error updating page:', error);
          }
        });
      } else {
        const createData: PageCreateDTO = {
          slug: formValue.slug,
          title: formValue.title,
          heroTitle: formValue.heroTitle || undefined,
          heroSubtitle: formValue.heroSubtitle || undefined,
          heroImageUrl: formValue.heroImageUrl || undefined,
          content: formValue.content || undefined,
          pageType: formValue.pageType,
          metadata: formValue.metadata || undefined,
          isPublished: formValue.isPublished,
          isActive: formValue.isActive
        };

        this.pageService.createPage(createData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/admin/pages']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error creating page';
            console.error('Error creating page:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill all required fields';
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.pageForm.controls).forEach(key => {
      this.pageForm.get(key)?.markAsTouched();
    });
  }
}

