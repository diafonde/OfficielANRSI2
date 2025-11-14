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
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: CooperationContent = parsedContent;
              this.populateForm(content);
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

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.cooperationInfo.title || content.translations.ar.cooperationInfo.title || content.translations.en.cooperationInfo.title || 'Coopération & Partenariats';
    const heroSubtitle = frContent.cooperationInfo.description || content.translations.ar.cooperationInfo.description || content.translations.en.cooperationInfo.description || '';

    const updateData: PageUpdateDTO = {
      title: 'Coopération & Partenariats',
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
        slug: 'cooperation',
        title: 'Coopération & Partenariats',
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



