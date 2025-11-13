import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface ResearchPriority {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface PrioritesRecherche2026Content {
  heroTitle: string;
  heroSubtitle: string;
  introParagraphs: string[];
  sectionTitle: string;
  researchPriorities: ResearchPriority[];
  publicationDate: string;
}

@Component({
  selector: 'app-admin-priorites-recherche-2026-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-priorites-recherche-2026-form.component.html',
  styleUrls: ['./admin-priorites-recherche-2026-form.component.scss']
})
export class AdminPrioritesRecherche2026FormComponent implements OnInit {
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
      heroTitle: ['LES PRIORITÉS DE LA RECHERCHE À L\'HORIZON 2026', Validators.required],
      heroSubtitle: ['L\'ANRSI définit les priorités de la recherche scientifique et de l\'innovation pour le développement national', Validators.required],
      introParagraphs: this.fb.array([]),
      sectionTitle: ['Les Sept Axes Stratégiques', Validators.required],
      researchPriorities: this.fb.array([]),
      publicationDate: ['', Validators.required]
    });
  }

  // Intro Paragraphs FormArray methods
  get introParagraphs(): FormArray {
    return this.form.get('introParagraphs') as FormArray;
  }

  addIntroParagraph(text?: string): void {
    const group = this.fb.group({
      text: [text || '', Validators.required]
    });
    this.introParagraphs.push(group);
  }

  removeIntroParagraph(index: number): void {
    this.introParagraphs.removeAt(index);
  }

  // Research Priorities FormArray methods
  get researchPriorities(): FormArray {
    return this.form.get('researchPriorities') as FormArray;
  }

  addResearchPriority(priority?: ResearchPriority): void {
    const group = this.fb.group({
      id: [priority?.id || this.researchPriorities.length + 1, Validators.required],
      title: [priority?.title || '', Validators.required],
      description: [priority?.description || '', Validators.required],
      icon: [priority?.icon || '', Validators.required]
    });
    this.researchPriorities.push(group);
  }

  removeResearchPriority(index: number): void {
    this.researchPriorities.removeAt(index);
    // Update IDs after removal
    this.updatePriorityIds();
  }

  updatePriorityIds(): void {
    this.researchPriorities.controls.forEach((control, index) => {
      control.patchValue({ id: index + 1 }, { emitEvent: false });
    });
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('priorites-recherche-2026').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: PrioritesRecherche2026Content = JSON.parse(page.content);
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
      heroTitle: 'LES PRIORITÉS DE LA RECHERCHE À L\'HORIZON 2026',
      heroSubtitle: 'L\'ANRSI définit les priorités de la recherche scientifique et de l\'innovation pour le développement national',
      sectionTitle: 'Les Sept Axes Stratégiques',
      publicationDate: '18 Janvier 2023'
    });

    // Clear existing arrays
    while (this.introParagraphs.length) this.introParagraphs.removeAt(0);
    while (this.researchPriorities.length) this.researchPriorities.removeAt(0);

    // Add default intro paragraphs
    this.addIntroParagraph('Se basant sur la stratégie nationale de la recherche scientifique et de l\'innovation adoptée par le Gouvernement, l\'Agence nationale de la recherche scientifique et de l\'innovation publie les détails des sept axes de ladite stratégie.');
    this.addIntroParagraph('Ces axes sont répartis suivant les besoins de développement et en réponse aux défis actuels, pour couvrir des domaines variés allant de l\'autosuffisance alimentaire à la digitalisation et les défis émergents avec l\'explosion de l\'intelligence artificielle, en passant par la santé, les industries extractives.');
    this.addIntroParagraph('Les recherches humaines et sociales occupent une place de choix dans ces axes, la stratégie leur ayant consacré deux axes à travers lesquels il est possible d\'œuvrer pour "la valorisation des savoirs autochtones ancestraux afin d\'affronter les enjeux sociétaux, de combattre la vulnérabilité, les disparités sociales et l\'exclusion et de consolider l\'unité nationale".');

    // Add default research priorities
    this.addResearchPriority({
      id: 1,
      title: 'Autosuffisance Alimentaire',
      description: 'Développement de stratégies pour assurer la sécurité alimentaire nationale et réduire la dépendance aux importations.',
      icon: 'fas fa-seedling'
    });
    this.addResearchPriority({
      id: 2,
      title: 'Digitalisation et Intelligence Artificielle',
      description: 'Intégration des technologies numériques et de l\'IA pour moderniser les secteurs économiques et améliorer l\'efficacité.',
      icon: 'fas fa-robot'
    });
    this.addResearchPriority({
      id: 3,
      title: 'Santé et Bien-être',
      description: 'Amélioration des systèmes de santé, prévention des maladies et promotion du bien-être de la population.',
      icon: 'fas fa-heartbeat'
    });
    this.addResearchPriority({
      id: 4,
      title: 'Industries Extractives',
      description: 'Optimisation de l\'exploitation des ressources naturelles de manière durable et responsable.',
      icon: 'fas fa-mountain'
    });
    this.addResearchPriority({
      id: 5,
      title: 'Recherches Humaines et Sociales I',
      description: 'Valorisation des savoirs autochtones ancestraux pour affronter les enjeux sociétaux contemporains.',
      icon: 'fas fa-users'
    });
    this.addResearchPriority({
      id: 6,
      title: 'Recherches Humaines et Sociales II',
      description: 'Combattre la vulnérabilité, les disparités sociales et l\'exclusion pour consolider l\'unité nationale.',
      icon: 'fas fa-hands-helping'
    });
    this.addResearchPriority({
      id: 7,
      title: 'Développement Durable',
      description: 'Promotion de pratiques respectueuses de l\'environnement et du développement durable à long terme.',
      icon: 'fas fa-leaf'
    });
  }

  populateForm(content: PrioritesRecherche2026Content): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'LES PRIORITÉS DE LA RECHERCHE À L\'HORIZON 2026',
      heroSubtitle: content.heroSubtitle || 'L\'ANRSI définit les priorités de la recherche scientifique et de l\'innovation pour le développement national',
      sectionTitle: content.sectionTitle || 'Les Sept Axes Stratégiques',
      publicationDate: content.publicationDate || ''
    });

    // Clear existing arrays
    while (this.introParagraphs.length) this.introParagraphs.removeAt(0);
    while (this.researchPriorities.length) this.researchPriorities.removeAt(0);

    // Populate arrays
    content.introParagraphs?.forEach(paragraph => this.addIntroParagraph(paragraph));
    content.researchPriorities?.forEach(priority => this.addResearchPriority(priority));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: PrioritesRecherche2026Content = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introParagraphs: formValue.introParagraphs.map((p: any) => p.text),
        sectionTitle: formValue.sectionTitle,
        researchPriorities: formValue.researchPriorities,
        publicationDate: formValue.publicationDate
      };

      const updateData: PageUpdateDTO = {
        title: 'Priorités de la Recherche 2026',
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
          slug: 'priorites-recherche-2026',
          title: 'Priorités de la Recherche 2026',
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

