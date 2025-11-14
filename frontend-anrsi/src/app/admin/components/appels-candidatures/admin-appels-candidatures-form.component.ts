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

interface AppelsCandidaturesLanguageContent {
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

interface AppelsCandidaturesContent {
  translations: {
    fr: AppelsCandidaturesLanguageContent;
    ar: AppelsCandidaturesLanguageContent;
    en: AppelsCandidaturesLanguageContent;
  };
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
  activeLanguage: 'fr' | 'ar' | 'en' = 'fr';

  languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // Check for language query parameter
    this.route.queryParams.subscribe(params => {
      if (params['lang'] && ['fr', 'ar', 'en'].includes(params['lang'])) {
        this.activeLanguage = params['lang'] as 'fr' | 'ar' | 'en';
      }
    });
    this.loadPage();
  }

  createForm(): FormGroup {
    return this.fb.group({
      translations: this.fb.group({
        fr: this.createLanguageFormGroup(),
        ar: this.createLanguageFormGroup(),
        en: this.createLanguageFormGroup()
      })
    });
  }

  private createLanguageFormGroup(): FormGroup {
    return this.fb.group({
      heroTitle: ['', Validators.required],
      heroSubtitle: ['', Validators.required],
      introText: ['', Validators.required],
      appels: this.fb.array([]),
      categories: this.fb.array([]),
      processSteps: this.fb.array([]),
      criteria: this.fb.array([]),
      supportServices: this.fb.array([]),
      contactInfo: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    return this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
  }

  getLanguageFormGroup(lang: string): FormGroup {
    return this.form.get(`translations.${lang}`) as FormGroup;
  }

  hasTranslation(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.get('heroTitle')?.value || langGroup.get('heroSubtitle')?.value || false;
  }

  isLanguageFormValid(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.valid;
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || 'Français';
  }

  // Appels FormArray methods
  get appels(): FormArray {
    return this.getActiveLanguageFormGroup().get('appels') as FormArray;
  }

  addAppel(item?: AppelItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const appels = langGroup.get('appels') as FormArray;
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
    appels.push(group);
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
    return this.getActiveLanguageFormGroup().get('categories') as FormArray;
  }

  addCategory(item?: CategoryItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const categories = langGroup.get('categories') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🌱', Validators.required],
      title: [item?.title || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    categories.push(group);
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
    return this.getActiveLanguageFormGroup().get('processSteps') as FormArray;
  }

  addProcessStep(step?: ProcessStep, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const processSteps = langGroup.get('processSteps') as FormArray;
    const group = this.fb.group({
      number: [step?.number || processSteps.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required]
    });
    processSteps.push(group);
  }

  removeProcessStep(index: number): void {
    this.processSteps.removeAt(index);
    this.processSteps.controls.forEach((control, i) => {
      control.patchValue({ number: i + 1 });
    });
  }

  // Criteria FormArray methods
  get criteria(): FormArray {
    return this.getActiveLanguageFormGroup().get('criteria') as FormArray;
  }

  addCriteria(item?: CriteriaItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const criteria = langGroup.get('criteria') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    criteria.push(group);
  }

  removeCriteria(index: number): void {
    this.criteria.removeAt(index);
  }

  // Support Services FormArray methods
  get supportServices(): FormArray {
    return this.getActiveLanguageFormGroup().get('supportServices') as FormArray;
  }

  addSupportService(item?: SupportService, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const supportServices = langGroup.get('supportServices') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📋', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    supportServices.push(group);
  }

  removeSupportService(index: number): void {
    this.supportServices.removeAt(index);
  }

  // Contact Info FormArray methods
  get contactInfo(): FormArray {
    return this.getActiveLanguageFormGroup().get('contactInfo') as FormArray;
  }

  addContactItem(item?: ContactItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const contactInfo = langGroup.get('contactInfo') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || 'fas fa-envelope', Validators.required],
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
    contactInfo.push(group);
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
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: AppelsCandidaturesContent = parsedContent;
              this.populateForm(content);
            } else {
              // Old format - migrate to new format
              const oldContent: AppelsCandidaturesLanguageContent = parsedContent;
              const content: AppelsCandidaturesContent = {
                translations: {
                  fr: oldContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
              this.populateForm(content);
            }
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
          this.errorMessage = this.getLabel('errorLoadingPage');
        }
        this.isLoading = false;
      }
    });
  }

  private getEmptyLanguageContent(): AppelsCandidaturesLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      appels: [],
      categories: [],
      processSteps: [],
      criteria: [],
      supportServices: [],
      contactInfo: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Appels à Candidatures',
      heroSubtitle: 'Opportunités de recherche et d\'innovation en Mauritanie',
      introText: 'L\'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d\'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.'
    });

    // Add default appels for French
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
    }, 'fr');
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
    }, 'fr');
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
    }, 'fr');

    // Add default categories for French
    this.addCategory({
      icon: '🌱',
      title: 'Agriculture & Sécurité Alimentaire',
      items: ['Techniques agricoles durables', 'Amélioration des rendements', 'Gestion des ressources hydriques', 'Biotechnologies agricoles']
    }, 'fr');
    this.addCategory({
      icon: '⚡',
      title: 'Énergies Renouvelables',
      items: ['Énergie solaire et éolienne', 'Stockage d\'énergie', 'Efficacité énergétique', 'Électrification rurale']
    }, 'fr');
    this.addCategory({
      icon: '💻',
      title: 'Technologies de l\'Information',
      items: ['Intelligence artificielle', 'Internet des objets (IoT)', 'Cybersécurité', 'Applications mobiles']
    }, 'fr');
    this.addCategory({
      icon: '🌍',
      title: 'Environnement & Climat',
      items: ['Changement climatique', 'Biodiversité', 'Gestion des déchets', 'Pollution et assainissement']
    }, 'fr');
    this.addCategory({
      icon: '🏥',
      title: 'Santé & Médecine',
      items: ['Médecine préventive', 'Télémédecine', 'Pharmacologie', 'Santé publique']
    }, 'fr');
    this.addCategory({
      icon: '🏭',
      title: 'Industrie & Innovation',
      items: ['Processus industriels', 'Matériaux avancés', 'Robotique', 'Transfert de technologie']
    }, 'fr');

    // Add default process steps for French
    this.addProcessStep({ number: 1, title: 'Préparation du Dossier', description: 'Rédaction du projet de recherche, budget détaillé, équipe de recherche, et lettres de recommandation.' }, 'fr');
    this.addProcessStep({ number: 2, title: 'Soumission en Ligne', description: 'Dépôt du dossier complet via la plateforme de soumission électronique de l\'ANRSI.' }, 'fr');
    this.addProcessStep({ number: 3, title: 'Évaluation Scientifique', description: 'Examen du projet par un comité d\'experts indépendants selon des critères scientifiques rigoureux.' }, 'fr');
    this.addProcessStep({ number: 4, title: 'Entretien', description: 'Présentation orale du projet devant le comité d\'évaluation pour les projets présélectionnés.' }, 'fr');
    this.addProcessStep({ number: 5, title: 'Décision et Financement', description: 'Notification des résultats et signature de la convention de financement pour les projets retenus.' }, 'fr');

    // Add default criteria for French
    this.addCriteria({ icon: '🔬', title: 'Excellence Scientifique', description: 'Qualité scientifique du projet, innovation, méthodologie rigoureuse, et faisabilité technique.' }, 'fr');
    this.addCriteria({ icon: '👥', title: 'Équipe de Recherche', description: 'Compétences et expérience de l\'équipe, complémentarité des profils, et leadership du projet.' }, 'fr');
    this.addCriteria({ icon: '💡', title: 'Impact et Innovation', description: 'Potentiel d\'innovation, impact attendu sur le développement national, et transfert de connaissances.' }, 'fr');
    this.addCriteria({ icon: '💰', title: 'Gestion Financière', description: 'Budget réaliste et justifié, coût-efficacité, et capacité de gestion financière du porteur.' }, 'fr');

    // Add default support services for French
    this.addSupportService({ icon: '📋', title: 'Formation à la Gestion de Projet', description: 'Formation aux outils de gestion de projet et aux procédures administratives.' }, 'fr');
    this.addSupportService({ icon: '🔍', title: 'Suivi et Évaluation', description: 'Accompagnement dans le suivi du projet et l\'évaluation des résultats.' }, 'fr');
    this.addSupportService({ icon: '🌐', title: 'Réseau et Partenariats', description: 'Facilitation des partenariats avec des institutions nationales et internationales.' }, 'fr');
    this.addSupportService({ icon: '📢', title: 'Valorisation des Résultats', description: 'Support dans la publication et la valorisation des résultats de recherche.' }, 'fr');

    // Add default contact info for French
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'appels@anrsi.mr' }, 'fr');
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' }, 'fr');
    this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Adresse', value: 'ANRSI, Nouakchott, Mauritanie' }, 'fr');
    this.addContactItem({ icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 16h00' }, 'fr');
  }

  populateForm(content: AppelsCandidaturesContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || ''
        });

        // Clear existing arrays
        const appels = langGroup.get('appels') as FormArray;
        const categories = langGroup.get('categories') as FormArray;
        const processSteps = langGroup.get('processSteps') as FormArray;
        const criteria = langGroup.get('criteria') as FormArray;
        const supportServices = langGroup.get('supportServices') as FormArray;
        const contactInfo = langGroup.get('contactInfo') as FormArray;
        while (appels.length) appels.removeAt(0);
        while (categories.length) categories.removeAt(0);
        while (processSteps.length) processSteps.removeAt(0);
        while (criteria.length) criteria.removeAt(0);
        while (supportServices.length) supportServices.removeAt(0);
        while (contactInfo.length) contactInfo.removeAt(0);

        // Populate arrays
        langContent.appels?.forEach(item => this.addAppel(item, lang));
        langContent.categories?.forEach(item => this.addCategory(item, lang));
        langContent.processSteps?.forEach(item => this.addProcessStep(item, lang));
        langContent.criteria?.forEach(item => this.addCriteria(item, lang));
        langContent.supportServices?.forEach(item => this.addSupportService(item, lang));
        langContent.contactInfo?.forEach(item => this.addContactItem(item, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: AppelsCandidaturesContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Appels à Candidatures';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Appels à Candidatures',
      heroTitle: heroTitle,
      heroSubtitle: heroSubtitle,
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
          this.errorMessage = this.getLabel('errorSavingPage');
          console.error('Error saving page:', error);
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'appels-candidatures',
        title: 'Appels à Candidatures',
        heroTitle: heroTitle,
        heroSubtitle: heroSubtitle,
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
          this.errorMessage = this.getLabel('errorCreatingPage');
          console.error('Error creating page:', error);
        }
      });
    }
  }

  private buildLanguageContent(langData: any): AppelsCandidaturesLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      appels: (langData.appels || []).map((item: any) => ({
        status: item.status,
        title: item.title,
        description: item.description,
        details: item.details || [],
        actions: item.actions || []
      })),
      categories: (langData.categories || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        items: item.items || []
      })),
      processSteps: langData.processSteps || [],
      criteria: langData.criteria || [],
      supportServices: langData.supportServices || [],
      contactInfo: langData.contactInfo || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Appels à Candidatures',
        ar: 'تعديل صفحة دعوات التقديم',
        en: 'Edit Calls for Applications Page'
      },
      'cancel': {
        fr: 'Annuler',
        ar: 'إلغاء',
        en: 'Cancel'
      },
      'heroSection': {
        fr: 'Section Hero',
        ar: 'قسم البطل',
        en: 'Hero Section'
      },
      'heroTitle': {
        fr: 'Titre Hero *',
        ar: 'عنوان البطل *',
        en: 'Hero Title *'
      },
      'heroSubtitle': {
        fr: 'Sous-titre Hero *',
        ar: 'العنوان الفرعي للبطل *',
        en: 'Hero Subtitle *'
      },
      'introSection': {
        fr: 'Introduction',
        ar: 'مقدمة',
        en: 'Introduction'
      },
      'introText': {
        fr: 'Texte d\'introduction *',
        ar: 'نص المقدمة *',
        en: 'Intro Text *'
      },
      'appelsSection': {
        fr: 'Appels à Candidatures',
        ar: 'دعوات التقديم',
        en: 'Calls for Applications'
      },
      'categoriesSection': {
        fr: 'Domaines Prioritaires (Catégories)',
        ar: 'المجالات ذات الأولوية (الفئات)',
        en: 'Priority Domains (Categories)'
      },
      'processStepsSection': {
        fr: 'Processus de Candidature',
        ar: 'عملية التقديم',
        en: 'Application Process'
      },
      'criteriaSection': {
        fr: 'Critères d\'Évaluation',
        ar: 'معايير التقييم',
        en: 'Evaluation Criteria'
      },
      'supportServicesSection': {
        fr: 'Support et Accompagnement',
        ar: 'الدعم والمرافقة',
        en: 'Support and Assistance'
      },
      'contactInfoSection': {
        fr: 'Informations de Contact',
        ar: 'معلومات الاتصال',
        en: 'Contact Information'
      },
      'status': {
        fr: 'Statut *',
        ar: 'الحالة *',
        en: 'Status *'
      },
      'title': {
        fr: 'Titre *',
        ar: 'العنوان *',
        en: 'Title *'
      },
      'description': {
        fr: 'Description *',
        ar: 'الوصف *',
        en: 'Description *'
      },
      'details': {
        fr: 'Détails',
        ar: 'التفاصيل',
        en: 'Details'
      },
      'actions': {
        fr: 'Actions',
        ar: 'الإجراءات',
        en: 'Actions'
      },
      'icon': {
        fr: 'Icône',
        ar: 'أيقونة',
        en: 'Icon'
      },
      'items': {
        fr: 'Éléments',
        ar: 'العناصر',
        en: 'Items'
      },
      'stepNumber': {
        fr: 'Numéro d\'étape *',
        ar: 'رقم الخطوة *',
        en: 'Step Number *'
      },
      'label': {
        fr: 'Libellé *',
        ar: 'التسمية *',
        en: 'Label *'
      },
      'value': {
        fr: 'Valeur *',
        ar: 'القيمة *',
        en: 'Value *'
      },
      'buttonText': {
        fr: 'Texte du bouton',
        ar: 'نص الزر',
        en: 'Button Text'
      },
      'url': {
        fr: 'URL',
        ar: 'الرابط',
        en: 'URL'
      },
      'type': {
        fr: 'Type',
        ar: 'النوع',
        en: 'Type'
      },
      'iconFontAwesome': {
        fr: 'Icône (classe FontAwesome) *',
        ar: 'أيقونة (فئة FontAwesome) *',
        en: 'Icon (FontAwesome class) *'
      },
      'addAppel': {
        fr: 'Ajouter un appel',
        ar: 'إضافة دعوة',
        en: 'Add Call'
      },
      'addCategory': {
        fr: 'Ajouter une catégorie',
        ar: 'إضافة فئة',
        en: 'Add Category'
      },
      'addProcessStep': {
        fr: 'Ajouter une étape du processus',
        ar: 'إضافة خطوة في العملية',
        en: 'Add Process Step'
      },
      'addCriteria': {
        fr: 'Ajouter un critère',
        ar: 'إضافة معيار',
        en: 'Add Criteria'
      },
      'addSupportService': {
        fr: 'Ajouter un service de support',
        ar: 'إضافة خدمة دعم',
        en: 'Add Support Service'
      },
      'addContactItem': {
        fr: 'Ajouter un élément de contact',
        ar: 'إضافة عنصر اتصال',
        en: 'Add Contact Item'
      },
      'addDetail': {
        fr: 'Ajouter un détail',
        ar: 'إضافة تفصيل',
        en: 'Add Detail'
      },
      'addAction': {
        fr: 'Ajouter une action',
        ar: 'إضافة إجراء',
        en: 'Add Action'
      },
      'addItem': {
        fr: 'Ajouter un élément',
        ar: 'إضافة عنصر',
        en: 'Add Item'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'إزالة',
        en: 'Remove'
      },
      'complete': {
        fr: 'Complet',
        ar: 'مكتمل',
        en: 'Complete'
      },
      'incomplete': {
        fr: 'Incomplet',
        ar: 'غير مكتمل',
        en: 'Incomplete'
      },
      'saveChanges': {
        fr: 'Enregistrer les modifications',
        ar: 'حفظ التغييرات',
        en: 'Save Changes'
      },
      'saving': {
        fr: 'Enregistrement...',
        ar: 'جاري الحفظ...',
        en: 'Saving...'
      },
      'loading': {
        fr: 'Chargement...',
        ar: 'جاري التحميل...',
        en: 'Loading...'
      },
      'errorLoadingPage': {
        fr: 'Erreur lors du chargement de la page',
        ar: 'خطأ في تحميل الصفحة',
        en: 'Error loading page'
      },
      'errorSavingPage': {
        fr: 'Erreur lors de l\'enregistrement de la page',
        ar: 'خطأ في حفظ الصفحة',
        en: 'Error saving page'
      },
      'errorCreatingPage': {
        fr: 'Erreur lors de la création de la page',
        ar: 'خطأ في إنشاء الصفحة',
        en: 'Error creating page'
      }
    };

    return translations[key]?.[this.activeLanguage] || translations[key]?.fr || key;
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}



