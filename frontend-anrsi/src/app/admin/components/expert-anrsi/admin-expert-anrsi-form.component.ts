import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface RequirementItem {
  icon: string;
  title: string;
  items: string[];
}

interface DomainItem {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ExpertAnrsiContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  requirements: RequirementItem[];
  domains: DomainItem[];
  processSteps: ProcessStep[];
  benefits: BenefitItem[];
  applicationText: string;
  contactInfo: ContactItem[];
  requiredDocuments: string[];
}

@Component({
  selector: 'app-admin-expert-anrsi-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-expert-anrsi-form.component.html',
  styleUrls: ['./admin-expert-anrsi-form.component.scss']
})
export class AdminExpertAnrsiFormComponent implements OnInit {
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
      heroTitle: ['Expert à l\'ANRSI', Validators.required],
      heroSubtitle: ['Rejoignez notre réseau d\'experts scientifiques et technologiques', Validators.required],
      introText: ['', Validators.required],
      requirements: this.fb.array([]),
      domains: this.fb.array([]),
      processSteps: this.fb.array([]),
      benefits: this.fb.array([]),
      applicationText: ['', Validators.required],
      contactInfo: this.fb.array([]),
      requiredDocuments: this.fb.array([])
    });
  }

  // Requirements FormArray methods
  get requirements(): FormArray {
    return this.form.get('requirements') as FormArray;
  }

  addRequirement(item?: RequirementItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '🎓', Validators.required],
      title: [item?.title || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    this.requirements.push(group);
  }

  removeRequirement(index: number): void {
    this.requirements.removeAt(index);
  }

  getRequirementItems(index: number): FormArray {
    return this.requirements.at(index).get('items') as FormArray;
  }

  addRequirementItem(requirementIndex: number, value = ''): void {
    this.getRequirementItems(requirementIndex).push(this.fb.control(value));
  }

  removeRequirementItem(requirementIndex: number, itemIndex: number): void {
    this.getRequirementItems(requirementIndex).removeAt(itemIndex);
  }

  // Domains FormArray methods
  get domains(): FormArray {
    return this.form.get('domains') as FormArray;
  }

  addDomain(item?: DomainItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.domains.push(group);
  }

  removeDomain(index: number): void {
    this.domains.removeAt(index);
  }

  // Process Steps FormArray methods
  get processSteps(): FormArray {
    return this.form.get('processSteps') as FormArray;
  }

  addProcessStep(step?: ProcessStep): void {
    const group = this.fb.group({
      number: [step?.number || this.processSteps.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required]
    });
    this.processSteps.push(group);
  }

  removeProcessStep(index: number): void {
    this.processSteps.removeAt(index);
    this.processSteps.controls.forEach((control, i) => {
      control.patchValue({ number: i + 1 });
    });
  }

  // Benefits FormArray methods
  get benefits(): FormArray {
    return this.form.get('benefits') as FormArray;
  }

  addBenefit(item?: BenefitItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '💼', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.benefits.push(group);
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  // Contact Info FormArray methods
  get contactInfo(): FormArray {
    return this.form.get('contactInfo') as FormArray;
  }

  addContactItem(item?: ContactItem): void {
    const group = this.fb.group({
      icon: [item?.icon || 'fas fa-envelope', Validators.required],
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
    this.contactInfo.push(group);
  }

  removeContactItem(index: number): void {
    this.contactInfo.removeAt(index);
  }

  // Required Documents FormArray methods
  get requiredDocuments(): FormArray {
    return this.form.get('requiredDocuments') as FormArray;
  }

  addRequiredDocument(value = ''): void {
    this.requiredDocuments.push(this.fb.control(value));
  }

  removeRequiredDocument(index: number): void {
    this.requiredDocuments.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('expert-anrsi').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: ExpertAnrsiContent = JSON.parse(page.content);
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
      heroTitle: 'Expert à l\'ANRSI',
      heroSubtitle: 'Rejoignez notre réseau d\'experts scientifiques et technologiques',
      introText: 'L\'Agence Nationale de la Recherche Scientifique et de l\'Innovation (ANRSI) recrute des experts qualifiés pour évaluer les projets de recherche et contribuer au développement scientifique de la Mauritanie.',
      applicationText: 'Pour postuler en tant qu\'expert ANRSI, veuillez envoyer votre dossier de candidature à :'
    });

    // Add default requirements
    this.addRequirement({
      icon: '🎓',
      title: 'Formation Académique',
      items: [
        'Doctorat dans un domaine scientifique ou technologique',
        'Expérience significative en recherche',
        'Publications scientifiques reconnues',
        'Maîtrise du français et/ou de l\'anglais'
      ]
    });
    this.addRequirement({
      icon: '🔬',
      title: 'Expertise Technique',
      items: [
        'Connaissance approfondie du domaine d\'expertise',
        'Expérience en évaluation de projets',
        'Capacité d\'analyse et de synthèse',
        'Rigueur scientifique et éthique'
      ]
    });
    this.addRequirement({
      icon: '🌍',
      title: 'Engagement',
      items: [
        'Disponibilité pour les évaluations',
        'Engagement envers le développement scientifique',
        'Respect des délais et procédures',
        'Confidentialité et impartialité'
      ]
    });

    // Add default domains
    this.addDomain({ icon: '🔬', title: 'Sciences Exactes', description: 'Mathématiques, Physique, Chimie, Sciences de la Terre' });
    this.addDomain({ icon: '🌱', title: 'Sciences de la Vie', description: 'Biologie, Agriculture, Médecine, Sciences Vétérinaires' });
    this.addDomain({ icon: '💻', title: 'Technologies de l\'Information', description: 'Informatique, Intelligence Artificielle, Télécommunications' });
    this.addDomain({ icon: '⚡', title: 'Sciences de l\'Ingénieur', description: 'Génie Civil, Mécanique, Électrique, Énergies Renouvelables' });
    this.addDomain({ icon: '🌍', title: 'Sciences Sociales', description: 'Économie, Sociologie, Droit, Sciences Politiques' });
    this.addDomain({ icon: '🌿', title: 'Sciences de l\'Environnement', description: 'Écologie, Climatologie, Gestion des Ressources Naturelles' });

    // Add default process steps
    this.addProcessStep({ number: 1, title: 'Candidature', description: 'Soumission du dossier de candidature avec CV détaillé, liste des publications et lettre de motivation.' });
    this.addProcessStep({ number: 2, title: 'Évaluation', description: 'Examen du dossier par un comité d\'experts de l\'ANRSI selon des critères objectifs.' });
    this.addProcessStep({ number: 3, title: 'Entretien', description: 'Entretien avec les candidats retenus pour évaluer leurs compétences et leur motivation.' });
    this.addProcessStep({ number: 4, title: 'Formation', description: 'Formation aux procédures d\'évaluation de l\'ANRSI et aux outils utilisés.' });
    this.addProcessStep({ number: 5, title: 'Intégration', description: 'Intégration dans le réseau d\'experts et attribution des premières missions d\'évaluation.' });

    // Add default benefits
    this.addBenefit({ icon: '💼', title: 'Rémunération', description: 'Rémunération attractive pour chaque mission d\'évaluation selon l\'expertise et la complexité.' });
    this.addBenefit({ icon: '🌐', title: 'Réseau International', description: 'Intégration dans un réseau d\'experts internationaux et opportunités de collaboration.' });
    this.addBenefit({ icon: '📚', title: 'Formation Continue', description: 'Accès à des formations et séminaires pour maintenir et développer ses compétences.' });
    this.addBenefit({ icon: '🏆', title: 'Reconnaissance', description: 'Reconnaissance officielle en tant qu\'expert scientifique et contribution au développement national.' });

    // Add default contact info
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'expert@anrsi.mr' });
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' });

    // Add default required documents
    this.addRequiredDocument('CV détaillé avec liste des publications');
    this.addRequiredDocument('Lettre de motivation');
    this.addRequiredDocument('Copies des diplômes et certifications');
    this.addRequiredDocument('Lettres de recommandation (optionnel)');
    this.addRequiredDocument('Liste des projets de recherche dirigés');
  }

  populateForm(content: ExpertAnrsiContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      introText: content.introText,
      applicationText: content.applicationText
    });

    // Clear existing arrays
    while (this.requirements.length) this.requirements.removeAt(0);
    while (this.domains.length) this.domains.removeAt(0);
    while (this.processSteps.length) this.processSteps.removeAt(0);
    while (this.benefits.length) this.benefits.removeAt(0);
    while (this.contactInfo.length) this.contactInfo.removeAt(0);
    while (this.requiredDocuments.length) this.requiredDocuments.removeAt(0);

    // Populate arrays
    content.requirements?.forEach(item => this.addRequirement(item));
    content.domains?.forEach(item => this.addDomain(item));
    content.processSteps?.forEach(item => this.addProcessStep(item));
    content.benefits?.forEach(item => this.addBenefit(item));
    content.contactInfo?.forEach(item => this.addContactItem(item));
    content.requiredDocuments?.forEach(item => this.addRequiredDocument(item));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: ExpertAnrsiContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introText: formValue.introText,
        requirements: formValue.requirements.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          items: item.items
        })),
        domains: formValue.domains,
        processSteps: formValue.processSteps,
        benefits: formValue.benefits,
        applicationText: formValue.applicationText,
        contactInfo: formValue.contactInfo,
        requiredDocuments: formValue.requiredDocuments
      };

      const updateData: PageUpdateDTO = {
        title: 'Expert à l\'ANRSI',
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
          slug: 'expert-anrsi',
          title: 'Expert à l\'ANRSI',
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

