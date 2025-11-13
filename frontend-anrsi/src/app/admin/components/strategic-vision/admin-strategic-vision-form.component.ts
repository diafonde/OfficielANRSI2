import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

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
  selector: 'app-admin-strategic-vision-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-strategic-vision-form.component.html',
  styleUrls: ['./admin-strategic-vision-form.component.scss']
})
export class AdminStrategicVisionFormComponent implements OnInit {
  form: FormGroup;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
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
      heroTitle: ['Vision Stratégique', Validators.required],
      heroSubtitle: ['La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation', Validators.required],
      visionTitle: ['Vision', Validators.required],
      visionText: ['', Validators.required],
      messageTitle: ['Le Message', Validators.required],
      messageText: ['', Validators.required],
      valuesTitle: ['Nos Valeurs', Validators.required],
      values: this.fb.array([])
    });
  }

  // Values FormArray methods
  get values(): FormArray {
    return this.form.get('values') as FormArray;
  }

  addValue(item?: ValueItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.values.push(group);
  }

  removeValue(index: number): void {
    this.values.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('strategic-vision').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: StrategicVisionContent = JSON.parse(page.content);
            this.populateForm(content);
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
          this.errorMessage = 'Error loading page';
        }
        this.isLoading = false;
      }
    });
  }

  loadDefaultData(): void {
    this.form.patchValue({
      heroTitle: 'Vision Stratégique',
      heroSubtitle: 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      visionTitle: 'Vision',
      visionText: 'L\'Agence aspire à renforcer les capacités et les compétences en recherche scientifique pour être un leader régional et une référence dans le domaine de la science et de la technologie.',
      messageTitle: 'Le Message',
      messageText: 'Soutenir l\'innovation et promouvoir la recherche scientifique au service du développement du pays et de ses industries.',
      valuesTitle: 'Nos Valeurs'
    });

    // Clear existing array
    while (this.values.length) this.values.removeAt(0);

    // Add default values
    this.addValue({
      icon: '🔬',
      title: 'Excellence Scientifique',
      description: 'Promouvoir la qualité et l\'excellence dans toutes nos initiatives de recherche'
    });
    this.addValue({
      icon: '🤝',
      title: 'Collaboration',
      description: 'Encourager la coopération entre chercheurs, institutions et partenaires'
    });
    this.addValue({
      icon: '🌱',
      title: 'Innovation',
      description: 'Favoriser l\'innovation technologique et scientifique pour le développement'
    });
    this.addValue({
      icon: '🎯',
      title: 'Impact',
      description: 'Maximiser l\'impact de la recherche sur la société et l\'économie'
    });
  }

  populateForm(content: StrategicVisionContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Vision Stratégique',
      heroSubtitle: content.heroSubtitle || 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      visionTitle: content.visionTitle || 'Vision',
      visionText: content.visionText || '',
      messageTitle: content.messageTitle || 'Le Message',
      messageText: content.messageText || '',
      valuesTitle: content.valuesTitle || 'Nos Valeurs'
    });

    // Clear existing array
    while (this.values.length) this.values.removeAt(0);

    // Populate array
    content.values?.forEach(value => this.addValue(value));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: StrategicVisionContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        visionTitle: formValue.visionTitle,
        visionText: formValue.visionText,
        messageTitle: formValue.messageTitle,
        messageText: formValue.messageText,
        valuesTitle: formValue.valuesTitle,
        values: formValue.values
      };

      const updateData: PageUpdateDTO = {
        title: 'Vision Stratégique',
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
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
            this.errorMessage = 'Error saving page';
            console.error('Error saving page:', error);
          }
        });
      } else {
        this.pageService.createPage({
          slug: 'strategic-vision',
          title: 'Vision Stratégique',
          heroTitle: content.heroTitle,
          heroSubtitle: content.heroSubtitle,
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
            this.errorMessage = 'Error creating page';
            console.error('Error creating page:', error);
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}

