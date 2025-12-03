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

interface ExpertAnrsiLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  requirements: RequirementItem[];
  domains: DomainItem[];
  processSteps: ProcessStep[];
  benefits: BenefitItem[];
  applicationText: string;
  applicationLink: string;
  contactInfo: ContactItem[];
  requiredDocuments: string[];
}

interface ExpertAnrsiContent {
  translations: {
    fr: ExpertAnrsiLanguageContent;
    ar: ExpertAnrsiLanguageContent;
    en: ExpertAnrsiLanguageContent;
  };
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
    // Check for language query parameter from snapshot first
    const langParam = this.route.snapshot.queryParams['lang'];
    if (langParam && ['fr', 'ar', 'en'].includes(langParam)) {
      this.activeLanguage = langParam as 'fr' | 'ar' | 'en';
    }
    
    // Subscribe to query params for future changes
    this.route.queryParams.subscribe(params => {
      if (params['lang'] && ['fr', 'ar', 'en'].includes(params['lang'])) {
        this.activeLanguage = params['lang'] as 'fr' | 'ar' | 'en';
      }
    });
    
    // Load page after initial setup
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
      requirements: this.fb.array([]),
      domains: this.fb.array([]),
      processSteps: this.fb.array([]),
      benefits: this.fb.array([]),
      applicationText: ['', Validators.required],
      applicationLink: [''],
      contactInfo: this.fb.array([]),
      requiredDocuments: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    const group = this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
    if (!group) {
      console.warn(`Form group for language ${this.activeLanguage} not found, using 'fr' as fallback`);
      return this.form.get(`translations.fr`) as FormGroup;
    }
    return group;
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

  // Requirements FormArray methods
  get requirements(): FormArray {
    return this.getActiveLanguageFormGroup().get('requirements') as FormArray;
  }

