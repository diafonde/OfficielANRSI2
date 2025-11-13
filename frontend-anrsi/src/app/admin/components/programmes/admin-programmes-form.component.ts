import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface Programme {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  icon: string;
  color: string;
  details?: string;
}

interface ProgrammesContent {
  heroTitle: string;
  heroSubtitle: string;
  programmes: Programme[];
  ctaTitle?: string;
  ctaDescription?: string;
}

@Component({
  selector: 'app-admin-programmes-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-programmes-form.component.html',
  styleUrls: ['./admin-programmes-form.component.scss']
})
export class AdminProgrammesFormComponent implements OnInit {
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
      heroTitle: ['Programmes', Validators.required],
      heroSubtitle: ['Programmes de l\'Agence', Validators.required],
      programmes: this.fb.array([]),
      ctaTitle: ['Intéressé par nos programmes ?'],
      ctaDescription: ['Découvrez comment participer à nos programmes de recherche et d\'innovation']
    });
  }

  // Programmes FormArray methods
  get programmes(): FormArray {
    return this.form.get('programmes') as FormArray;
  }

  addProgramme(item?: Programme): void {
    const group = this.fb.group({
      id: [item?.id || '', Validators.required],
      name: [item?.name || '', Validators.required],
      description: [item?.description || '', Validators.required],
      objectives: this.fb.array(item?.objectives?.map(o => this.fb.control(o)) || []),
      icon: [item?.icon || 'fas fa-university', Validators.required],
      color: [item?.color || '#0a3d62', Validators.required],
      details: [item?.details || '']
    });
    this.programmes.push(group);
  }

  removeProgramme(index: number): void {
    this.programmes.removeAt(index);
  }

  getProgrammeObjectives(index: number): FormArray {
    return this.programmes.at(index).get('objectives') as FormArray;
  }

  addProgrammeObjective(programmeIndex: number, value = ''): void {
    this.getProgrammeObjectives(programmeIndex).push(this.fb.control(value, Validators.required));
  }

  removeProgrammeObjective(programmeIndex: number, objectiveIndex: number): void {
    this.getProgrammeObjectives(programmeIndex).removeAt(objectiveIndex);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('programmes').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: ProgrammesContent = JSON.parse(page.content);
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
      heroTitle: 'Programmes',
      heroSubtitle: 'Programmes de l\'Agence',
      ctaTitle: 'Intéressé par nos programmes ?',
      ctaDescription: 'Découvrez comment participer à nos programmes de recherche et d\'innovation'
    });

    // Clear existing array
    while (this.programmes.length) this.programmes.removeAt(0);

    // Add default programmes
    this.addProgramme({
      id: 'temkin',
      name: 'Programme Temkin (Autonomisation)',
      description: 'Programme d\'autonomisation des structures de recherche',
      objectives: [
        'Garantir le fonctionnement des structures de recherche (SR) reconnues',
        'Encourager la culture de mutualisation des moyens',
        'Briser l\'isolement des chercheurs',
        'Renforcer les capacités des Etablissements d\'Enseignement Supérieur et de Recherche et des chercheurs en matière de pilotage et de gouvernance de la recherche'
      ],
      icon: 'fas fa-university',
      color: '#0a3d62'
    });
    this.addProgramme({
      id: 'temeyouz',
      name: 'Programme Temeyouz (Excellence)',
      description: 'Programme d\'excellence scientifique pour les jeunes chercheurs',
      objectives: [
        'Soutenir l\'excellence scientifique chez les jeunes chercheurs',
        'Encourager les doctorants à consacrer leur plein temps à leurs thèses',
        'Accroitre la production scientifique nationale et améliorer sa visibilité',
        'Inciter et motiver l\'encadrement et la production scientifique',
        'Développer la créativité et l\'esprit d\'entreprise chez les jeunes chercheurs'
      ],
      icon: 'fas fa-graduation-cap',
      color: '#20a39e'
    });
    this.addProgramme({
      id: 'tethmin',
      name: 'Programme Tethmin (Valorisation)',
      description: 'Programme de valorisation de la recherche scientifique',
      objectives: [
        'Assurer la diffusion et le partage du savoir',
        'Faire connaitre les thématiques de recherche des Structures de Recherche',
        'Consolider le réseautage des chercheurs autour des thématiques prioritaires',
        'Promouvoir la visibilité de la production scientifique nationale',
        'Appuyer la mise en place des structures de valorisation de la recherche (incubateurs)',
        'Protéger la propriété intellectuelle'
      ],
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    });
    this.addProgramme({
      id: 'temm',
      name: 'Programme TEMM pour le développement local',
      description: 'Programme de développement local et d\'industrialisation',
      objectives: [
        'Concevoir et financer des projets pilotes dans des domaines spécifiques de développement local',
        'Démontrer et exploiter les grandes potentialités du pays',
        'Encourager les investissements dans l\'industrialisation et la recherche scientifique',
        'Collaborer avec les partenaires techniques et scientifiques'
      ],
      details: 'Le programme TEMM parmi les programmes le plus récent adopté par le Conseil d\'Administration de l\'ANRSI. Ce programme conçoit et finance des projets pilotes dans des domaines spécifiques de développement local en vue de démontrer et exploiter les grandes potentialités du pays et d\'encourager les investissements dans l\'industrialisation et la recherche scientifique avec les partenaires techniques et scientifiques. Le premier projet de ce programme portera sur les cultures maraichères abritées, leur production, leur conservation et leur transformation, a été démarré effectivement dans le cadre de la convention signée le 04 novembre 2021 entre l\'ANRSI et L\'ISET.',
      icon: 'fas fa-industry',
      color: '#126564'
    });
  }

  populateForm(content: ProgrammesContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Programmes',
      heroSubtitle: content.heroSubtitle || 'Programmes de l\'Agence',
      ctaTitle: content.ctaTitle || 'Intéressé par nos programmes ?',
      ctaDescription: content.ctaDescription || 'Découvrez comment participer à nos programmes de recherche et d\'innovation'
    });

    // Clear existing array
    while (this.programmes.length) this.programmes.removeAt(0);

    // Populate array
    content.programmes?.forEach(programme => this.addProgramme(programme));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: ProgrammesContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        programmes: formValue.programmes.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          objectives: p.objectives,
          icon: p.icon,
          color: p.color,
          details: p.details || undefined
        })),
        ctaTitle: formValue.ctaTitle,
        ctaDescription: formValue.ctaDescription
      };

      const updateData: PageUpdateDTO = {
        title: 'Programmes',
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
          slug: 'programmes',
          title: 'Programmes',
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

