import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface FinancementLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  process: ProcessStep[];
  requirements: string[];
  benefits: string[];
  ctaTitle?: string;
  ctaDescription?: string;
}

interface FinancementContent {
  translations: {
    fr: FinancementLanguageContent;
    ar: FinancementLanguageContent;
    en: FinancementLanguageContent;
  };
}

@Component({
  selector: 'app-admin-financement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-financement-form.component.html',
  styleUrls: ['./admin-financement-form.component.scss']
})
export class AdminFinancementFormComponent implements OnInit {
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
      process: this.fb.array([]),
      requirements: this.fb.array([]),
      benefits: this.fb.array([]),
      ctaTitle: [''],
      ctaDescription: ['']
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

  // Process Steps FormArray methods
  get process(): FormArray {
    return this.getActiveLanguageFormGroup().get('process') as FormArray;
  }

  addProcessStep(step?: ProcessStep, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const process = langGroup.get('process') as FormArray;
    const group = this.fb.group({
      step: [step?.step || process.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required],
      icon: [step?.icon || 'fas fa-search', Validators.required]
    });
    process.push(group);
  }

  removeProcessStep(index: number): void {
    this.process.removeAt(index);
    this.process.controls.forEach((control, i) => {
      control.patchValue({ step: i + 1 });
    });
  }

  // Requirements FormArray methods
  get requirements(): FormArray {
    return this.getActiveLanguageFormGroup().get('requirements') as FormArray;
  }

  addRequirement(value = '', lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const requirements = langGroup.get('requirements') as FormArray;
    requirements.push(this.fb.control(value, Validators.required));
  }

  removeRequirement(index: number): void {
    this.requirements.removeAt(index);
  }

  // Benefits FormArray methods
  get benefits(): FormArray {
    return this.getActiveLanguageFormGroup().get('benefits') as FormArray;
  }