  addRequirement(item?: RequirementItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const requirements = langGroup.get('requirements') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🎓', Validators.required],
      title: [item?.title || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    requirements.push(group);
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
    return this.getActiveLanguageFormGroup().get('domains') as FormArray;
  }

  addDomain(item?: DomainItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const domains = langGroup.get('domains') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    domains.push(group);
  }

  removeDomain(index: number): void {
    this.domains.removeAt(index);
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

  // Benefits FormArray methods
  get benefits(): FormArray {
    return this.getActiveLanguageFormGroup().get('benefits') as FormArray;
  }

  addBenefit(item?: BenefitItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const benefits = langGroup.get('benefits') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '💼', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    benefits.push(group);
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
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

  // Required Documents FormArray methods
  get requiredDocuments(): FormArray {
    return this.getActiveLanguageFormGroup().get('requiredDocuments') as FormArray;
  }

  addRequiredDocument(value = '', lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const requiredDocuments = langGroup.get('requiredDocuments') as FormArray;
    requiredDocuments.push(this.fb.control(value));
  }

  removeRequiredDocument(index: number): void {
    this.requiredDocuments.removeAt(index);
  }

  loadPage(): void {
    // Prevent multiple simultaneous loads
    if (this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.pageService.getPageBySlug('expert-anrsi').subscribe({
      next: (page) => {
        try {
          this.pageId = page.id || null;
          
          // First, try to get from page.translations (new system)
          if (page.translations && Object.keys(page.translations).length > 0) {
            try {
              const content: ExpertAnrsiContent = {
                translations: {
                  fr: this.getEmptyLanguageContent(),
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
              
              // Extract content from each translation
              ['fr', 'ar', 'en'].forEach(lang => {
                const translation = page.translations?.[lang];
                if (translation && translation.content) {
                  try {
                    const parsedContent = JSON.parse(translation.content);
                    content.translations[lang as 'fr' | 'ar' | 'en'] = parsedContent;
                  } catch (e) {
                    console.error(`Error parsing ${lang} translation content:`, e);
                  }
                }
              });
              
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              const arHeroTitle = arGroup.get('heroTitle')?.value;
              const arRequirements = arGroup.get('requirements') as FormArray;
              const arDomains = arGroup.get('domains') as FormArray;
              if ((!arHeroTitle || arHeroTitle.trim() === '') && arRequirements.length === 0 && arDomains.length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              const enHeroTitle = enGroup.get('heroTitle')?.value;
              const enRequirements = enGroup.get('requirements') as FormArray;
              const enDomains = enGroup.get('domains') as FormArray;
              if ((!enHeroTitle || enHeroTitle.trim() === '') && enRequirements.length === 0 && enDomains.length === 0) {
                this.loadDefaultEnglishData();
              }
            } catch (e) {
              console.error('Error processing translations:', e);
              // Fall through to page.content check
            }
          }
          
          // Fallback: Try to get from page.content (old system or backup)
          if (page.content) {
            try {
              const parsedContent = JSON.parse(page.content);
              // Check if it's the new format with translations
              if (parsedContent.translations) {
                const content: ExpertAnrsiContent = parsedContent;
                this.populateForm(content);
                // Check if Arabic data is empty and load defaults
                const arGroup = this.getLanguageFormGroup('ar');
                const arHeroTitle = arGroup.get('heroTitle')?.value;
                const arRequirements = arGroup.get('requirements') as FormArray;
                const arDomains = arGroup.get('domains') as FormArray;
                if ((!arHeroTitle || arHeroTitle.trim() === '') && arRequirements.length === 0 && arDomains.length === 0) {
                  this.loadDefaultArabicData();
                }
                // Check if English data is empty and load defaults
                const enGroup = this.getLanguageFormGroup('en');
                const enHeroTitle = enGroup.get('heroTitle')?.value;
                const enRequirements = enGroup.get('requirements') as FormArray;
                const enDomains = enGroup.get('domains') as FormArray;
                if ((!enHeroTitle || enHeroTitle.trim() === '') && enRequirements.length === 0 && enDomains.length === 0) {
                  this.loadDefaultEnglishData();
                }
              } else {
                // Old format - migrate to new format
                const oldContent: ExpertAnrsiLanguageContent = parsedContent;
                const content: ExpertAnrsiContent = {
                  translations: {
                    fr: oldContent,
                    ar: this.getEmptyLanguageContent(),
                    en: this.getEmptyLanguageContent()
                  }
                };
                this.populateForm(content);
                // Load default Arabic and English data for old format
                this.loadDefaultArabicData();
                this.loadDefaultEnglishData();
              }
            } catch (e) {
              console.error('Error parsing content:', e);
              this.loadDefaultData();
            }
          } else if (!page.translations || Object.keys(page.translations).length === 0) {
            this.loadDefaultData();
          }
        } catch (error) {
          console.error('Error processing page data:', error);
          this.loadDefaultData();
        } finally {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading page:', error);
        if (error.status === 404) {
          this.loadDefaultData();
        } else {
          this.errorMessage = this.getLabel('errorLoadingPage');
        }
        this.isLoading = false;
      }
    });
  }

  private getEmptyLanguageContent(): ExpertAnrsiLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      requirements: [],
      domains: [],
      processSteps: [],
      benefits: [],
      applicationText: '',
      applicationLink: '',
      contactInfo: [],
      requiredDocuments: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Expert à l\'ANRSI',
      heroSubtitle: 'Rejoignez notre réseau d\'experts scientifiques et technologiques',
      introText: 'L\'Agence Nationale de la Recherche Scientifique et de l\'Innovation (ANRSI) recrute des experts qualifiés pour évaluer les projets de recherche et contribuer au développement scientifique de la Mauritanie.',
      applicationText: 'Pour postuler en tant qu\'expert ANRSI, veuillez envoyer votre dossier de candidature à :'
    });

    // Add default requirements for French
    this.addRequirement({
      icon: '🎓',
      title: 'Formation Académique',
      items: [
        'Doctorat dans un domaine scientifique ou technologique',
        'Expérience significative en recherche',
        'Publications scientifiques reconnues',
        'Maîtrise du français et/ou de l\'anglais'
      ]
    }, 'fr');
    this.addRequirement({
      icon: '🔬',
      title: 'Expertise Technique',
      items: [
        'Connaissance approfondie du domaine d\'expertise',
        'Expérience en évaluation de projets',
        'Capacité d\'analyse et de synthèse',
        'Rigueur scientifique et éthique'
      ]
    }, 'fr');
    this.addRequirement({
      icon: '🌍',
      title: 'Engagement',
      items: [
        'Disponibilité pour les évaluations',
        'Engagement envers le développement scientifique',
        'Respect des délais et procédures',
        'Confidentialité et impartialité'
      ]
    }, 'fr');

    // Add default domains for French
    this.addDomain({ icon: '🔬', title: 'Sciences Exactes', description: 'Mathématiques, Physique, Chimie, Sciences de la Terre' }, 'fr');
    this.addDomain({ icon: '🌱', title: 'Sciences de la Vie', description: 'Biologie, Agriculture, Médecine, Sciences Vétérinaires' }, 'fr');
    this.addDomain({ icon: '💻', title: 'Technologies de l\'Information', description: 'Informatique, Intelligence Artificielle, Télécommunications' }, 'fr');
    this.addDomain({ icon: '⚡', title: 'Sciences de l\'Ingénieur', description: 'Génie Civil, Mécanique, Électrique, Énergies Renouvelables' }, 'fr');
    this.addDomain({ icon: '🌍', title: 'Sciences Sociales', description: 'Économie, Sociologie, Droit, Sciences Politiques' }, 'fr');
    this.addDomain({ icon: '🌿', title: 'Sciences de l\'Environnement', description: 'Écologie, Climatologie, Gestion des Ressources Naturelles' }, 'fr');

    // Add default process steps for French
    this.addProcessStep({ number: 1, title: 'Candidature', description: 'Soumission du dossier de candidature avec CV détaillé, liste des publications et lettre de motivation.' }, 'fr');
    this.addProcessStep({ number: 2, title: 'Évaluation', description: 'Examen du dossier par un comité d\'experts de l\'ANRSI selon des critères objectifs.' }, 'fr');
    this.addProcessStep({ number: 3, title: 'Entretien', description: 'Entretien avec les candidats retenus pour évaluer leurs compétences et leur motivation.' }, 'fr');
    this.addProcessStep({ number: 4, title: 'Formation', description: 'Formation aux procédures d\'évaluation de l\'ANRSI et aux outils utilisés.' }, 'fr');
    this.addProcessStep({ number: 5, title: 'Intégration', description: 'Intégration dans le réseau d\'experts et attribution des premières missions d\'évaluation.' }, 'fr');

    // Add default benefits for French
    this.addBenefit({ icon: '💼', title: 'Rémunération', description: 'Rémunération attractive pour chaque mission d\'évaluation selon l\'expertise et la complexité.' }, 'fr');
    this.addBenefit({ icon: '🌐', title: 'Réseau International', description: 'Intégration dans un réseau d\'experts internationaux et opportunités de collaboration.' }, 'fr');
    this.addBenefit({ icon: '📚', title: 'Formation Continue', description: 'Accès à des formations et séminaires pour maintenir et développer ses compétences.' }, 'fr');
    this.addBenefit({ icon: '🏆', title: 'Reconnaissance', description: 'Reconnaissance officielle en tant qu\'expert scientifique et contribution au développement national.' }, 'fr');

    // Add default contact info for French
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'expert@anrsi.mr' }, 'fr');
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' }, 'fr');

    // Add default required documents for French
    this.addRequiredDocument('CV détaillé avec liste des publications', 'fr');
    this.addRequiredDocument('Lettre de motivation', 'fr');
    this.addRequiredDocument('Copies des diplômes et certifications', 'fr');
    this.addRequiredDocument('Lettres de recommandation (optionnel)', 'fr');
    this.addRequiredDocument('Liste des projets de recherche dirigés', 'fr');

    // Load default Arabic and English data
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  private loadDefaultArabicData(): void {
    // Check if Arabic data already exists to avoid duplicates
    const arGroup = this.getLanguageFormGroup('ar');
    const heroTitle = arGroup.get('heroTitle')?.value;
    const existingRequirements = arGroup.get('requirements') as FormArray;
    const existingDomains = arGroup.get('domains') as FormArray;

    // Only load if Arabic data is empty (no hero title and no requirements/domains items)
    if ((!heroTitle || heroTitle.trim() === '') && existingRequirements.length === 0 && existingDomains.length === 0) {
      arGroup.patchValue({
        heroTitle: 'خبير ANRSI',
        heroSubtitle: 'انضم إلى شبكة الخبراء العلمية والتكنولوجية لدينا',
        introText: 'تقوم الوكالة الوطنية للبحث العلمي والابتكار (ANRSI) بتجنيد خبراء مؤهلين لتقييم المشاريع البحثية والمساهمة في التنمية العلمية في موريتانيا.',
        applicationText: 'للتقديم كخبير ANRSI، يرجى إرسال طلبكم إلى:'
      });

      // Add default requirements for Arabic
      this.addRequirement({
        icon: '🎓',
        title: 'الخلفية الأكاديمية',
        items: [
          'دكتوراه في مجال علمي أو تكنولوجي',
          'خبرة بحثية كبيرة',
          'منشورات علمية معترف بها',
          'إجادة الفرنسية و/أو الإنجليزية'
        ]
      }, 'ar');
      this.addRequirement({
        icon: '🔬',
        title: 'الخبرة التقنية',
        items: [
          'معرفة متعمقة بمجال الخبرة',
          'خبرة في تقييم المشاريع',
          'مهارات تحليلية وقدرة على التلخيص',
          'دقة علمية وأخلاقية'
        ]
      }, 'ar');
      this.addRequirement({
        icon: '🌍',
        title: 'الالتزام',
        items: [
          'التفرغ للتقييمات',
          'الالتزام بالتنمية العلمية',
          'الالتزام بالمواعيد والإجراءات',
          'السرية والحيادية'
        ]
      }, 'ar');

      // Add default domains for Arabic
      this.addDomain({ icon: '🔬', title: 'العلوم الدقيقة', description: 'الرياضيات، الفيزياء، الكيمياء، علوم الأرض' }, 'ar');
      this.addDomain({ icon: '🌱', title: 'علوم الحياة', description: 'البيولوجيا، الزراعة، الطب، العلوم البيطرية' }, 'ar');
      this.addDomain({ icon: '💻', title: 'تقنيات المعلومات', description: 'علوم الحاسوب، الذكاء الاصطناعي، الاتصالات' }, 'ar');
      this.addDomain({ icon: '⚡', title: 'علوم الهندسة', description: 'الهندسة المدنية، الميكانيكية، الكهربائية، الطاقات المتجددة' }, 'ar');
      this.addDomain({ icon: '🌍', title: 'العلوم الاجتماعية', description: 'الاقتصاد، علم الاجتماع، القانون، العلوم السياسية' }, 'ar');
      this.addDomain({ icon: '🌿', title: 'علوم البيئة', description: 'علم البيئة، علم المناخ، إدارة الموارد الطبيعية' }, 'ar');

      // Add default process steps for Arabic
      this.addProcessStep({ number: 1, title: 'التقديم', description: 'تقديم طلب مع سيرة ذاتية مفصلة، قائمة المنشورات، ورسالة الدافع.' }, 'ar');
      this.addProcessStep({ number: 2, title: 'التقييم', description: 'يتم مراجعة الطلب من قبل لجنة خبراء ANRSI وفق معايير موضوعية.' }, 'ar');
      this.addProcessStep({ number: 3, title: 'المقابلة', description: 'إجراء مقابلة مع المرشحين المختارين لتقييم المهارات والدافعية.' }, 'ar');
      this.addProcessStep({ number: 4, title: 'التدريب', description: 'تدريب على إجراءات تقييم ANRSI والأدوات المستخدمة.' }, 'ar');
      this.addProcessStep({ number: 5, title: 'الانضمام', description: 'الانضمام إلى شبكة الخبراء وتكليف أول مهام التقييم.' }, 'ar');

      // Add default benefits for Arabic
      this.addBenefit({ icon: '💼', title: 'التعويض المالي', description: 'تعويض جذاب لكل مهمة تقييم وفق الخبرة والتعقيد.' }, 'ar');
      this.addBenefit({ icon: '🌐', title: 'شبكة دولية', description: 'الانضمام إلى شبكة دولية من الخبراء وفرص التعاون.' }, 'ar');
      this.addBenefit({ icon: '📚', title: 'التدريب المستمر', description: 'الوصول إلى تدريبات وندوات للحفاظ على المهارات وتطويرها.' }, 'ar');
      this.addBenefit({ icon: '🏆', title: 'الاعتراف', description: 'الاعتراف الرسمي كخبير علمي والمساهمة في التنمية الوطنية.' }, 'ar');

      // Add default contact info for Arabic
      this.addContactItem({ icon: 'fas fa-envelope', label: 'البريد الإلكتروني', value: 'expert@anrsi.mr' }, 'ar');
      this.addContactItem({ icon: 'fas fa-phone', label: 'الهاتف', value: '+222 45 25 44 21' }, 'ar');

      // Add default required documents for Arabic
      this.addRequiredDocument('سيرة ذاتية مفصلة مع قائمة المنشورات', 'ar');
      this.addRequiredDocument('رسالة الدافع', 'ar');
      this.addRequiredDocument('نسخ الشهادات والدبلومات', 'ar');
      this.addRequiredDocument('خطابات التوصية (اختياري)', 'ar');
      this.addRequiredDocument('قائمة المشاريع البحثية التي تم إدارتها', 'ar');
    }
  }

  private loadDefaultEnglishData(): void {
    // Check if English data already exists to avoid duplicates
    const enGroup = this.getLanguageFormGroup('en');
    const heroTitle = enGroup.get('heroTitle')?.value;
    const existingRequirements = enGroup.get('requirements') as FormArray;
    const existingDomains = enGroup.get('domains') as FormArray;

    // Only load if English data is empty (no hero title and no requirements/domains items)
    if ((!heroTitle || heroTitle.trim() === '') && existingRequirements.length === 0 && existingDomains.length === 0) {
      enGroup.patchValue({
        heroTitle: 'ANRSI Expert',
        heroSubtitle: 'Join our network of scientific and technological experts',
        introText: 'The National Agency for Scientific Research and Innovation (ANRSI) recruits qualified experts to evaluate research projects and contribute to the scientific development of Mauritania.',
        applicationText: 'To apply as an ANRSI expert, please send your application to:'
      });

      // Add default requirements for English
      this.addRequirement({
        icon: '🎓',
        title: 'Academic Background',
        items: [
          'PhD in a scientific or technological field',
          'Significant research experience',
          'Recognized scientific publications',
          'Fluency in French and/or English'
        ]
      }, 'en');
      this.addRequirement({
        icon: '🔬',
        title: 'Technical Expertise',
        items: [
          'In-depth knowledge of the field of expertise',
          'Experience in project evaluation',
          'Analytical and synthesis skills',
          'Scientific rigor and ethics'
        ]
      }, 'en');
      this.addRequirement({
        icon: '🌍',
        title: 'Commitment',
        items: [
          'Availability for evaluations',
          'Commitment to scientific development',
          'Respect for deadlines and procedures',
          'Confidentiality and impartiality'
        ]
      }, 'en');

      // Add default domains for English
      this.addDomain({ icon: '🔬', title: 'Exact Sciences', description: 'Mathematics, Physics, Chemistry, Earth Sciences' }, 'en');
      this.addDomain({ icon: '🌱', title: 'Life Sciences', description: 'Biology, Agriculture, Medicine, Veterinary Sciences' }, 'en');
      this.addDomain({ icon: '💻', title: 'Information Technologies', description: 'Computer Science, Artificial Intelligence, Telecommunications' }, 'en');
      this.addDomain({ icon: '⚡', title: 'Engineering Sciences', description: 'Civil, Mechanical, Electrical Engineering, Renewable Energies' }, 'en');
      this.addDomain({ icon: '🌍', title: 'Social Sciences', description: 'Economics, Sociology, Law, Political Science' }, 'en');
      this.addDomain({ icon: '🌿', title: 'Environmental Sciences', description: 'Ecology, Climatology, Natural Resource Management' }, 'en');

      // Add default process steps for English
      this.addProcessStep({ number: 1, title: 'Application', description: 'Submit application with detailed CV, list of publications, and motivation letter.' }, 'en');
      this.addProcessStep({ number: 2, title: 'Evaluation', description: 'The application is reviewed by an ANRSI expert committee based on objective criteria.' }, 'en');
      this.addProcessStep({ number: 3, title: 'Interview', description: 'Interview with selected candidates to assess skills and motivation.' }, 'en');
      this.addProcessStep({ number: 4, title: 'Training', description: 'Training on ANRSI evaluation procedures and tools.' }, 'en');
      this.addProcessStep({ number: 5, title: 'Integration', description: 'Integration into the expert network and assignment of initial evaluation tasks.' }, 'en');

      // Add default benefits for English
      this.addBenefit({ icon: '💼', title: 'Compensation', description: 'Attractive remuneration for each evaluation mission according to expertise and complexity.' }, 'en');
      this.addBenefit({ icon: '🌐', title: 'International Network', description: 'Integration into an international network of experts and collaboration opportunities.' }, 'en');
      this.addBenefit({ icon: '📚', title: 'Continuous Training', description: 'Access to training and seminars to maintain and develop skills.' }, 'en');
      this.addBenefit({ icon: '🏆', title: 'Recognition', description: 'Official recognition as a scientific expert and contribution to national development.' }, 'en');

      // Add default contact info for English
      this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'expert@anrsi.mr' }, 'en');
      this.addContactItem({ icon: 'fas fa-phone', label: 'Phone', value: '+222 45 25 44 21' }, 'en');

      // Add default required documents for English
      this.addRequiredDocument('Detailed CV with list of publications', 'en');
      this.addRequiredDocument('Motivation letter', 'en');
      this.addRequiredDocument('Copies of diplomas and certificates', 'en');
      this.addRequiredDocument('Recommendation letters (optional)', 'en');
      this.addRequiredDocument('List of research projects led', 'en');
    }
  }

  populateForm(content: ExpertAnrsiContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || '',
          applicationText: langContent.applicationText || '',
          applicationLink: langContent.applicationLink || ''
        });

        // Clear existing arrays
        const requirements = langGroup.get('requirements') as FormArray;
        const domains = langGroup.get('domains') as FormArray;
        const processSteps = langGroup.get('processSteps') as FormArray;
        const benefits = langGroup.get('benefits') as FormArray;
        const contactInfo = langGroup.get('contactInfo') as FormArray;
        const requiredDocuments = langGroup.get('requiredDocuments') as FormArray;
        while (requirements.length) requirements.removeAt(0);
        while (domains.length) domains.removeAt(0);
        while (processSteps.length) processSteps.removeAt(0);
        while (benefits.length) benefits.removeAt(0);
        while (contactInfo.length) contactInfo.removeAt(0);
        while (requiredDocuments.length) requiredDocuments.removeAt(0);

        // Populate arrays
        langContent.requirements?.forEach(item => this.addRequirement(item, lang));
        langContent.domains?.forEach(item => this.addDomain(item, lang));
        langContent.processSteps?.forEach(item => this.addProcessStep(item, lang));
        langContent.benefits?.forEach(item => this.addBenefit(item, lang));
        langContent.contactInfo?.forEach(item => this.addContactItem(item, lang));
        langContent.requiredDocuments?.forEach(item => this.addRequiredDocument(item, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: ExpertAnrsiContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Build translations for the new structure
    const translations: { [key: string]: any } = {};
    
    (['fr', 'ar', 'en'] as const).forEach(lang => {
      const langContent = content.translations[lang];
      if (langContent) {
        const langContentJson = JSON.stringify(langContent);
        translations[lang] = {
          title: langContent.heroTitle || 'Expert à l\'ANRSI',
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          content: langContentJson, // Store the language-specific content in content field
          extra: langContentJson // Also store in extra for backward compatibility
        };
      }
    });

    const updateData: PageUpdateDTO = {
      translations: translations,
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
        slug: 'expert-anrsi',
        pageType: 'STRUCTURED',
        translations: translations,
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

  private buildLanguageContent(langData: any): ExpertAnrsiLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      requirements: (langData.requirements || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        items: item.items || []
      })),
      domains: langData.domains || [],
      processSteps: langData.processSteps || [],
      benefits: langData.benefits || [],
      applicationText: langData.applicationText || '',
      applicationLink: langData.applicationLink || '',
      contactInfo: langData.contactInfo || [],
      requiredDocuments: langData.requiredDocuments || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Expert ANRSI',
        ar: 'تعديل صفحة خبير ANRSI',
        en: 'Edit Expert ANRSI Page'
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
      'requirementsSection': {
        fr: 'Profil Requis (Exigences)',
        ar: 'الملف المطلوب (المتطلبات)',
        en: 'Required Profile (Requirements)'
      },
      'domainsSection': {
        fr: 'Domaines d\'Expertise',
        ar: 'مجالات الخبرة',
        en: 'Expertise Domains'
      },
      'processStepsSection': {
        fr: 'Processus de Recrutement',
        ar: 'عملية التوظيف',
        en: 'Recruitment Process'
      },
      'benefitsSection': {
        fr: 'Avantages d\'être Expert ANRSI',
        ar: 'مزايا كونك خبير ANRSI',
        en: 'Benefits of Being an ANRSI Expert'
      },
      'applicationSection': {
        fr: 'Comment Postuler',
        ar: 'كيفية التقديم',
        en: 'How to Apply'
      },
      'icon': {
        fr: 'Icône',
        ar: 'أيقونة',
        en: 'Icon'
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
      'applicationText': {
        fr: 'Texte de candidature *',
        ar: 'نص التقديم *',
        en: 'Application Text *'
      },
      'applicationLink': {
        fr: 'Lien de candidature',
        ar: 'رابط التقديم',
        en: 'Application Link'
      },
      'contactInformation': {
        fr: 'Informations de Contact',
        ar: 'معلومات الاتصال',
        en: 'Contact Information'
      },
      'iconFontAwesome': {
        fr: 'Icône (classe FontAwesome) *',
        ar: 'أيقونة (فئة FontAwesome) *',
        en: 'Icon (FontAwesome class) *'
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
      'requiredDocuments': {
        fr: 'Documents Requis',
        ar: 'المستندات المطلوبة',
        en: 'Required Documents'
      },
      'addRequirement': {
        fr: 'Ajouter une exigence',
        ar: 'إضافة متطلب',
        en: 'Add Requirement'
      },
      'addDomain': {
        fr: 'Ajouter un domaine',
        ar: 'إضافة مجال',
        en: 'Add Domain'
      },
      'addProcessStep': {
        fr: 'Ajouter une étape du processus',
        ar: 'إضافة خطوة في العملية',
        en: 'Add Process Step'
      },
      'addBenefit': {
        fr: 'Ajouter un avantage',
        ar: 'إضافة ميزة',
        en: 'Add Benefit'
      },
      'addContactItem': {
        fr: 'Ajouter un élément de contact',
        ar: 'إضافة عنصر اتصال',
        en: 'Add Contact Item'
      },
      'addRequiredDocument': {
        fr: 'Ajouter un document requis',
        ar: 'إضافة مستند مطلوب',
        en: 'Add Required Document'
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



