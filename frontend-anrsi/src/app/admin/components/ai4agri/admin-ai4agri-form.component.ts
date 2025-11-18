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

interface Ai4agriLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  workshops: WorkshopItem[];
  benefits: BenefitItem[];
  partnershipText: string;
  partnershipHighlights: PartnershipHighlight[];
}

interface Ai4agriContent {
  translations: {
    fr: Ai4agriLanguageContent;
    ar: Ai4agriLanguageContent;
    en: Ai4agriLanguageContent;
  };
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
      workshops: this.fb.array([]),
      benefits: this.fb.array([]),
      partnershipText: ['', Validators.required],
      partnershipHighlights: this.fb.array([])
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

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page AI 4 AGRI',
        ar: 'تعديل صفحة AI 4 AGRI',
        en: 'Edit AI 4 AGRI Page'
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
      'introduction': {
        fr: 'Introduction',
        ar: 'مقدمة',
        en: 'Introduction'
      },
      'introText': {
        fr: 'Texte d\'introduction *',
        ar: 'نص المقدمة *',
        en: 'Intro Text *'
      },
      'workshops': {
        fr: 'Ateliers',
        ar: 'ورش العمل',
        en: 'Workshops'
      },
      'date': {
        fr: 'Date *',
        ar: 'التاريخ *',
        en: 'Date *'
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
      'detailsTitle': {
        fr: 'Titre des détails',
        ar: 'عنوان التفاصيل',
        en: 'Details Title'
      },
      'detailsItems': {
        fr: 'Éléments de détails',
        ar: 'عناصر التفاصيل',
        en: 'Details Items'
      },
      'addDetailItem': {
        fr: 'Ajouter un élément de détail',
        ar: 'إضافة عنصر تفاصيل',
        en: 'Add Detail Item'
      },
      'addWorkshop': {
        fr: 'Ajouter un atelier',
        ar: 'إضافة ورشة عمل',
        en: 'Add Workshop'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'إزالة',
        en: 'Remove'
      },
      'benefits': {
        fr: 'Avantages',
        ar: 'الفوائد',
        en: 'Benefits'
      },
      'icon': {
        fr: 'Icône',
        ar: 'أيقونة',
        en: 'Icon'
      },
      'addBenefit': {
        fr: 'Ajouter un avantage',
        ar: 'إضافة فائدة',
        en: 'Add Benefit'
      },
      'partnershipSection': {
        fr: 'Section Partenariat',
        ar: 'قسم الشراكة',
        en: 'Partnership Section'
      },
      'partnershipText': {
        fr: 'Texte de partenariat *',
        ar: 'نص الشراكة *',
        en: 'Partnership Text *'
      },
      'partnershipHighlights': {
        fr: 'Points forts du partenariat',
        ar: 'أبرز الشراكة',
        en: 'Partnership Highlights'
      },
      'addPartnershipHighlight': {
        fr: 'Ajouter un point fort du partenariat',
        ar: 'إضافة نقطة بارزة للشراكة',
        en: 'Add Partnership Highlight'
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

  // Workshops FormArray methods
  get workshops(): FormArray {
    return this.getActiveLanguageFormGroup().get('workshops') as FormArray;
  }

  addWorkshop(item?: WorkshopItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const workshops = langGroup.get('workshops') as FormArray;
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      detailsTitle: [item?.detailsTitle || ''],
      detailsItems: this.fb.array(item?.detailsItems?.map(i => this.fb.control(i)) || [])
    });
    workshops.push(group);
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
    return this.getActiveLanguageFormGroup().get('benefits') as FormArray;
  }

