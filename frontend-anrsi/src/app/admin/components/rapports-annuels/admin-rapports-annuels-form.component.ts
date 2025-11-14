import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';

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
  selector: 'app-admin-rapports-annuels-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-rapports-annuels-form.component.html',
  styleUrls: ['./admin-rapports-annuels-form.component.scss']
})
export class AdminRapportsAnnuelsFormComponent implements OnInit {
  form: FormGroup;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private articleService: ArticleAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.loadPage();
  }

  createForm(): FormGroup {
    return this.fb.group({
      heroTitle: ['', Validators.required],
      heroSubtitle: ['', Validators.required],
      sectionTitle: ['', Validators.required],
      rapports: this.fb.array([])
    });
  }

  get rapports(): FormArray {
    return this.form.get('rapports') as FormArray;
  }

  addRapport(rapport?: Rapport): void {
    const group = this.fb.group({
      year: [rapport?.year || '', Validators.required],
      title: [rapport?.title || '', Validators.required],
      downloadUrl: [rapport?.downloadUrl || '']
    });
    this.rapports.push(group);
  }

  removeRapport(index: number): void {
    this.rapports.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('rapports-annuels').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: RapportsContent = JSON.parse(page.content);
            this.populateForm(content, page);
          } catch (e) {
            console.error('Error parsing content:', e);
            this.loadDefaultData();
          }
        } else {
          this.loadDefaultData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.loadDefaultData();
        } else {
          this.errorMessage = 'Erreur lors du chargement de la page';
        }
        this.isLoading = false;
      }
    });
  }

  loadDefaultData(): void {
    this.form.patchValue({
      heroTitle: 'Rapports Annuels',
      heroSubtitle: 'Rapports annuels de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Rapports Annuels'
    });

    // Clear existing array
    while (this.rapports.length) this.rapports.removeAt(0);

    // Add default rapports
    this.addRapport({ year: '2023', title: 'Rapport 2023', downloadUrl: '' });
    this.addRapport({ year: '2022', title: 'Rapport 2022', downloadUrl: '' });
  }

  populateForm(content: RapportsContent, page: PageDTO): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || page.heroTitle || '',
      heroSubtitle: content.heroSubtitle || page.heroSubtitle || '',
      sectionTitle: content.sectionTitle || ''
    });

    // Clear existing array
    while (this.rapports.length) this.rapports.removeAt(0);

    // Populate array
    if (content.rapports && content.rapports.length > 0) {
      content.rapports.forEach(rapport => this.addRapport(rapport));
    } else {
      this.loadDefaultData();
    }
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        this.errorMessage = 'Le fichier doit être un PDF ou un document Word';
        return;
      }
      
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 50MB';
        return;
      }
      
      // Upload file
      this.uploadDocument(file, index);
    }
  }

  uploadDocument(file: File, index: number): void {
    this.errorMessage = '';
    const rapportGroup = this.rapports.at(index) as FormGroup;
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        rapportGroup.patchValue({ downloadUrl: response.url });
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.error?.error || 'Erreur lors du téléchargement du fichier';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    const content: RapportsContent = {
      heroTitle: formValue.heroTitle,
      heroSubtitle: formValue.heroSubtitle,
      sectionTitle: formValue.sectionTitle,
      rapports: formValue.rapports || []
    };

    const updateData: PageUpdateDTO = {
      title: 'Rapports Annuels',
      heroTitle: formValue.heroTitle,
      heroSubtitle: formValue.heroSubtitle,
      content: JSON.stringify(content),
      pageType: 'STRUCTURED',
      isPublished: true,
      isActive: true
    };

    if (this.pageId) {
      this.pageService.updatePage(this.pageId, updateData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/pages']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = 'Erreur lors de l\'enregistrement de la page';
          console.error('Error saving page:', error);
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'rapports-annuels',
        title: 'Rapports Annuels',
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        content: JSON.stringify(content),
        pageType: 'STRUCTURED',
        isPublished: true,
        isActive: true
      }).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/pages']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = 'Erreur lors de la création de la page';
          console.error('Error creating page:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

