import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

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
  selector: 'app-admin-financement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-financement-form.component.html',
  styleUrls: ['./admin-financement-form.component.scss']
})
export class AdminFinancementFormComponent implements OnInit {
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
      heroTitle: ['Financement', Validators.required],
      heroSubtitle: ['', Validators.required],
      process: this.fb.array([]),
      requirements: this.fb.array([]),
      benefits: this.fb.array([]),
      ctaTitle: ['Prêt à candidater ?'],
      ctaDescription: ['Consultez nos appels à candidatures et soumettez votre projet']
    });
  }

  // Process Steps FormArray methods
  get process(): FormArray {
    return this.form.get('process') as FormArray;
  }

  addProcessStep(step?: ProcessStep): void {
    const group = this.fb.group({
      step: [step?.step || this.process.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required],
      icon: [step?.icon || 'fas fa-search', Validators.required]
    });
    this.process.push(group);
  }

  removeProcessStep(index: number): void {
    this.process.removeAt(index);
    this.process.controls.forEach((control, i) => {
      control.patchValue({ step: i + 1 });
    });
  }

  // Requirements FormArray methods
  get requirements(): FormArray {
    return this.form.get('requirements') as FormArray;
  }

  addRequirement(value = ''): void {
    this.requirements.push(this.fb.control(value, Validators.required));
  }

  removeRequirement(index: number): void {
    this.requirements.removeAt(index);
  }

  // Benefits FormArray methods
  get benefits(): FormArray {
    return this.form.get('benefits') as FormArray;
  }

  addBenefit(value = ''): void {
    this.benefits.push(this.fb.control(value, Validators.required));
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('financement').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: FinancementContent = JSON.parse(page.content);
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
      heroTitle: 'Financement',
      heroSubtitle: 'L\'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s\'inscrivent dans le cadre des programmes de l\'Agence qui sont annoncés annuellement.',
      ctaTitle: 'Prêt à candidater ?',
      ctaDescription: 'Consultez nos appels à candidatures et soumettez votre projet'
    });

    // Clear existing arrays
    while (this.process.length) this.process.removeAt(0);
    while (this.requirements.length) this.requirements.removeAt(0);
    while (this.benefits.length) this.benefits.removeAt(0);

    // Add default process steps
    this.addProcessStep({ step: 1, title: 'Identifier le programme', description: 'Le candidat doit identifier le programme adapté à son activité', icon: 'fas fa-search' });
    this.addProcessStep({ step: 2, title: 'Respecter les délais', description: 'Respecter les délais et conditions de candidature publiés sur le site internet de l\'Agence', icon: 'fas fa-clock' });
    this.addProcessStep({ step: 3, title: 'Consulter la réglementation', description: 'Consulter l\'arrêté ministériel réglementant le financement pour plus de détails', icon: 'fas fa-file-alt' });

    // Add default requirements
    this.addRequirement('Être une structure de recherche reconnue');
    this.addRequirement('Avoir un projet conforme aux programmes de l\'ANRSI');
    this.addRequirement('Respecter les délais de candidature');
    this.addRequirement('Fournir tous les documents requis');
    this.addRequirement('Justifier de la pertinence scientifique du projet');

    // Add default benefits
    this.addBenefit('Financement des activités de recherche scientifique');
    this.addBenefit('Soutien aux projets innovants');
    this.addBenefit('Accompagnement dans la réalisation des projets');
    this.addBenefit('Mise en réseau avec d\'autres chercheurs');
    this.addBenefit('Valorisation des résultats de recherche');
  }

  populateForm(content: FinancementContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Financement',
      heroSubtitle: content.heroSubtitle || '',
      ctaTitle: content.ctaTitle || 'Prêt à candidater ?',
      ctaDescription: content.ctaDescription || 'Consultez nos appels à candidatures et soumettez votre projet'
    });

    // Clear existing arrays
    while (this.process.length) this.process.removeAt(0);
    while (this.requirements.length) this.requirements.removeAt(0);
    while (this.benefits.length) this.benefits.removeAt(0);

    // Populate arrays
    content.process?.forEach(step => this.addProcessStep(step));
    content.requirements?.forEach(req => this.addRequirement(req));
    content.benefits?.forEach(benefit => this.addBenefit(benefit));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: FinancementContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        process: formValue.process,
        requirements: formValue.requirements,
        benefits: formValue.benefits,
        ctaTitle: formValue.ctaTitle,
        ctaDescription: formValue.ctaDescription
      };

      const updateData: PageUpdateDTO = {
        title: 'Financement',
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
          slug: 'financement',
          title: 'Financement',
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