  addBenefit(item?: BenefitItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const benefits = langGroup.get('benefits') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🌱', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    benefits.push(group);
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  // Partnership Highlights FormArray methods
  get partnershipHighlights(): FormArray {
    return this.getActiveLanguageFormGroup().get('partnershipHighlights') as FormArray;
  }

  addPartnershipHighlight(item?: PartnershipHighlight, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const highlights = langGroup.get('partnershipHighlights') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    highlights.push(group);
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
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: Ai4agriContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              const arHeroTitle = arGroup.get('heroTitle')?.value;
              const arWorkshops = arGroup.get('workshops') as FormArray;
              const arBenefits = arGroup.get('benefits') as FormArray;
              if ((!arHeroTitle || arHeroTitle.trim() === '') && arWorkshops.length === 0 && arBenefits.length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              const enHeroTitle = enGroup.get('heroTitle')?.value;
              const enWorkshops = enGroup.get('workshops') as FormArray;
              const enBenefits = enGroup.get('benefits') as FormArray;
              if ((!enHeroTitle || enHeroTitle.trim() === '') && enWorkshops.length === 0 && enBenefits.length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: Ai4agriLanguageContent = parsedContent;
              const content: Ai4agriContent = {
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

  private getEmptyLanguageContent(): Ai4agriLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      workshops: [],
      benefits: [],
      partnershipText: '',
      partnershipHighlights: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'AI 4 AGRI',
      heroSubtitle: 'Intelligence Artificielle pour l\'Agriculture de Précision',
      introText: 'L\'ANRSI organise des ateliers internationaux sur l\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire.',
      partnershipText: 'L\'ANRSI collabore avec des institutions internationales et des experts en IA pour développer des solutions innovantes pour l\'agriculture mauritanienne.'
    });

    // Add default workshops for French
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
    }, 'fr');
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
    }, 'fr');

    // Add default benefits for French
    this.addBenefit({ icon: '🌱', title: 'Agriculture de Précision', description: 'Optimisation des ressources et augmentation des rendements grâce à l\'analyse de données précises.' }, 'fr');
    this.addBenefit({ icon: '📊', title: 'Analyse Prédictive', description: 'Prédiction des conditions météorologiques et des maladies pour une meilleure planification.' }, 'fr');
    this.addBenefit({ icon: '🤖', title: 'Automatisation', description: 'Robotisation des tâches agricoles pour améliorer l\'efficacité et réduire les coûts.' }, 'fr');
    this.addBenefit({ icon: '🌍', title: 'Développement Durable', description: 'Promotion d\'une agriculture respectueuse de l\'environnement et durable.' }, 'fr');

    // Add default partnership highlights for French
    this.addPartnershipHighlight({ icon: '🔬', title: 'Recherche et Développement', description: 'Collaboration avec des centres de recherche internationaux spécialisés en IA agricole.' }, 'fr');
    this.addPartnershipHighlight({ icon: '🎓', title: 'Formation et Éducation', description: 'Programmes de formation pour les agriculteurs et les professionnels du secteur.' }, 'fr');
    this.addPartnershipHighlight({ icon: '🤝', title: 'Coopération Internationale', description: 'Échange d\'expertise et de technologies avec des partenaires internationaux.' }, 'fr');

    // Load default Arabic and English data
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  private loadDefaultArabicData(): void {
    // Check if Arabic data already exists to avoid duplicates
    const arGroup = this.getLanguageFormGroup('ar');
    const heroTitle = arGroup.get('heroTitle')?.value;
    const existingWorkshops = arGroup.get('workshops') as FormArray;
    const existingBenefits = arGroup.get('benefits') as FormArray;

    // Only load if Arabic data is empty (no hero title and no workshops/benefits items)
    if ((!heroTitle || heroTitle.trim() === '') && existingWorkshops.length === 0 && existingBenefits.length === 0) {
      arGroup.patchValue({
        heroTitle: 'الذكاء الاصطناعي للزراعة',
        heroSubtitle: 'الذكاء الاصطناعي للزراعة الدقيقة',
        introText: 'تنظم ANRSI ورش عمل دولية حول تطبيقات الذكاء الاصطناعي في الزراعة الدقيقة لضمان الأمن الغذائي.',
        partnershipText: 'تتعاون ANRSI مع المؤسسات الدولية وخبراء الذكاء الاصطناعي لتطوير حلول مبتكرة للزراعة في موريتانيا.'
      });

      // Add default workshops for Arabic
      this.addWorkshop({
        date: '13-15 فبراير 2024',
        title: 'افتتاح ورشة العمل الدولية حول تطبيقات الذكاء الاصطناعي في الزراعة',
        description: 'ورشة عمل دولية حول "تطبيقات الذكاء الاصطناعي في الزراعة الدقيقة لضمان الأمن الغذائي"',
        detailsTitle: 'برنامج AI 4 AGRI 13-15 فبراير 2024',
        detailsItems: [
          'عرض محاضرات حول الذكاء الاصطناعي الزراعي',
          'نماذج من العروض التقديمية',
          'عروض عملية',
          'بناء شبكة علاقات وتعاون'
        ]
      }, 'ar');
      this.addWorkshop({
        date: 'فبراير 2024',
        title: 'AI 4 Agri - المبادرة المستمرة',
        description: 'برنامج مستمر لتطوير وتطبيق الذكاء الاصطناعي في قطاع الزراعة الموريتانية.',
        detailsTitle: 'أهداف البرنامج',
        detailsItems: [
          'تحديث الزراعة من خلال الذكاء الاصطناعي',
          'تحسين الإنتاجية الزراعية',
          'تعزيز الأمن الغذائي',
          'تدريب المزارعين على التقنيات الجديدة'
        ]
      }, 'ar');

      // Add default benefits for Arabic
      this.addBenefit({ icon: '🌱', title: 'الزراعة الدقيقة', description: 'تحسين استخدام الموارد وزيادة الإنتاجية من خلال تحليل البيانات الدقيقة.' }, 'ar');
      this.addBenefit({ icon: '📊', title: 'التحليلات التنبؤية', description: 'التنبؤ بالظروف الجوية والأمراض للمحاصيل لتحسين التخطيط.' }, 'ar');
      this.addBenefit({ icon: '🤖', title: 'الأتمتة', description: 'استخدام الروبوتات في المهام الزراعية لتحسين الكفاءة وتقليل التكاليف.' }, 'ar');
      this.addBenefit({ icon: '🌍', title: 'التنمية المستدامة', description: 'تشجيع الزراعة الصديقة للبيئة والمستدامة.' }, 'ar');

      // Add default partnership highlights for Arabic
      this.addPartnershipHighlight({ icon: '🔬', title: 'البحث والتطوير', description: 'التعاون مع مراكز بحث دولية متخصصة في الذكاء الاصطناعي الزراعي.' }, 'ar');
      this.addPartnershipHighlight({ icon: '🎓', title: 'التدريب والتعليم', description: 'برامج تدريبية للمزارعين والمتخصصين في القطاع.' }, 'ar');
      this.addPartnershipHighlight({ icon: '🤝', title: 'التعاون الدولي', description: 'تبادل الخبرات والتقنيات مع الشركاء الدوليين.' }, 'ar');
    }
  }

  private loadDefaultEnglishData(): void {
    // Check if English data already exists to avoid duplicates
    const enGroup = this.getLanguageFormGroup('en');
    const heroTitle = enGroup.get('heroTitle')?.value;
    const existingWorkshops = enGroup.get('workshops') as FormArray;
    const existingBenefits = enGroup.get('benefits') as FormArray;

    // Only load if English data is empty (no hero title and no workshops/benefits items)
    if ((!heroTitle || heroTitle.trim() === '') && existingWorkshops.length === 0 && existingBenefits.length === 0) {
      enGroup.patchValue({
        heroTitle: 'AI 4 AGRI',
        heroSubtitle: 'Artificial Intelligence for Precision Agriculture',
        introText: 'ANRSI organizes international workshops on the application of Artificial Intelligence in precision agriculture for food security.',
        partnershipText: 'ANRSI collaborates with international institutions and AI experts to develop innovative solutions for Mauritanian agriculture.'
      });

      // Add default workshops for English
      this.addWorkshop({
        date: '13-15 February 2024',
        title: 'Opening of the International Workshop on AI Applications in Agriculture',
        description: 'International Workshop on "Application of Artificial Intelligence in Precision Agriculture for Food Security"',
        detailsTitle: 'AI 4 AGRI Program 13-15 February 2024',
        detailsItems: [
          'Presentations on agricultural AI',
          'Sample presentations',
          'Practical demonstrations',
          'Networking and collaboration'
        ]
      }, 'en');
      this.addWorkshop({
        date: 'February 2024',
        title: 'AI 4 Agri - Ongoing Initiative',
        description: 'Ongoing program for the development and application of AI in the Mauritanian agricultural sector.',
        detailsTitle: 'Program Objectives',
        detailsItems: [
          'Modernize agriculture through AI',
          'Improve agricultural productivity',
          'Strengthen food security',
          'Train farmers in new technologies'
        ]
      }, 'en');

      // Add default benefits for English
      this.addBenefit({ icon: '🌱', title: 'Precision Agriculture', description: 'Optimize resources and increase yields through precise data analysis.' }, 'en');
      this.addBenefit({ icon: '📊', title: 'Predictive Analytics', description: 'Forecast weather conditions and crop diseases for better planning.' }, 'en');
      this.addBenefit({ icon: '🤖', title: 'Automation', description: 'Robotic agricultural tasks to improve efficiency and reduce costs.' }, 'en');
      this.addBenefit({ icon: '🌍', title: 'Sustainable Development', description: 'Promote environmentally friendly and sustainable agriculture.' }, 'en');

      // Add default partnership highlights for English
      this.addPartnershipHighlight({ icon: '🔬', title: 'Research & Development', description: 'Collaboration with international research centers specialized in agricultural AI.' }, 'en');
      this.addPartnershipHighlight({ icon: '🎓', title: 'Training & Education', description: 'Training programs for farmers and sector professionals.' }, 'en');
      this.addPartnershipHighlight({ icon: '🤝', title: 'International Cooperation', description: 'Exchange of expertise and technology with international partners.' }, 'en');
    }
  }

  populateForm(content: Ai4agriContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || '',
          partnershipText: langContent.partnershipText || ''
        });

        // Clear existing arrays
        const workshops = langGroup.get('workshops') as FormArray;
        const benefits = langGroup.get('benefits') as FormArray;
        const highlights = langGroup.get('partnershipHighlights') as FormArray;
        
        while (workshops.length) workshops.removeAt(0);
        while (benefits.length) benefits.removeAt(0);
        while (highlights.length) highlights.removeAt(0);

        // Populate arrays
        langContent.workshops?.forEach(item => this.addWorkshop(item, lang));
        langContent.benefits?.forEach(item => this.addBenefit(item, lang));
        langContent.partnershipHighlights?.forEach(item => this.addPartnershipHighlight(item, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations (will save empty strings for incomplete languages)
    const content: Ai4agriContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'AI 4 AGRI';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'AI 4 AGRI',
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
        slug: 'ai4agri',
        title: 'AI 4 AGRI',
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

  private buildLanguageContent(langData: any): Ai4agriLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      workshops: (langData.workshops || []).map((item: any) => ({
        date: item.date,
        title: item.title,
        description: item.description,
        detailsTitle: item.detailsTitle,
        detailsItems: item.detailsItems || []
      })),
      benefits: langData.benefits || [],
      partnershipText: langData.partnershipText || '',
      partnershipHighlights: langData.partnershipHighlights || []
    };
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}