  addBenefit(value = '', lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const benefits = langGroup.get('benefits') as FormArray;
    benefits.push(this.fb.control(value, Validators.required));
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('financement').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: FinancementContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              if (!arGroup.get('heroTitle')?.value || (arGroup.get('process') as FormArray).length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              if (!enGroup.get('heroTitle')?.value || (enGroup.get('process') as FormArray).length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: FinancementLanguageContent = parsedContent;
              const content: FinancementContent = {
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

  private getEmptyLanguageContent(): FinancementLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      process: [],
      requirements: [],
      benefits: [],
      ctaTitle: '',
      ctaDescription: ''
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Financement',
      heroSubtitle: 'L\'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s\'inscrivent dans le cadre des programmes de l\'Agence qui sont annoncés annuellement.',
      ctaTitle: 'Prêt à candidater ?',
      ctaDescription: 'Consultez nos appels à candidatures et soumettez votre projet'
    });

    // Clear existing arrays for French
    const frProcess = frGroup.get('process') as FormArray;
    const frRequirements = frGroup.get('requirements') as FormArray;
    const frBenefits = frGroup.get('benefits') as FormArray;
    while (frProcess.length) frProcess.removeAt(0);
    while (frRequirements.length) frRequirements.removeAt(0);
    while (frBenefits.length) frBenefits.removeAt(0);

    // Add default process steps for French
    this.addProcessStep({ step: 1, title: 'Identifier le programme', description: 'Le candidat doit identifier le programme adapté à son activité', icon: 'fas fa-search' }, 'fr');
    this.addProcessStep({ step: 2, title: 'Respecter les délais', description: 'Respecter les délais et conditions de candidature publiés sur le site internet de l\'Agence', icon: 'fas fa-clock' }, 'fr');
    this.addProcessStep({ step: 3, title: 'Consulter la réglementation', description: 'Consulter l\'arrêté ministériel réglementant le financement pour plus de détails', icon: 'fas fa-file-alt' }, 'fr');

    // Add default requirements for French
    this.addRequirement('Être une structure de recherche reconnue', 'fr');
    this.addRequirement('Avoir un projet conforme aux programmes de l\'ANRSI', 'fr');
    this.addRequirement('Respecter les délais de candidature', 'fr');
    this.addRequirement('Fournir tous les documents requis', 'fr');
    this.addRequirement('Justifier de la pertinence scientifique du projet', 'fr');

    // Add default benefits for French
    this.addBenefit('Financement des activités de recherche scientifique', 'fr');
    this.addBenefit('Soutien aux projets innovants', 'fr');
    this.addBenefit('Accompagnement dans la réalisation des projets', 'fr');
    this.addBenefit('Mise en réseau avec d\'autres chercheurs', 'fr');
    this.addBenefit('Valorisation des résultats de recherche', 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    
    // Check if Arabic data already exists
    if (arGroup.get('heroTitle')?.value && (arGroup.get('process') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arGroup.patchValue({
      heroTitle: 'التمويل',
      heroSubtitle: 'تمول الوكالة العديد من الأنشطة المتعلقة بالبحث العلمي. هذه الأنشطة تأتي ضمن برامج الوكالة التي يتم الإعلان عنها سنويًا.',
      ctaTitle: 'هل أنت مستعد للتقديم؟',
      ctaDescription: 'اطلع على دعواتنا للمشاريع وقدم مشروعك'
    });

    // Clear existing arrays for Arabic
    const arProcess = arGroup.get('process') as FormArray;
    const arRequirements = arGroup.get('requirements') as FormArray;
    const arBenefits = arGroup.get('benefits') as FormArray;
    while (arProcess.length) arProcess.removeAt(0);
    while (arRequirements.length) arRequirements.removeAt(0);
    while (arBenefits.length) arBenefits.removeAt(0);

    // Add default process steps for Arabic
    this.addProcessStep({ step: 1, title: 'تحديد البرنامج', description: 'يجب على المتقدم تحديد البرنامج المناسب لنشاطه', icon: 'fas fa-search' }, 'ar');
    this.addProcessStep({ step: 2, title: 'الالتزام بالمواعيد النهائية', description: 'الالتزام بالمواعيد النهائية وشروط التقديم المنشورة على موقع الوكالة', icon: 'fas fa-clock' }, 'ar');
    this.addProcessStep({ step: 3, title: 'مراجعة اللوائح', description: 'مراجعة القرار الوزاري المنظم للتمويل لمزيد من التفاصيل', icon: 'fas fa-file-alt' }, 'ar');

    // Add default requirements for Arabic
    this.addRequirement('أن تكون مؤسسة بحثية معترف بها', 'ar');
    this.addRequirement('امتلاك مشروع متوافق مع برامج الوكالة', 'ar');
    this.addRequirement('الالتزام بمواعيد التقديم', 'ar');
    this.addRequirement('تقديم جميع المستندات المطلوبة', 'ar');
    this.addRequirement('تبرير الأهمية العلمية للمشروع', 'ar');

    // Add default benefits for Arabic
    this.addBenefit('تمويل الأنشطة البحثية العلمية', 'ar');
    this.addBenefit('دعم المشاريع المبتكرة', 'ar');
    this.addBenefit('توجيه في تنفيذ المشاريع', 'ar');
    this.addBenefit('التواصل مع باحثين آخرين', 'ar');
    this.addBenefit('تسليط الضوء على نتائج البحث', 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    
    // Check if English data already exists
    if (enGroup.get('heroTitle')?.value && (enGroup.get('process') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enGroup.patchValue({
      heroTitle: 'Funding',
      heroSubtitle: 'The Agency funds numerous activities related to scientific research. These activities are part of the Agency\'s programs, announced annually.',
      ctaTitle: 'Ready to Apply?',
      ctaDescription: 'Check our calls for proposals and submit your project'
    });

    // Clear existing arrays for English
    const enProcess = enGroup.get('process') as FormArray;
    const enRequirements = enGroup.get('requirements') as FormArray;
    const enBenefits = enGroup.get('benefits') as FormArray;
    while (enProcess.length) enProcess.removeAt(0);
    while (enRequirements.length) enRequirements.removeAt(0);
    while (enBenefits.length) enBenefits.removeAt(0);

    // Add default process steps for English
    this.addProcessStep({ step: 1, title: 'Identify the Program', description: 'The applicant must identify the program suitable for their activity', icon: 'fas fa-search' }, 'en');
    this.addProcessStep({ step: 2, title: 'Meet Deadlines', description: 'Respect the deadlines and application conditions published on the Agency\'s website', icon: 'fas fa-clock' }, 'en');
    this.addProcessStep({ step: 3, title: 'Consult Regulations', description: 'Consult the ministerial decree regulating funding for more details', icon: 'fas fa-file-alt' }, 'en');

    // Add default requirements for English
    this.addRequirement('Be a recognized research institution', 'en');
    this.addRequirement('Have a project in accordance with ANRSI programs', 'en');
    this.addRequirement('Respect application deadlines', 'en');
    this.addRequirement('Provide all required documents', 'en');
    this.addRequirement('Justify the scientific relevance of the project', 'en');

    // Add default benefits for English
    this.addBenefit('Funding for scientific research activities', 'en');
    this.addBenefit('Support for innovative projects', 'en');
    this.addBenefit('Guidance in project implementation', 'en');
    this.addBenefit('Networking with other researchers', 'en');
    this.addBenefit('Valorization of research results', 'en');
  }

  populateForm(content: FinancementContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          ctaTitle: langContent.ctaTitle || '',
          ctaDescription: langContent.ctaDescription || ''
        });

        // Clear existing arrays
        const process = langGroup.get('process') as FormArray;
        const requirements = langGroup.get('requirements') as FormArray;
        const benefits = langGroup.get('benefits') as FormArray;
        while (process.length) process.removeAt(0);
        while (requirements.length) requirements.removeAt(0);
        while (benefits.length) benefits.removeAt(0);

        // Populate arrays
        langContent.process?.forEach(step => this.addProcessStep(step, lang));
        langContent.requirements?.forEach(req => this.addRequirement(req, lang));
        langContent.benefits?.forEach(benefit => this.addBenefit(benefit, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: FinancementContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Financement';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Financement',
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
        slug: 'financement',
        title: 'Financement',
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

  private buildLanguageContent(langData: any): FinancementLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      process: langData.process || [],
      requirements: langData.requirements || [],
      benefits: langData.benefits || [],
      ctaTitle: langData.ctaTitle || '',
      ctaDescription: langData.ctaDescription || ''
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Financement',
        ar: 'تعديل صفحة التمويل',
        en: 'Edit Funding Page'
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
      'processSection': {
        fr: 'Processus de Candidature',
        ar: 'عملية التقديم',
        en: 'Application Process'
      },
      'requirementsSection': {
        fr: 'Conditions Requises',
        ar: 'الشروط المطلوبة',
        en: 'Requirements'
      },
      'benefitsSection': {
        fr: 'Avantages du Financement',
        ar: 'مزايا التمويل',
        en: 'Funding Benefits'
      },
      'ctaSection': {
        fr: 'Section Appel à l\'Action',
        ar: 'قسم الدعوة إلى العمل',
        en: 'Call to Action Section'
      },
      'stepNumber': {
        fr: 'Numéro d\'étape *',
        ar: 'رقم الخطوة *',
        en: 'Step Number *'
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
      'icon': {
        fr: 'Icône (classe FontAwesome) *',
        ar: 'أيقونة (فئة FontAwesome) *',
        en: 'Icon (FontAwesome class) *'
      },
      'addProcessStep': {
        fr: 'Ajouter une étape du processus',
        ar: 'إضافة خطوة في العملية',
        en: 'Add Process Step'
      },
      'addRequirement': {
        fr: 'Ajouter une condition',
        ar: 'إضافة شرط',
        en: 'Add Requirement'
      },
      'addBenefit': {
        fr: 'Ajouter un avantage',
        ar: 'إضافة ميزة',
        en: 'Add Benefit'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'إزالة',
        en: 'Remove'
      },
      'ctaTitle': {
        fr: 'Titre CTA',
        ar: 'عنوان الدعوة إلى العمل',
        en: 'CTA Title'
      },
      'ctaDescription': {
        fr: 'Description CTA',
        ar: 'وصف الدعوة إلى العمل',
        en: 'CTA Description'
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



