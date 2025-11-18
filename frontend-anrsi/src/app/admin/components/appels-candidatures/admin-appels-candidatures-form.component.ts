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
              // Check if Arabic data is empty in the form and load defaults if needed
              const arGroup = this.getLanguageFormGroup('ar');
              const arHeroTitle = arGroup.get('heroTitle')?.value;
              const arAppels = arGroup.get('appels') as FormArray;
              const arCategories = arGroup.get('categories') as FormArray;
              if ((!arHeroTitle || arHeroTitle.trim() === '') && arAppels.length === 0 && arCategories.length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty in the form and load defaults if needed
              const enGroup = this.getLanguageFormGroup('en');
              const enHeroTitle = enGroup.get('heroTitle')?.value;
              const enAppels = enGroup.get('appels') as FormArray;
              const enCategories = enGroup.get('categories') as FormArray;
              if ((!enHeroTitle || enHeroTitle.trim() === '') && enAppels.length === 0 && enCategories.length === 0) {
                this.loadDefaultEnglishData();
              }
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
              // Load default Arabic and English data since they're empty
              this.loadDefaultArabicData();
              this.loadDefaultEnglishData();
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

    // Load default Arabic and English data
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  private loadDefaultArabicData(): void {
    // Check if Arabic data already exists to avoid duplicates
    const arGroup = this.getLanguageFormGroup('ar');
    const heroTitle = arGroup.get('heroTitle')?.value;
    const existingAppels = arGroup.get('appels') as FormArray;
    const existingCategories = arGroup.get('categories') as FormArray;

    // Only load if Arabic data is empty (no hero title and no appels/categories items)
    if ((!heroTitle || heroTitle.trim() === '') && existingAppels.length === 0 && existingCategories.length === 0) {
      arGroup.patchValue({
        heroTitle: 'دعوات التقديم',
        heroSubtitle: 'فرص البحث والابتكار في موريتانيا',
        introText: 'تطلق الوكالة الوطنية للبحث العلمي والابتكار بانتظام دعوات للتقديم لتمويل مشاريع البحث والابتكار التي تساهم في التنمية العلمية والتكنولوجية لموريتانيا.'
      });

      // Add default appels for Arabic
      this.addAppel({
        status: 'active',
        title: 'دعوة لمشاريع البحث 2024',
        description: 'تمويل مشاريع البحث في المجالات ذات الأولوية: الزراعة المستدامة، الطاقات المتجددة، تكنولوجيا المعلومات، وعلوم البيئة.',
        details: [
          { label: 'الميزانية :', value: 'حتى 50 مليون أوقية لكل مشروع' },
          { label: 'المدة :', value: '12-36 شهراً' },
          { label: 'الموعد النهائي :', value: '31 مارس 2024' },
          { label: 'الأهلية :', value: 'مؤسسات البحث، الجامعات، الشركات' }
        ],
        actions: [
          { text: 'استشارة الدعوة', url: '#', type: 'primary' },
          { text: 'تحميل الملف', url: '#', type: 'outline' }
        ]
      }, 'ar');
      this.addAppel({
        status: 'upcoming',
        title: 'برنامج الابتكار التكنولوجي',
        description: 'دعم مشاريع الابتكار التكنولوجي ونقل التكنولوجيا إلى الصناعة الموريتانية.',
        details: [
          { label: 'الميزانية :', value: 'حتى 30 مليون أوقية لكل مشروع' },
          { label: 'المدة :', value: '6-24 شهراً' },
          { label: 'الفتح :', value: 'أبريل 2024' },
          { label: 'الأهلية :', value: 'الشركات الناشئة، المؤسسات الصغيرة والمتوسطة، مراكز البحث' }
        ],
        actions: [
          { text: 'التسجيل للتنبيهات', url: '#', type: 'outline' }
        ]
      }, 'ar');
      this.addAppel({
        status: 'closed',
        title: 'منح الدكتوراه 2023',
        description: 'برنامج منح لدعم الطلاب الموريتانيين في دراساتهم للدكتوراه في العلوم والتكنولوجيا.',
        details: [
          { label: 'المبلغ :', value: '500,000 أوقية/سنة لمدة 3 سنوات' },
          { label: 'المدة :', value: '3 سنوات' },
          { label: 'الموعد النهائي :', value: '15 ديسمبر 2023' },
          { label: 'الأهلية :', value: 'الطلاب الموريتانيون في الماجستير' }
        ],
        actions: [
          { text: 'عرض النتائج', url: '#', type: 'outline' }
        ]
      }, 'ar');

      // Add default categories for Arabic
      this.addCategory({
        icon: '🌱',
        title: 'الزراعة والأمن الغذائي',
        items: ['التقنيات الزراعية المستدامة', 'تحسين المحاصيل', 'إدارة الموارد المائية', 'البيوتكنولوجيات الزراعية']
      }, 'ar');
      this.addCategory({
        icon: '⚡',
        title: 'الطاقات المتجددة',
        items: ['الطاقة الشمسية والريحية', 'تخزين الطاقة', 'كفاءة الطاقة', 'التكهين الريفي']
      }, 'ar');
      this.addCategory({
        icon: '💻',
        title: 'تكنولوجيا المعلومات',
        items: ['الذكاء الاصطناعي', 'إنترنت الأشياء', 'الأمن السيبراني', 'التطبيقات المحمولة']
      }, 'ar');
      this.addCategory({
        icon: '🌍',
        title: 'البيئة والمناخ',
        items: ['التغير المناخي', 'التنوع البيولوجي', 'إدارة النفايات', 'التلوث والصرف الصحي']
      }, 'ar');
      this.addCategory({
        icon: '🏥',
        title: 'الصحة والطب',
        items: ['الطب الوقائي', 'الطب عن بُعد', 'علم الأدوية', 'الصحة العامة']
      }, 'ar');
      this.addCategory({
        icon: '🏭',
        title: 'الصناعة والابتكار',
        items: ['العمليات الصناعية', 'المواد المتقدمة', 'الروبوتات', 'نقل التكنولوجيا']
      }, 'ar');

      // Add default process steps for Arabic
      this.addProcessStep({ number: 1, title: 'إعداد الملف', description: 'كتابة مشروع البحث، الميزانية التفصيلية، فريق البحث، ورسائل التوصية.' }, 'ar');
      this.addProcessStep({ number: 2, title: 'التقديم عبر الإنترنت', description: 'إيداع الملف الكامل عبر منصة التقديم الإلكترونية للوكالة الوطنية للبحث العلمي والابتكار.' }, 'ar');
      this.addProcessStep({ number: 3, title: 'التقييم العلمي', description: 'فحص المشروع من قبل لجنة خبراء مستقلين وفق معايير علمية صارمة.' }, 'ar');
      this.addProcessStep({ number: 4, title: 'المقابلة', description: 'عرض شفهي للمشروع أمام لجنة التقييم للمشاريع المختارة مسبقاً.' }, 'ar');
      this.addProcessStep({ number: 5, title: 'القرار والتمويل', description: 'إشعار النتائج وتوقيع اتفاقية التمويل للمشاريع المقبولة.' }, 'ar');

      // Add default criteria for Arabic
      this.addCriteria({ icon: '🔬', title: 'التميز العلمي', description: 'الجودة العلمية للمشروع، الابتكار، المنهجية الصارمة، والجدوى التقنية.' }, 'ar');
      this.addCriteria({ icon: '👥', title: 'فريق البحث', description: 'كفاءات وخبرة الفريق، تكامل الملفات الشخصية، وقيادة المشروع.' }, 'ar');
      this.addCriteria({ icon: '💡', title: 'التأثير والابتكار', description: 'إمكانات الابتكار، التأثير المتوقع على التنمية الوطنية، ونقل المعرفة.' }, 'ar');
      this.addCriteria({ icon: '💰', title: 'الإدارة المالية', description: 'ميزانية واقعية ومبررة، فعالية التكلفة، وقدرة الحامل على الإدارة المالية.' }, 'ar');

      // Add default support services for Arabic
      this.addSupportService({ icon: '📋', title: 'تدريب إدارة المشاريع', description: 'تدريب على أدوات إدارة المشاريع والإجراءات الإدارية.' }, 'ar');
      this.addSupportService({ icon: '🔍', title: 'المتابعة والتقييم', description: 'مرافقة في متابعة المشروع وتقييم النتائج.' }, 'ar');
      this.addSupportService({ icon: '🌐', title: 'الشبكة والشراكات', description: 'تسهيل الشراكات مع المؤسسات الوطنية والدولية.' }, 'ar');
      this.addSupportService({ icon: '📢', title: 'تعزيز النتائج', description: 'الدعم في نشر وتعزيز نتائج البحث.' }, 'ar');

      // Add default contact info for Arabic
      this.addContactItem({ icon: 'fas fa-envelope', label: 'البريد الإلكتروني', value: 'appels@anrsi.mr' }, 'ar');
      this.addContactItem({ icon: 'fas fa-phone', label: 'الهاتف', value: '+222 45 25 44 21' }, 'ar');
      this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'العنوان', value: 'الوكالة الوطنية للبحث العلمي والابتكار، نواكشوط، موريتانيا' }, 'ar');
      this.addContactItem({ icon: 'fas fa-clock', label: 'ساعات العمل', value: 'الاثنين - الجمعة: 8:00 - 16:00' }, 'ar');
    }
  }

  private loadDefaultEnglishData(): void {
    // Check if English data already exists to avoid duplicates
    const enGroup = this.getLanguageFormGroup('en');
    const heroTitle = enGroup.get('heroTitle')?.value;
    const existingAppels = enGroup.get('appels') as FormArray;
    const existingCategories = enGroup.get('categories') as FormArray;

    // Only load if English data is empty (no hero title and no appels/categories items)
    if ((!heroTitle || heroTitle.trim() === '') && existingAppels.length === 0 && existingCategories.length === 0) {
      enGroup.patchValue({
        heroTitle: 'Calls for Applications',
        heroSubtitle: 'Research and innovation opportunities in Mauritania',
        introText: 'ANRSI regularly launches calls for applications to fund research and innovation projects that contribute to the scientific and technological development of Mauritania.'
      });

      // Add default appels for English
      this.addAppel({
        status: 'active',
        title: 'Research Projects Call 2024',
        description: 'Funding for research projects in priority areas: sustainable agriculture, renewable energy, information technology, and environmental sciences.',
        details: [
          { label: 'Budget:', value: 'Up to 50 million MRO per project' },
          { label: 'Duration:', value: '12-36 months' },
          { label: 'Deadline:', value: 'March 31, 2024' },
          { label: 'Eligibility:', value: 'Research institutions, universities, companies' }
        ],
        actions: [
          { text: 'View Call', url: '#', type: 'primary' },
          { text: 'Download File', url: '#', type: 'outline' }
        ]
      }, 'en');
      this.addAppel({
        status: 'upcoming',
        title: 'Technological Innovation Program',
        description: 'Support for technological innovation projects and technology transfer to Mauritanian industry.',
        details: [
          { label: 'Budget:', value: 'Up to 30 million MRO per project' },
          { label: 'Duration:', value: '6-24 months' },
          { label: 'Opening:', value: 'April 2024' },
          { label: 'Eligibility:', value: 'Startups, SMEs, research centers' }
        ],
        actions: [
          { text: 'Subscribe to Alerts', url: '#', type: 'outline' }
        ]
      }, 'en');
      this.addAppel({
        status: 'closed',
        title: 'Doctoral Scholarships 2023',
        description: 'Scholarship program to support Mauritanian students in their doctoral studies in science and technology.',
        details: [
          { label: 'Amount:', value: '500,000 MRO/year for 3 years' },
          { label: 'Duration:', value: '3 years' },
          { label: 'Deadline:', value: 'December 15, 2023' },
          { label: 'Eligibility:', value: 'Mauritanian master\'s students' }
        ],
        actions: [
          { text: 'View Results', url: '#', type: 'outline' }
        ]
      }, 'en');

      // Add default categories for English
      this.addCategory({
        icon: '🌱',
        title: 'Agriculture & Food Security',
        items: ['Sustainable farming techniques', 'Yield improvement', 'Water resource management', 'Agricultural biotechnologies']
      }, 'en');
      this.addCategory({
        icon: '⚡',
        title: 'Renewable Energy',
        items: ['Solar and wind energy', 'Energy storage', 'Energy efficiency', 'Rural electrification']
      }, 'en');
      this.addCategory({
        icon: '💻',
        title: 'Information Technology',
        items: ['Artificial intelligence', 'Internet of Things (IoT)', 'Cybersecurity', 'Mobile applications']
      }, 'en');
      this.addCategory({
        icon: '🌍',
        title: 'Environment & Climate',
        items: ['Climate change', 'Biodiversity', 'Waste management', 'Pollution and sanitation']
      }, 'en');
      this.addCategory({
        icon: '🏥',
        title: 'Health & Medicine',
        items: ['Preventive medicine', 'Telemedicine', 'Pharmacology', 'Public health']
      }, 'en');
      this.addCategory({
        icon: '🏭',
        title: 'Industry & Innovation',
        items: ['Industrial processes', 'Advanced materials', 'Robotics', 'Technology transfer']
      }, 'en');

      // Add default process steps for English
      this.addProcessStep({ number: 1, title: 'Application Preparation', description: 'Writing the research project, detailed budget, research team, and recommendation letters.' }, 'en');
      this.addProcessStep({ number: 2, title: 'Online Submission', description: 'Submission of the complete file via ANRSI\'s electronic submission platform.' }, 'en');
      this.addProcessStep({ number: 3, title: 'Scientific Evaluation', description: 'Review of the project by a committee of independent experts according to rigorous scientific criteria.' }, 'en');
      this.addProcessStep({ number: 4, title: 'Interview', description: 'Oral presentation of the project before the evaluation committee for pre-selected projects.' }, 'en');
      this.addProcessStep({ number: 5, title: 'Decision and Funding', description: 'Notification of results and signing of the funding agreement for selected projects.' }, 'en');

      // Add default criteria for English
      this.addCriteria({ icon: '🔬', title: 'Scientific Excellence', description: 'Scientific quality of the project, innovation, rigorous methodology, and technical feasibility.' }, 'en');
      this.addCriteria({ icon: '👥', title: 'Research Team', description: 'Team skills and experience, profile complementarity, and project leadership.' }, 'en');
      this.addCriteria({ icon: '💡', title: 'Impact and Innovation', description: 'Innovation potential, expected impact on national development, and knowledge transfer.' }, 'en');
      this.addCriteria({ icon: '💰', title: 'Financial Management', description: 'Realistic and justified budget, cost-effectiveness, and financial management capacity of the applicant.' }, 'en');

      // Add default support services for English
      this.addSupportService({ icon: '📋', title: 'Project Management Training', description: 'Training on project management tools and administrative procedures.' }, 'en');
      this.addSupportService({ icon: '🔍', title: 'Monitoring and Evaluation', description: 'Support in project monitoring and results evaluation.' }, 'en');
      this.addSupportService({ icon: '🌐', title: 'Network and Partnerships', description: 'Facilitation of partnerships with national and international institutions.' }, 'en');
      this.addSupportService({ icon: '📢', title: 'Results Valorization', description: 'Support in publishing and valorizing research results.' }, 'en');

      // Add default contact info for English
      this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'appels@anrsi.mr' }, 'en');
      this.addContactItem({ icon: 'fas fa-phone', label: 'Phone', value: '+222 45 25 44 21' }, 'en');
      this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Address', value: 'ANRSI, Nouakchott, Mauritania' }, 'en');
      this.addContactItem({ icon: 'fas fa-clock', label: 'Hours', value: 'Monday - Friday: 8:00 AM - 4:00 PM' }, 'en');
    }
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



