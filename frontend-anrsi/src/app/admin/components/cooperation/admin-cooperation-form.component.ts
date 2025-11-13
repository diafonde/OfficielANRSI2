import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface Partnership {
  id: string;
  title: string;
  description: string;
  type: string;
  country: string;
  flag: string;
  objectives: string[];
  status: string;
  icon: string;
  color: string;
  details?: string;
}

interface CooperationInfo {
  title: string;
  description: string;
  benefits: string[];
}

interface CooperationContent {
  cooperationInfo: CooperationInfo;
  partnerships: Partnership[];
}

@Component({
  selector: 'app-admin-cooperation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-cooperation-form.component.html',
  styleUrls: ['./admin-cooperation-form.component.scss']
})
export class AdminCooperationFormComponent implements OnInit {
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
      cooperationInfo: this.fb.group({
        title: ['Coopération & Partenariats', Validators.required],
        description: ['', Validators.required],
        benefits: this.fb.array([])
      }),
      partnerships: this.fb.array([])
    });
  }

  // Cooperation Info FormGroup methods
  get cooperationInfo(): FormGroup {
    return this.form.get('cooperationInfo') as FormGroup;
  }

  get benefits(): FormArray {
    return this.cooperationInfo.get('benefits') as FormArray;
  }

  addBenefit(value = ''): void {
    this.benefits.push(this.fb.control(value, Validators.required));
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  // Partnerships FormArray methods
  get partnerships(): FormArray {
    return this.form.get('partnerships') as FormArray;
  }

  addPartnership(item?: Partnership): void {
    const group = this.fb.group({
      id: [item?.id || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      type: [item?.type || '', Validators.required],
      country: [item?.country || '', Validators.required],
      flag: [item?.flag || '', Validators.required],
      objectives: this.fb.array(item?.objectives?.map(o => this.fb.control(o)) || []),
      status: [item?.status || 'Actif', Validators.required],
      icon: [item?.icon || 'fas fa-handshake', Validators.required],
      color: [item?.color || '#0a3d62', Validators.required],
      details: [item?.details || '']
    });
    this.partnerships.push(group);
  }

  removePartnership(index: number): void {
    this.partnerships.removeAt(index);
  }

  getPartnershipObjectives(index: number): FormArray {
    return this.partnerships.at(index).get('objectives') as FormArray;
  }

  addPartnershipObjective(partnershipIndex: number, value = ''): void {
    this.getPartnershipObjectives(partnershipIndex).push(this.fb.control(value, Validators.required));
  }

  removePartnershipObjective(partnershipIndex: number, objectiveIndex: number): void {
    this.getPartnershipObjectives(partnershipIndex).removeAt(objectiveIndex);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('cooperation').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: CooperationContent = JSON.parse(page.content);
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
    this.cooperationInfo.patchValue({
      title: 'Coopération & Partenariats',
      description: 'L\'Agence est liée à des institutions d\'intérêt commun par le biais d\'accords de coopération et de partenariat pour atteindre des objectifs communs.'
    });

    // Clear existing arrays
    while (this.benefits.length) this.benefits.removeAt(0);
    while (this.partnerships.length) this.partnerships.removeAt(0);

    // Add default benefits
    this.addBenefit('Renforcement des capacités de recherche');
    this.addBenefit('Échange d\'expertise et de connaissances');
    this.addBenefit('Développement de projets innovants');
    this.addBenefit('Mise en réseau des chercheurs');
    this.addBenefit('Valorisation des résultats de recherche');
    this.addBenefit('Transfert de technologie');

    // Add default partnerships
    this.addPartnership({
      id: 'anrsa-senegal',
      title: 'Convention de partenariat avec l\'ANRSA Sénégal',
      description: 'Partenariat stratégique avec l\'Agence Nationale de la Recherche Scientifique Appliquée du Sénégal',
      type: 'Partenariat',
      country: 'Sénégal',
      flag: '🇸🇳',
      objectives: [
        'Échange d\'expertise en recherche scientifique',
        'Collaboration sur des projets communs',
        'Renforcement des capacités de recherche',
        'Partage des ressources et infrastructures'
      ],
      status: 'Actif',
      icon: 'fas fa-handshake',
      color: '#0a3d62'
    });
    this.addPartnership({
      id: 'cnrst-maroc',
      title: 'Convention de coopération avec le CNRST Maroc',
      description: 'Coopération avec le Centre National de la Recherche Scientifique et Technique du Maroc',
      type: 'Coopération',
      country: 'Maroc',
      flag: '🇲🇦',
      objectives: [
        'Développement de projets de recherche conjoints',
        'Formation et échange de chercheurs',
        'Valorisation des résultats de recherche',
        'Innovation technologique'
      ],
      status: 'Actif',
      icon: 'fas fa-microscope',
      color: '#20a39e'
    });
    this.addPartnership({
      id: 'tunisie-dri',
      title: 'Partenariat avec le DRI Tunisie',
      description: 'Collaboration avec le Département de la Recherche Scientifique et de l\'Innovation en Tunisie',
      type: 'Partenariat',
      country: 'Tunisie',
      flag: '🇹🇳',
      objectives: [
        'Recherche appliquée et innovation',
        'Transfert de technologie',
        'Formation spécialisée',
        'Développement de solutions innovantes'
      ],
      status: 'Actif',
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    });
    this.addPartnership({
      id: 'iset-rosso',
      title: 'Partenariat avec l\'ISET Rosso',
      description: 'Collaboration avec l\'Institut Supérieur d\'Enseignement Technologique de Rosso pour la production de légumes protégés',
      type: 'Partenariat Local',
      country: 'Mauritanie',
      flag: '🇲🇷',
      objectives: [
        'Production de légumes protégés',
        'Techniques agricoles innovantes',
        'Formation technique spécialisée',
        'Développement agricole local'
      ],
      details: 'Ce partenariat local vise à développer des techniques innovantes pour la production de légumes protégés, contribuant ainsi au développement agricole et à la sécurité alimentaire en Mauritanie.',
      status: 'Actif',
      icon: 'fas fa-seedling',
      color: '#126564'
    });
  }

  populateForm(content: CooperationContent): void {
    this.cooperationInfo.patchValue({
      title: content.cooperationInfo?.title || 'Coopération & Partenariats',
      description: content.cooperationInfo?.description || ''
    });

    // Clear existing arrays
    while (this.benefits.length) this.benefits.removeAt(0);
    while (this.partnerships.length) this.partnerships.removeAt(0);

    // Populate arrays
    content.cooperationInfo?.benefits?.forEach(benefit => this.addBenefit(benefit));
    content.partnerships?.forEach(partnership => this.addPartnership(partnership));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: CooperationContent = {
        cooperationInfo: {
          title: formValue.cooperationInfo.title,
          description: formValue.cooperationInfo.description,
          benefits: formValue.cooperationInfo.benefits
        },
        partnerships: formValue.partnerships.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.type,
          country: p.country,
          flag: p.flag,
          objectives: p.objectives,
          status: p.status,
          icon: p.icon,
          color: p.color,
          details: p.details || undefined
        }))
      };

      const updateData: PageUpdateDTO = {
        title: 'Coopération & Partenariats',
        heroTitle: content.cooperationInfo.title,
        heroSubtitle: content.cooperationInfo.description,
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
          slug: 'cooperation',
          title: 'Coopération & Partenariats',
          heroTitle: content.cooperationInfo.title,
          heroSubtitle: content.cooperationInfo.description,
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

