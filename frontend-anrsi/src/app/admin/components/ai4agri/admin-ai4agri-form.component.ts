import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface WorkshopItem {
  date: string;
  title: string;
  description: string;
  detailsTitle?: string;
  detailsItems: string[];
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface PartnershipHighlight {
  icon: string;
  title: string;
  description: string;
}

interface Ai4agriContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  workshops: WorkshopItem[];
  benefits: BenefitItem[];
  partnershipText: string;
  partnershipHighlights: PartnershipHighlight[];
}

@Component({
  selector: 'app-admin-ai4agri-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-ai4agri-form.component.html',
  styleUrls: ['./admin-ai4agri-form.component.scss']
})
export class AdminAi4agriFormComponent implements OnInit {
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
      heroTitle: ['AI 4 AGRI', Validators.required],
      heroSubtitle: ['Intelligence Artificielle pour l\'Agriculture de Précision', Validators.required],
      introText: ['', Validators.required],
      workshops: this.fb.array([]),
      benefits: this.fb.array([]),
      partnershipText: ['', Validators.required],
      partnershipHighlights: this.fb.array([])
    });
  }

  // Workshops FormArray methods
  get workshops(): FormArray {
    return this.form.get('workshops') as FormArray;
  }

  addWorkshop(item?: WorkshopItem): void {
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      detailsTitle: [item?.detailsTitle || ''],
      detailsItems: this.fb.array(item?.detailsItems?.map(i => this.fb.control(i)) || [])
    });
    this.workshops.push(group);
  }

  removeWorkshop(index: number): void {
    this.workshops.removeAt(index);
  }

  getWorkshopDetailsItems(index: number): FormArray {
    return this.workshops.at(index).get('detailsItems') as FormArray;
  }

  addWorkshopDetailItem(workshopIndex: number, value = ''): void {
    this.getWorkshopDetailsItems(workshopIndex).push(this.fb.control(value));
  }

  removeWorkshopDetailItem(workshopIndex: number, itemIndex: number): void {
    this.getWorkshopDetailsItems(workshopIndex).removeAt(itemIndex);
  }

  // Benefits FormArray methods
  get benefits(): FormArray {
    return this.form.get('benefits') as FormArray;
  }

  addBenefit(item?: BenefitItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '🌱', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.benefits.push(group);
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  // Partnership Highlights FormArray methods
  get partnershipHighlights(): FormArray {
    return this.form.get('partnershipHighlights') as FormArray;
  }

  addPartnershipHighlight(item?: PartnershipHighlight): void {
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.partnershipHighlights.push(group);
  }

  removePartnershipHighlight(index: number): void {
    this.partnershipHighlights.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('ai4agri').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: Ai4agriContent = JSON.parse(page.content);
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
      heroTitle: 'AI 4 AGRI',
      heroSubtitle: 'Intelligence Artificielle pour l\'Agriculture de Précision',
      introText: 'L\'ANRSI organise des ateliers internationaux sur l\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire.',
      partnershipText: 'L\'ANRSI collabore avec des institutions internationales et des experts en IA pour développer des solutions innovantes pour l\'agriculture mauritanienne.'
    });

    // Add default workshops
    this.addWorkshop({
      date: '13-15 Février 2024',
      title: 'Ouverture de l\'atelier international sur les applications de l\'IA dans l\'agriculture',
      description: 'Atelier International sur "L\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire"',
      detailsTitle: 'Programme AI 4 AGRI 13-15 Février 2024',
      detailsItems: [
        'Présentations sur l\'IA agricole',
        'Échantillons de présentations',
        'Démonstrations pratiques',
        'Réseautage et collaboration'
      ]
    });
    this.addWorkshop({
      date: 'Février 2024',
      title: 'AI 4 Agri - Initiative Continue',
      description: 'Programme continu de développement et d\'application de l\'IA dans le secteur agricole mauritanien.',
      detailsTitle: 'Objectifs du Programme',
      detailsItems: [
        'Moderniser l\'agriculture grâce à l\'IA',
        'Améliorer la productivité agricole',
        'Renforcer la sécurité alimentaire',
        'Former les agriculteurs aux nouvelles technologies'
      ]
    });

    // Add default benefits
    this.addBenefit({ icon: '🌱', title: 'Agriculture de Précision', description: 'Optimisation des ressources et augmentation des rendements grâce à l\'analyse de données précises.' });
    this.addBenefit({ icon: '📊', title: 'Analyse Prédictive', description: 'Prédiction des conditions météorologiques et des maladies pour une meilleure planification.' });
    this.addBenefit({ icon: '🤖', title: 'Automatisation', description: 'Robotisation des tâches agricoles pour améliorer l\'efficacité et réduire les coûts.' });
    this.addBenefit({ icon: '🌍', title: 'Développement Durable', description: 'Promotion d\'une agriculture respectueuse de l\'environnement et durable.' });

    // Add default partnership highlights
    this.addPartnershipHighlight({ icon: '🔬', title: 'Recherche et Développement', description: 'Collaboration avec des centres de recherche internationaux spécialisés en IA agricole.' });
    this.addPartnershipHighlight({ icon: '🎓', title: 'Formation et Éducation', description: 'Programmes de formation pour les agriculteurs et les professionnels du secteur.' });
    this.addPartnershipHighlight({ icon: '🤝', title: 'Coopération Internationale', description: 'Échange d\'expertise et de technologies avec des partenaires internationaux.' });
  }

  populateForm(content: Ai4agriContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      introText: content.introText,
      partnershipText: content.partnershipText
    });

    // Clear existing arrays
    while (this.workshops.length) this.workshops.removeAt(0);
    while (this.benefits.length) this.benefits.removeAt(0);
    while (this.partnershipHighlights.length) this.partnershipHighlights.removeAt(0);

    // Populate arrays
    content.workshops?.forEach(item => this.addWorkshop(item));
    content.benefits?.forEach(item => this.addBenefit(item));
    content.partnershipHighlights?.forEach(item => this.addPartnershipHighlight(item));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: Ai4agriContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introText: formValue.introText,
        workshops: formValue.workshops.map((item: any) => ({
          date: item.date,
          title: item.title,
          description: item.description,
          detailsTitle: item.detailsTitle,
          detailsItems: item.detailsItems
        })),
        benefits: formValue.benefits,
        partnershipText: formValue.partnershipText,
        partnershipHighlights: formValue.partnershipHighlights
      };

      const updateData: PageUpdateDTO = {
        title: 'AI 4 AGRI',
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
          slug: 'ai4agri',
          title: 'AI 4 AGRI',
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

