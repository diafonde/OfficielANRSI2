import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

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
  selector: 'app-admin-objectives-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-objectives-form.component.html',
  styleUrls: ['./admin-objectives-form.component.scss']
})
export class AdminObjectivesFormComponent implements OnInit {
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
      heroTitle: ['Objectifs', Validators.required],
      heroSubtitle: ['Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation', Validators.required],
      sectionTitle: ['Nos Objectifs', Validators.required],
      objectives: this.fb.array([])
    });
  }

  // Objectives FormArray methods
  get objectives(): FormArray {
    return this.form.get('objectives') as FormArray;
  }

  addObjective(item?: ObjectiveItem): void {
    const group = this.fb.group({
      number: [item?.number || this.objectives.length + 1, Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.objectives.push(group);
  }

  removeObjective(index: number): void {
    this.objectives.removeAt(index);
    // Update numbers after removal
    this.updateObjectiveNumbers();
  }

  updateObjectiveNumbers(): void {
    this.objectives.controls.forEach((control, index) => {
      control.patchValue({ number: index + 1 }, { emitEvent: false });
    });
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('objectives').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: ObjectivesContent = JSON.parse(page.content);
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
      heroTitle: 'Objectifs',
      heroSubtitle: 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Nos Objectifs'
    });

    // Clear existing array
    while (this.objectives.length) this.objectives.removeAt(0);

    // Add default objectives
    this.addObjective({
      number: 1,
      title: 'Accroître la production scientifique Nationale',
      description: 'L\'ANRSI vise à stimuler et augmenter significativement la production scientifique nationale en soutenant les chercheurs et les institutions de recherche.'
    });
    this.addObjective({
      number: 2,
      title: 'Améliorer l\'excellence et le rayonnement de la recherche scientifique en Mauritanie',
      description: 'Nous nous engageons à promouvoir l\'excellence dans la recherche scientifique et à renforcer le rayonnement international de la recherche mauritanienne.'
    });
    this.addObjective({
      number: 3,
      title: 'Améliorer l\'impact de la recherche et l\'innovation sur l\'économie, la société et le développement durable',
      description: 'L\'ANRSI travaille à maximiser l\'impact de la recherche et de l\'innovation sur le développement économique, social et durable de la Mauritanie.'
    });
    this.addObjective({
      number: 4,
      title: 'Accroître la capacité d\'innovation et de création de richesses de notre pays par et grâce à la recherche',
      description: 'Nous visons à renforcer les capacités d\'innovation nationales et à favoriser la création de richesses grâce aux résultats de la recherche scientifique.'
    });
  }

  populateForm(content: ObjectivesContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Objectifs',
      heroSubtitle: content.heroSubtitle || 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: content.sectionTitle || 'Nos Objectifs'
    });

    // Clear existing array
    while (this.objectives.length) this.objectives.removeAt(0);

    // Populate array
    content.objectives?.forEach(objective => this.addObjective(objective));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: ObjectivesContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        sectionTitle: formValue.sectionTitle,
        objectives: formValue.objectives
      };

      const updateData: PageUpdateDTO = {
        title: 'Objectifs',
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
          slug: 'objectives',
          title: 'Objectifs',
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

