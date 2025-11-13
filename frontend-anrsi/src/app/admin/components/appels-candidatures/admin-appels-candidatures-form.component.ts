import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface AppelDetail {
  label: string;
  value: string;
}

interface AppelAction {
  text: string;
  url: string;
  type: 'primary' | 'outline';
}

interface AppelItem {
  status: 'active' | 'upcoming' | 'closed';
  title: string;
  description: string;
  details: AppelDetail[];
  actions: AppelAction[];
}

interface CategoryItem {
  icon: string;
  title: string;
  items: string[];
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface CriteriaItem {
  icon: string;
  title: string;
  description: string;
}

interface SupportService {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface AppelsCandidaturesContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  appels: AppelItem[];
  categories: CategoryItem[];
  processSteps: ProcessStep[];
  criteria: CriteriaItem[];
  supportServices: SupportService[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-admin-appels-candidatures-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-appels-candidatures-form.component.html',
  styleUrls: ['./admin-appels-candidatures-form.component.scss']
})
export class AdminAppelsCandidaturesFormComponent implements OnInit {
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
      heroTitle: ['Appels à Candidatures', Validators.required],
      heroSubtitle: ['Opportunités de recherche et d\'innovation en Mauritanie', Validators.required],
      introText: ['', Validators.required],
      appels: this.fb.array([]),
      categories: this.fb.array([]),
      processSteps: this.fb.array([]),
      criteria: this.fb.array([]),
      supportServices: this.fb.array([]),
      contactInfo: this.fb.array([])
    });
  }

  // Appels FormArray methods
  get appels(): FormArray {
    return this.form.get('appels') as FormArray;
  }

  addAppel(item?: AppelItem): void {
    const group = this.fb.group({
      status: [item?.status || 'active', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      details: this.fb.array(item?.details?.map(d => this.fb.group({
        label: [d.label, Validators.required],
        value: [d.value, Validators.required]
      })) || []),
      actions: this.fb.array(item?.actions?.map(a => this.fb.group({
        text: [a.text, Validators.required],
        url: [a.url, Validators.required],
        type: [a.type || 'primary', Validators.required]
      })) || [])
    });
    this.appels.push(group);
  }

  removeAppel(index: number): void {
    this.appels.removeAt(index);
  }

  getAppelDetails(index: number): FormArray {
    return this.appels.at(index).get('details') as FormArray;
  }

  addAppelDetail(appelIndex: number, detail?: AppelDetail): void {
    this.getAppelDetails(appelIndex).push(this.fb.group({
      label: [detail?.label || '', Validators.required],
      value: [detail?.value || '', Validators.required]
    }));
  }

  removeAppelDetail(appelIndex: number, detailIndex: number): void {
    this.getAppelDetails(appelIndex).removeAt(detailIndex);
  }

  getAppelActions(index: number): FormArray {
    return this.appels.at(index).get('actions') as FormArray;
  }

  addAppelAction(appelIndex: number, action?: AppelAction): void {
    this.getAppelActions(appelIndex).push(this.fb.group({
      text: [action?.text || '', Validators.required],
      url: [action?.url || '', Validators.required],
      type: [action?.type || 'primary', Validators.required]
    }));
  }

  removeAppelAction(appelIndex: number, actionIndex: number): void {
    this.getAppelActions(appelIndex).removeAt(actionIndex);
  }

  // Categories FormArray methods
  get categories(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  addCategory(item?: CategoryItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '🌱', Validators.required],
      title: [item?.title || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    this.categories.push(group);
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  getCategoryItems(index: number): FormArray {
    return this.categories.at(index).get('items') as FormArray;
  }

  addCategoryItem(categoryIndex: number, value = ''): void {
    this.getCategoryItems(categoryIndex).push(this.fb.control(value));
  }

  removeCategoryItem(categoryIndex: number, itemIndex: number): void {
    this.getCategoryItems(categoryIndex).removeAt(itemIndex);
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

  // Criteria FormArray methods
  get criteria(): FormArray {
    return this.form.get('criteria') as FormArray;
  }

  addCriteria(item?: CriteriaItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.criteria.push(group);
  }

  removeCriteria(index: number): void {
    this.criteria.removeAt(index);
  }

  // Support Services FormArray methods
  get supportServices(): FormArray {
    return this.form.get('supportServices') as FormArray;
  }

  addSupportService(item?: SupportService): void {
    const group = this.fb.group({
      icon: [item?.icon || '📋', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.supportServices.push(group);
  }

  removeSupportService(index: number): void {
    this.supportServices.removeAt(index);
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

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('appels-candidatures').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: AppelsCandidaturesContent = JSON.parse(page.content);
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
      heroTitle: 'Appels à Candidatures',
      heroSubtitle: 'Opportunités de recherche et d\'innovation en Mauritanie',
      introText: 'L\'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d\'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.'
    });

    // Add default appels
    this.addAppel({
      status: 'active',
      title: 'Appel à Projets de Recherche 2024',
      description: 'Financement de projets de recherche dans les domaines prioritaires : agriculture durable, énergies renouvelables, technologies de l\'information, et sciences de l\'environnement.',
      details: [
        { label: 'Budget :', value: 'Jusqu\'à 50 millions MRO par projet' },
        { label: 'Durée :', value: '12-36 mois' },
        { label: 'Date limite :', value: '31 Mars 2024' },
        { label: 'Éligibilité :', value: 'Institutions de recherche, universités, entreprises' }
      ],
      actions: [
        { text: 'Consulter l\'appel', url: '#', type: 'primary' },
        { text: 'Télécharger le dossier', url: '#', type: 'outline' }
      ]
    });
    this.addAppel({
      status: 'upcoming',
      title: 'Programme Innovation Technologique',
      description: 'Soutien aux projets d\'innovation technologique et de transfert de technologie vers l\'industrie mauritanienne.',
      details: [
        { label: 'Budget :', value: 'Jusqu\'à 30 millions MRO par projet' },
        { label: 'Durée :', value: '6-24 mois' },
        { label: 'Ouverture :', value: 'Avril 2024' },
        { label: 'Éligibilité :', value: 'Startups, PME, centres de recherche' }
      ],
      actions: [
        { text: 'S\'inscrire aux alertes', url: '#', type: 'outline' }
      ]
    });
    this.addAppel({
      status: 'closed',
      title: 'Bourses de Doctorat 2023',
      description: 'Programme de bourses pour soutenir les étudiants mauritaniens dans leurs études doctorales en sciences et technologies.',
      details: [
        { label: 'Montant :', value: '500,000 MRO/an pendant 3 ans' },
        { label: 'Durée :', value: '3 ans' },
        { label: 'Date limite :', value: '15 Décembre 2023' },
        { label: 'Éligibilité :', value: 'Étudiants mauritaniens en master' }
      ],
      actions: [
        { text: 'Voir les résultats', url: '#', type: 'outline' }
      ]
    });

    // Add default categories
    this.addCategory({
      icon: '🌱',
      title: 'Agriculture & Sécurité Alimentaire',
      items: ['Techniques agricoles durables', 'Amélioration des rendements', 'Gestion des ressources hydriques', 'Biotechnologies agricoles']
    });
    this.addCategory({
      icon: '⚡',
      title: 'Énergies Renouvelables',
      items: ['Énergie solaire et éolienne', 'Stockage d\'énergie', 'Efficacité énergétique', 'Électrification rurale']
    });
    this.addCategory({
      icon: '💻',
      title: 'Technologies de l\'Information',
      items: ['Intelligence artificielle', 'Internet des objets (IoT)', 'Cybersécurité', 'Applications mobiles']
    });
    this.addCategory({
      icon: '🌍',
      title: 'Environnement & Climat',
      items: ['Changement climatique', 'Biodiversité', 'Gestion des déchets', 'Pollution et assainissement']
    });
    this.addCategory({
      icon: '🏥',
      title: 'Santé & Médecine',
      items: ['Médecine préventive', 'Télémédecine', 'Pharmacologie', 'Santé publique']
    });
    this.addCategory({
      icon: '🏭',
      title: 'Industrie & Innovation',
      items: ['Processus industriels', 'Matériaux avancés', 'Robotique', 'Transfert de technologie']
    });

    // Add default process steps
    this.addProcessStep({ number: 1, title: 'Préparation du Dossier', description: 'Rédaction du projet de recherche, budget détaillé, équipe de recherche, et lettres de recommandation.' });
    this.addProcessStep({ number: 2, title: 'Soumission en Ligne', description: 'Dépôt du dossier complet via la plateforme de soumission électronique de l\'ANRSI.' });
    this.addProcessStep({ number: 3, title: 'Évaluation Scientifique', description: 'Examen du projet par un comité d\'experts indépendants selon des critères scientifiques rigoureux.' });
    this.addProcessStep({ number: 4, title: 'Entretien', description: 'Présentation orale du projet devant le comité d\'évaluation pour les projets présélectionnés.' });
    this.addProcessStep({ number: 5, title: 'Décision et Financement', description: 'Notification des résultats et signature de la convention de financement pour les projets retenus.' });

    // Add default criteria
    this.addCriteria({ icon: '🔬', title: 'Excellence Scientifique', description: 'Qualité scientifique du projet, innovation, méthodologie rigoureuse, et faisabilité technique.' });
    this.addCriteria({ icon: '👥', title: 'Équipe de Recherche', description: 'Compétences et expérience de l\'équipe, complémentarité des profils, et leadership du projet.' });
    this.addCriteria({ icon: '💡', title: 'Impact et Innovation', description: 'Potentiel d\'innovation, impact attendu sur le développement national, et transfert de connaissances.' });
    this.addCriteria({ icon: '💰', title: 'Gestion Financière', description: 'Budget réaliste et justifié, coût-efficacité, et capacité de gestion financière du porteur.' });

    // Add default support services
    this.addSupportService({ icon: '📋', title: 'Formation à la Gestion de Projet', description: 'Formation aux outils de gestion de projet et aux procédures administratives.' });
    this.addSupportService({ icon: '🔍', title: 'Suivi et Évaluation', description: 'Accompagnement dans le suivi du projet et l\'évaluation des résultats.' });
    this.addSupportService({ icon: '🌐', title: 'Réseau et Partenariats', description: 'Facilitation des partenariats avec des institutions nationales et internationales.' });
    this.addSupportService({ icon: '📢', title: 'Valorisation des Résultats', description: 'Support dans la publication et la valorisation des résultats de recherche.' });

    // Add default contact info
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'appels@anrsi.mr' });
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' });
    this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Adresse', value: 'ANRSI, Nouakchott, Mauritanie' });
    this.addContactItem({ icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 16h00' });
  }

  populateForm(content: AppelsCandidaturesContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      introText: content.introText
    });

    // Clear existing arrays
    while (this.appels.length) this.appels.removeAt(0);
    while (this.categories.length) this.categories.removeAt(0);
    while (this.processSteps.length) this.processSteps.removeAt(0);
    while (this.criteria.length) this.criteria.removeAt(0);
    while (this.supportServices.length) this.supportServices.removeAt(0);
    while (this.contactInfo.length) this.contactInfo.removeAt(0);

    // Populate arrays
    content.appels?.forEach(item => this.addAppel(item));
    content.categories?.forEach(item => this.addCategory(item));
    content.processSteps?.forEach(item => this.addProcessStep(item));
    content.criteria?.forEach(item => this.addCriteria(item));
    content.supportServices?.forEach(item => this.addSupportService(item));
    content.contactInfo?.forEach(item => this.addContactItem(item));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: AppelsCandidaturesContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introText: formValue.introText,
        appels: formValue.appels.map((item: any) => ({
          status: item.status,
          title: item.title,
          description: item.description,
          details: item.details,
          actions: item.actions
        })),
        categories: formValue.categories.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          items: item.items
        })),
        processSteps: formValue.processSteps,
        criteria: formValue.criteria,
        supportServices: formValue.supportServices,
        contactInfo: formValue.contactInfo
      };

      const updateData: PageUpdateDTO = {
        title: 'Appels à Candidatures',
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
          slug: 'appels-candidatures',
          title: 'Appels à Candidatures',
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

