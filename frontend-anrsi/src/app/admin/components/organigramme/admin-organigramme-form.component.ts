import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface Position {
  icon: string;
  title: string;
  description: string;
  isDirector?: boolean;
}

interface Level {
  levelNumber: number;
  positions: Position[];
}

interface Responsibility {
  icon: string;
  title: string;
  description: string;
}

interface OrganigrammeContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  levels: Level[];
  responsibilitiesTitle: string;
  responsibilities: Responsibility[];
}

@Component({
  selector: 'app-admin-organigramme-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-organigramme-form.component.html',
  styleUrls: ['./admin-organigramme-form.component.scss']
})
export class AdminOrganigrammeFormComponent implements OnInit {
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
      heroTitle: ['Organigramme', Validators.required],
      heroSubtitle: ['Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation', Validators.required],
      sectionTitle: ['Structure Organisationnelle', Validators.required],
      introText: ['', Validators.required],
      levels: this.fb.array([]),
      responsibilitiesTitle: ['Responsabilités Clés', Validators.required],
      responsibilities: this.fb.array([])
    });
  }

  // Levels FormArray methods
  get levels(): FormArray {
    return this.form.get('levels') as FormArray;
  }

  addLevel(level?: Level): void {
    const levelGroup = this.fb.group({
      levelNumber: [level?.levelNumber || this.levels.length + 1, Validators.required],
      positions: this.fb.array([])
    });
    
    if (level?.positions) {
      level.positions.forEach(position => {
        this.addPositionToLevel(levelGroup, position);
      });
    }
    
    this.levels.push(levelGroup);
  }

  getLevelPositions(levelIndex: number): FormArray {
    return this.levels.at(levelIndex).get('positions') as FormArray;
  }

  addPositionToLevel(levelGroup: FormGroup, position?: Position): void {
    const positions = levelGroup.get('positions') as FormArray;
    const positionGroup = this.fb.group({
      icon: [position?.icon || '', Validators.required],
      title: [position?.title || '', Validators.required],
      description: [position?.description || '', Validators.required],
      isDirector: [position?.isDirector || false]
    });
    positions.push(positionGroup);
  }

  removePositionFromLevel(levelIndex: number, positionIndex: number): void {
    const positions = this.getLevelPositions(levelIndex);
    positions.removeAt(positionIndex);
  }

  removeLevel(index: number): void {
    this.levels.removeAt(index);
    // Update level numbers
    this.updateLevelNumbers();
  }

  updateLevelNumbers(): void {
    this.levels.controls.forEach((control, index) => {
      control.patchValue({ levelNumber: index + 1 }, { emitEvent: false });
    });
  }

  // Responsibilities FormArray methods
  get responsibilities(): FormArray {
    return this.form.get('responsibilities') as FormArray;
  }

  addResponsibility(item?: Responsibility): void {
    const group = this.fb.group({
      icon: [item?.icon || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.responsibilities.push(group);
  }

  removeResponsibility(index: number): void {
    this.responsibilities.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('organigramme').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: OrganigrammeContent = JSON.parse(page.content);
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
      heroTitle: 'Organigramme',
      heroSubtitle: 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Structure Organisationnelle',
      introText: 'L\'ANRSI est structurée de manière hiérarchique pour assurer une gestion efficace de la recherche scientifique et de l\'innovation en Mauritanie.',
      responsibilitiesTitle: 'Responsabilités Clés'
    });

    // Clear existing arrays
    while (this.levels.length) this.levels.removeAt(0);
    while (this.responsibilities.length) this.responsibilities.removeAt(0);

    // Add default levels
    const level1 = this.fb.group({
      levelNumber: [1, Validators.required],
      positions: this.fb.array([])
    });
    this.addPositionToLevel(level1, {
      icon: '👑',
      title: 'Haut Conseil de la Recherche Scientifique et de l\'Innovation',
      description: 'Présidé par Son Excellence le Premier Ministre',
      isDirector: true
    });
    this.levels.push(level1);

    const level2 = this.fb.group({
      levelNumber: [2, Validators.required],
      positions: this.fb.array([])
    });
    this.addPositionToLevel(level2, {
      icon: '👔',
      title: 'Direction Générale',
      description: 'Directeur Général de l\'ANRSI',
      isDirector: true
    });
    this.levels.push(level2);

    const level3 = this.fb.group({
      levelNumber: [3, Validators.required],
      positions: this.fb.array([])
    });
    this.addPositionToLevel(level3, {
      icon: '🔬',
      title: 'Direction de la Recherche',
      description: 'Gestion des programmes de recherche',
      isDirector: false
    });
    this.addPositionToLevel(level3, {
      icon: '💡',
      title: 'Direction de l\'Innovation',
      description: 'Promotion de l\'innovation technologique',
      isDirector: false
    });
    this.addPositionToLevel(level3, {
      icon: '💰',
      title: 'Direction Financière',
      description: 'Gestion des fonds et budgets',
      isDirector: false
    });
    this.levels.push(level3);

    const level4 = this.fb.group({
      levelNumber: [4, Validators.required],
      positions: this.fb.array([])
    });
    this.addPositionToLevel(level4, {
      icon: '📊',
      title: 'Service d\'Évaluation',
      description: 'Suivi et évaluation des projets',
      isDirector: false
    });
    this.addPositionToLevel(level4, {
      icon: '🤝',
      title: 'Service de Coopération',
      description: 'Partenariats internationaux',
      isDirector: false
    });
    this.addPositionToLevel(level4, {
      icon: '📋',
      title: 'Service Administratif',
      description: 'Gestion administrative',
      isDirector: false
    });
    this.addPositionToLevel(level4, {
      icon: '💻',
      title: 'Service Informatique',
      description: 'Support technique et numérique',
      isDirector: false
    });
    this.levels.push(level4);

    // Add default responsibilities
    this.addResponsibility({
      icon: '🎯',
      title: 'Définition des Priorités',
      description: 'Le Haut Conseil définit les priorités nationales de recherche et d\'innovation'
    });
    this.addResponsibility({
      icon: '📝',
      title: 'Appels à Projets',
      description: 'L\'ANRSI lance des appels à projets selon les priorités définies'
    });
    this.addResponsibility({
      icon: '💼',
      title: 'Gestion des Fonds',
      description: 'Allocation transparente et efficace des fonds de recherche'
    });
    this.addResponsibility({
      icon: '📈',
      title: 'Suivi et Évaluation',
      description: 'Monitoring continu des projets financés et évaluation de leur impact'
    });
  }

  populateForm(content: OrganigrammeContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Organigramme',
      heroSubtitle: content.heroSubtitle || 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: content.sectionTitle || 'Structure Organisationnelle',
      introText: content.introText || '',
      responsibilitiesTitle: content.responsibilitiesTitle || 'Responsabilités Clés'
    });

    // Clear existing arrays
    while (this.levels.length) this.levels.removeAt(0);
    while (this.responsibilities.length) this.responsibilities.removeAt(0);

    // Populate levels
    content.levels?.forEach(level => {
      const levelGroup = this.fb.group({
        levelNumber: [level.levelNumber, Validators.required],
        positions: this.fb.array([])
      });
      level.positions?.forEach(position => {
        this.addPositionToLevel(levelGroup, position);
      });
      this.levels.push(levelGroup);
    });

    // Populate responsibilities
    content.responsibilities?.forEach(responsibility => this.addResponsibility(responsibility));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: OrganigrammeContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        sectionTitle: formValue.sectionTitle,
        introText: formValue.introText,
        levels: formValue.levels.map((level: any) => ({
          levelNumber: level.levelNumber,
          positions: level.positions
        })),
        responsibilitiesTitle: formValue.responsibilitiesTitle,
        responsibilities: formValue.responsibilities
      };

      const updateData: PageUpdateDTO = {
        title: 'Organigramme',
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
          slug: 'organigramme',
          title: 'Organigramme',
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



