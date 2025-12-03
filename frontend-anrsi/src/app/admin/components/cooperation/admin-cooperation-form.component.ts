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

interface CooperationLanguageContent {
  cooperationInfo: CooperationInfo;
  partnerships: Partnership[];
}

interface CooperationContent {
  translations: {
    fr: CooperationLanguageContent;
    ar: CooperationLanguageContent;
    en: CooperationLanguageContent;
  };
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
      cooperationInfo: this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        benefits: this.fb.array([])
      }),
      partnerships: this.fb.array([])
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
    const cooperationInfo = langGroup.get('cooperationInfo') as FormGroup;
    return cooperationInfo.get('title')?.value || cooperationInfo.get('description')?.value || false;
  }

  isLanguageFormValid(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.valid;
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || 'Français';
  }

  // Cooperation Info FormGroup methods
  get cooperationInfo(): FormGroup {
    return this.getActiveLanguageFormGroup().get('cooperationInfo') as FormGroup;
  }

  get benefits(): FormArray {
    return this.cooperationInfo.get('benefits') as FormArray;
  }

  addBenefit(value = '', lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const cooperationInfo = langGroup.get('cooperationInfo') as FormGroup;
    const benefits = cooperationInfo.get('benefits') as FormArray;
    benefits.push(this.fb.control(value, Validators.required));
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  // Partnerships FormArray methods
  get partnerships(): FormArray {
    return this.getActiveLanguageFormGroup().get('partnerships') as FormArray;
  }

  addPartnership(item?: Partnership, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const partnerships = langGroup.get('partnerships') as FormArray;
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
    partnerships.push(group);
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
        
        // First, try to get from page.translations (new system)
        if (page.translations && Object.keys(page.translations).length > 0) {
          try {
            const content: CooperationContent = {
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
            const arCooperationInfo = arGroup.get('cooperationInfo') as FormGroup;
            if (!arCooperationInfo.get('title')?.value || (arGroup.get('partnerships') as FormArray).length === 0) {
              this.loadDefaultArabicData();
            }
            // Check if English data is empty and load defaults
            const enGroup = this.getLanguageFormGroup('en');
            const enCooperationInfo = enGroup.get('cooperationInfo') as FormGroup;
            if (!enCooperationInfo.get('title')?.value || (enGroup.get('partnerships') as FormArray).length === 0) {
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
              const content: CooperationContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              const arCooperationInfo = arGroup.get('cooperationInfo') as FormGroup;
              if (!arCooperationInfo.get('title')?.value || (arGroup.get('partnerships') as FormArray).length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              const enCooperationInfo = enGroup.get('cooperationInfo') as FormGroup;
              if (!enCooperationInfo.get('title')?.value || (enGroup.get('partnerships') as FormArray).length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: CooperationLanguageContent = parsedContent;
              const content: CooperationContent = {
                translations: {
                  fr: oldContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
              this.populateForm(content);
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

  private getEmptyLanguageContent(): CooperationLanguageContent {
    return {
      cooperationInfo: {
        title: '',
        description: '',
        benefits: []
      },
      partnerships: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    const frCooperationInfo = frGroup.get('cooperationInfo') as FormGroup;
    frCooperationInfo.patchValue({
      title: 'Coopération & Partenariats',
      description: 'L\'Agence est liée à des institutions d\'intérêt commun par le biais d\'accords de coopération et de partenariat pour atteindre des objectifs communs.'
    });

    // Clear existing arrays for French
    const frBenefits = frCooperationInfo.get('benefits') as FormArray;
    const frPartnerships = frGroup.get('partnerships') as FormArray;
    while (frBenefits.length) frBenefits.removeAt(0);
    while (frPartnerships.length) frPartnerships.removeAt(0);

    // Add default benefits for French
    this.addBenefit('Renforcement des capacités de recherche', 'fr');
    this.addBenefit('Échange d\'expertise et de connaissances', 'fr');
    this.addBenefit('Développement de projets innovants', 'fr');
    this.addBenefit('Mise en réseau des chercheurs', 'fr');
    this.addBenefit('Valorisation des résultats de recherche', 'fr');
    this.addBenefit('Transfert de technologie', 'fr');

    // Add default partnerships for French
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
    }, 'fr');
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
    }, 'fr');
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
    }, 'fr');
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
    }, 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    const arCooperationInfo = arGroup.get('cooperationInfo') as FormGroup;
    
    // Check if Arabic data already exists
    if (arCooperationInfo.get('title')?.value && (arGroup.get('partnerships') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arCooperationInfo.patchValue({
      title: 'التعاون والشراكات',
      description: 'ترتبط الوكالة بمؤسسات ذات مصلحة مشتركة من خلال اتفاقيات التعاون والشراكة لتحقيق أهداف مشتركة.'
    });

    // Clear existing arrays for Arabic
    const arBenefits = arCooperationInfo.get('benefits') as FormArray;
    const arPartnerships = arGroup.get('partnerships') as FormArray;
    while (arBenefits.length) arBenefits.removeAt(0);
    while (arPartnerships.length) arPartnerships.removeAt(0);

    // Add default benefits for Arabic
    this.addBenefit('تعزيز قدرات البحث العلمي', 'ar');
    this.addBenefit('تبادل الخبرات والمعرفة', 'ar');
    this.addBenefit('تطوير مشاريع مبتكرة', 'ar');
    this.addBenefit('بناء شبكة علاقات بين الباحثين', 'ar');
    this.addBenefit('تسليط الضوء على نتائج البحث', 'ar');
    this.addBenefit('نقل التكنولوجيا', 'ar');

    // Add default partnerships for Arabic
    this.addPartnership({
      id: 'anrsa-senegal',
      title: 'اتفاقية شراكة مع ANRSA السنغال',
      description: 'شراكة استراتيجية مع الوكالة الوطنية للبحث العلمي التطبيقي في السنغال',
      type: 'شراكة',
      country: 'السنغال',
      flag: '🇸🇳',
      objectives: [
        'تبادل الخبرات في البحث العلمي',
        'التعاون في المشاريع المشتركة',
        'تعزيز قدرات البحث العلمي',
        'مشاركة الموارد والبنى التحتية'
      ],
      status: 'نشط',
      icon: 'fas fa-handshake',
      color: '#0a3d62'
    }, 'ar');
    this.addPartnership({
      id: 'cnrst-maroc',
      title: 'اتفاقية تعاون مع CNRST المغرب',
      description: 'التعاون مع المركز الوطني للبحث العلمي والتقني في المغرب',
      type: 'تعاون',
      country: 'المغرب',
      flag: '🇲🇦',
      objectives: [
        'تطوير مشاريع بحثية مشتركة',
        'تدريب وتبادل الباحثين',
        'تسليط الضوء على نتائج البحث',
        'الابتكار التكنولوجي'
      ],
      status: 'نشط',
      icon: 'fas fa-microscope',
      color: '#20a39e'
    }, 'ar');
    this.addPartnership({
      id: 'tunisie-dri',
      title: 'شراكة مع DRI تونس',
      description: 'التعاون مع قسم البحث العلمي والابتكار في تونس',
      type: 'شراكة',
      country: 'تونس',
      flag: '🇹🇳',
      objectives: [
        'البحث التطبيقي والابتكار',
        'نقل التكنولوجيا',
        'التدريب المتخصص',
        'تطوير حلول مبتكرة'
      ],
      status: 'نشط',
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    }, 'ar');
    this.addPartnership({
      id: 'iset-rosso',
      title: 'شراكة مع ISET روسو',
      description: 'التعاون مع المعهد العالي للتعليم التكنولوجي بروسو لإنتاج الخضروات المحمية',
      type: 'شراكة محلية',
      country: 'موريتانيا',
      flag: '🇲🇷',
      objectives: [
        'إنتاج الخضروات المحمية',
        'تقنيات زراعية مبتكرة',
        'تدريب تقني متخصص',
        'تنمية زراعية محلية'
      ],
      details: 'تهدف هذه الشراكة المحلية إلى تطوير تقنيات مبتكرة لإنتاج الخضروات المحمية، مما يساهم في التنمية الزراعية والأمن الغذائي في موريتانيا.',
      status: 'نشط',
      icon: 'fas fa-seedling',
      color: '#126564'
    }, 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    const enCooperationInfo = enGroup.get('cooperationInfo') as FormGroup;
    
    // Check if English data already exists
    if (enCooperationInfo.get('title')?.value && (enGroup.get('partnerships') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enCooperationInfo.patchValue({
      title: 'Cooperation & Partnerships',
      description: 'The Agency is linked to institutions of common interest through cooperation and partnership agreements to achieve shared objectives.'
    });

    // Clear existing arrays for English
    const enBenefits = enCooperationInfo.get('benefits') as FormArray;
    const enPartnerships = enGroup.get('partnerships') as FormArray;
    while (enBenefits.length) enBenefits.removeAt(0);
    while (enPartnerships.length) enPartnerships.removeAt(0);

    // Add default benefits for English
    this.addBenefit('Strengthening research capacities', 'en');
    this.addBenefit('Exchange of expertise and knowledge', 'en');
    this.addBenefit('Development of innovative projects', 'en');
    this.addBenefit('Networking among researchers', 'en');
    this.addBenefit('Valorization of research results', 'en');
    this.addBenefit('Technology transfer', 'en');

    // Add default partnerships for English
    this.addPartnership({
      id: 'anrsa-senegal',
      title: 'Partnership Agreement with ANRSA Senegal',
      description: 'Strategic partnership with the National Agency for Applied Scientific Research of Senegal',
      type: 'Partnership',
      country: 'Senegal',
      flag: '🇸🇳',
      objectives: [
        'Exchange of expertise in scientific research',
        'Collaboration on joint projects',
        'Strengthening research capacities',
        'Sharing of resources and infrastructure'
      ],
      status: 'Active',
      icon: 'fas fa-handshake',
      color: '#0a3d62'
    }, 'en');
    this.addPartnership({
      id: 'cnrst-maroc',
      title: 'Cooperation Agreement with CNRST Morocco',
      description: 'Cooperation with the National Center for Scientific and Technical Research of Morocco',
      type: 'Cooperation',
      country: 'Morocco',
      flag: '🇲🇦',
      objectives: [
        'Development of joint research projects',
        'Training and exchange of researchers',
        'Valorization of research results',
        'Technological innovation'
      ],
      status: 'Active',
      icon: 'fas fa-microscope',
      color: '#20a39e'
    }, 'en');
    this.addPartnership({
      id: 'tunisie-dri',
      title: 'Partnership with DRI Tunisia',
      description: 'Collaboration with the Department of Scientific Research and Innovation in Tunisia',
      type: 'Partnership',
      country: 'Tunisia',
      flag: '🇹🇳',
      objectives: [
        'Applied research and innovation',
        'Technology transfer',
        'Specialized training',
        'Development of innovative solutions'
      ],
      status: 'Active',
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    }, 'en');
    this.addPartnership({
      id: 'iset-rosso',
      title: 'Partnership with ISET Rosso',
      description: 'Collaboration with the Higher Institute of Technological Education of Rosso for protected vegetable production',
      type: 'Local Partnership',
      country: 'Mauritania',
      flag: '🇲🇷',
      objectives: [
        'Production of protected vegetables',
        'Innovative agricultural techniques',
        'Specialized technical training',
        'Local agricultural development'
      ],
      details: 'This local partnership aims to develop innovative techniques for protected vegetable production, thereby contributing to agricultural development and food security in Mauritania.',
      status: 'Active',
      icon: 'fas fa-seedling',
      color: '#126564'
    }, 'en');
  }

  populateForm(content: CooperationContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        const cooperationInfo = langGroup.get('cooperationInfo') as FormGroup;
        cooperationInfo.patchValue({
          title: langContent.cooperationInfo?.title || '',
          description: langContent.cooperationInfo?.description || ''
        });

        // Clear existing arrays
        const benefits = cooperationInfo.get('benefits') as FormArray;
        const partnerships = langGroup.get('partnerships') as FormArray;
        while (benefits.length) benefits.removeAt(0);
        while (partnerships.length) partnerships.removeAt(0);

        // Populate arrays
        langContent.cooperationInfo?.benefits?.forEach(benefit => this.addBenefit(benefit, lang));
        langContent.partnerships?.forEach(partnership => this.addPartnership(partnership, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: CooperationContent = {
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
          title: langContent.cooperationInfo?.title || 'Coopération & Partenariats',
          heroTitle: langContent.cooperationInfo?.title || '',
          heroSubtitle: langContent.cooperationInfo?.description || '',
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
        slug: 'cooperation',
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

  private buildLanguageContent(langData: any): CooperationLanguageContent {
    return {
      cooperationInfo: {
        title: langData.cooperationInfo?.title || '',
        description: langData.cooperationInfo?.description || '',
        benefits: langData.cooperationInfo?.benefits || []
      },
      partnerships: (langData.partnerships || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.type,
        country: p.country,
        flag: p.flag,
        objectives: p.objectives || [],
        status: p.status,
        icon: p.icon,
        color: p.color,
        details: p.details || undefined
      }))
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Coopération & Partenariats',
        ar: 'تعديل صفحة التعاون والشراكات',
        en: 'Edit Cooperation & Partnerships Page'
      },
      'cancel': {
        fr: 'Annuler',
        ar: 'إلغاء',
        en: 'Cancel'
      },
      'cooperationInfoSection': {
        fr: 'Informations sur la Coopération',
        ar: 'معلومات التعاون',
        en: 'Cooperation Information'
      },
      'partnershipsSection': {
        fr: 'Partenariats',
        ar: 'الشراكات',
        en: 'Partnerships'
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
      'benefits': {
        fr: 'Avantages',
        ar: 'المزايا',
        en: 'Benefits'
      },
      'addBenefit': {
        fr: 'Ajouter un avantage',
        ar: 'إضافة ميزة',
        en: 'Add Benefit'
      },
      'id': {
        fr: 'ID *',
        ar: 'المعرف *',
        en: 'ID *'
      },
      'type': {
        fr: 'Type *',
        ar: 'النوع *',
        en: 'Type *'
      },
      'country': {
        fr: 'Pays *',
        ar: 'البلد *',
        en: 'Country *'
      },
      'flag': {
        fr: 'Drapeau (Emoji) *',
        ar: 'العلم (رموز تعبيرية) *',
        en: 'Flag (Emoji) *'
      },
      'status': {
        fr: 'Statut *',
        ar: 'الحالة *',
        en: 'Status *'
      },
      'icon': {
        fr: 'Icône (classe FontAwesome) *',
        ar: 'أيقونة (فئة FontAwesome) *',
        en: 'Icon (FontAwesome class) *'
      },
      'color': {
        fr: 'Couleur (Hex) *',
        ar: 'اللون (Hex) *',
        en: 'Color (Hex) *'
      },
      'details': {
        fr: 'Détails (Optionnel)',
        ar: 'التفاصيل (اختياري)',
        en: 'Details (Optional)'
      },
      'objectives': {
        fr: 'Objectifs',
        ar: 'الأهداف',
        en: 'Objectives'
      },
      'addPartnership': {
        fr: 'Ajouter un partenariat',
        ar: 'إضافة شراكة',
        en: 'Add Partnership'
      },
      'addObjective': {
        fr: 'Ajouter un objectif',
        ar: 'إضافة هدف',
        en: 'Add Objective'
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



