import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface ObjectiveItem {
  number: number;
  title: string;
  description: string;
}

interface ObjectivesLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  objectives: ObjectiveItem[];
}

interface ObjectivesContent {
  translations: {
    fr: ObjectivesLanguageContent;
    ar: ObjectivesLanguageContent;
    en: ObjectivesLanguageContent;
  };
}

@Component({
  selector: 'app-admin-objectives-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-objectives-form.component.html',
  styleUrls: ['./admin-objectives-form.component.scss']
})
export class AdminObjectivesFormComponent implements OnInit {
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
      sectionTitle: ['', Validators.required],
      objectives: this.fb.array([])
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

  // Objectives FormArray methods
  get objectives(): FormArray {
    return this.getActiveLanguageFormGroup().get('objectives') as FormArray;
  }

  addObjective(item?: ObjectiveItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const objectives = langGroup.get('objectives') as FormArray;
    const group = this.fb.group({
      number: [item?.number || objectives.length + 1, Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    objectives.push(group);
  }

  removeObjective(index: number): void {
    this.objectives.removeAt(index);
    // Update numbers after removal
    this.updateObjectiveNumbers();
  }

  updateObjectiveNumbers(): void {
    this.objectives.controls.forEach((control, index) => {
      control.patchValue({ number: index + 1 }, { emitEvent: false });
    });
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('objectives').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: ObjectivesContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              const arHeroTitle = arGroup.get('heroTitle')?.value;
              const arObjectives = arGroup.get('objectives') as FormArray;
              if ((!arHeroTitle || arHeroTitle.trim() === '') && arObjectives.length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              const enHeroTitle = enGroup.get('heroTitle')?.value;
              const enObjectives = enGroup.get('objectives') as FormArray;
              if ((!enHeroTitle || enHeroTitle.trim() === '') && enObjectives.length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: ObjectivesLanguageContent = parsedContent;
              const content: ObjectivesContent = {
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

  private getEmptyLanguageContent(): ObjectivesLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      sectionTitle: '',
      objectives: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Objectifs',
      heroSubtitle: 'Les objectifs stratégiques de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Nos Objectifs'
    });

    // Clear existing array for French
    const frObjectives = frGroup.get('objectives') as FormArray;
    while (frObjectives.length) frObjectives.removeAt(0);

    // Add default objectives for French
    this.addObjective({
      number: 1,
      title: 'Accroître la production scientifique Nationale',
      description: 'L\'ANRSI vise à stimuler et augmenter significativement la production scientifique nationale en soutenant les chercheurs et les institutions de recherche.'
    }, 'fr');
    this.addObjective({
      number: 2,
      title: 'Améliorer l\'excellence et le rayonnement de la recherche scientifique en Mauritanie',
      description: 'Nous nous engageons à promouvoir l\'excellence dans la recherche scientifique et à renforcer le rayonnement international de la recherche mauritanienne.'
    }, 'fr');
    this.addObjective({
      number: 3,
      title: 'Améliorer l\'impact de la recherche et l\'innovation sur l\'économie, la société et le développement durable',
      description: 'L\'ANRSI travaille à maximiser l\'impact de la recherche et de l\'innovation sur le développement économique, social et durable de la Mauritanie.'
    }, 'fr');
    this.addObjective({
      number: 4,
      title: 'Accroître la capacité d\'innovation et de création de richesses de notre pays par et grâce à la recherche',
      description: 'Nous visons à renforcer les capacités d\'innovation nationales et à favoriser la création de richesses grâce aux résultats de la recherche scientifique.'
    }, 'fr');

    // Load default Arabic and English data
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  private loadDefaultArabicData(): void {
    // Check if Arabic data already exists to avoid duplicates
    const arGroup = this.getLanguageFormGroup('ar');
    const heroTitle = arGroup.get('heroTitle')?.value;
    const existingObjectives = arGroup.get('objectives') as FormArray;

    // Only load if Arabic data is empty (no hero title and no objectives)
    if ((!heroTitle || heroTitle.trim() === '') && existingObjectives.length === 0) {
      arGroup.patchValue({
        heroTitle: 'الأهداف',
        heroSubtitle: 'الأهداف الاستراتيجية للوكالة الوطنية للبحث العلمي والابتكار',
        sectionTitle: 'أهدافنا'
      });

      // Clear existing array for Arabic
      while (existingObjectives.length) existingObjectives.removeAt(0);

      // Add default objectives for Arabic
      this.addObjective({
        number: 1,
        title: 'زيادة الإنتاج العلمي الوطني',
        description: 'تهدف الوكالة إلى تحفيز وزيادة الإنتاج العلمي الوطني بشكل كبير من خلال دعم الباحثين والمؤسسات البحثية.'
      }, 'ar');
      this.addObjective({
        number: 2,
        title: 'تعزيز التميز وانتشار البحث العلمي في موريتانيا',
        description: 'نلتزم بتعزيز التميز في البحث العلمي وتقوية الانتشار الدولي للبحث الموريتاني.'
      }, 'ar');
      this.addObjective({
        number: 3,
        title: 'تعزيز أثر البحث والابتكار على الاقتصاد والمجتمع والتنمية المستدامة',
        description: 'تعمل الوكالة على تعظيم أثر البحث والابتكار على التنمية الاقتصادية والاجتماعية والمستدامة في موريتانيا.'
      }, 'ar');
      this.addObjective({
        number: 4,
        title: 'زيادة قدرة البلاد على الابتكار وخلق الثروات من خلال البحث',
        description: 'نسعى لتعزيز القدرات الوطنية للابتكار وتشجيع خلق الثروات بفضل نتائج البحث العلمي.'
      }, 'ar');
    }
  }

  private loadDefaultEnglishData(): void {
    // Check if English data already exists to avoid duplicates
    const enGroup = this.getLanguageFormGroup('en');
    const heroTitle = enGroup.get('heroTitle')?.value;
    const existingObjectives = enGroup.get('objectives') as FormArray;

    // Only load if English data is empty (no hero title and no objectives)
    if ((!heroTitle || heroTitle.trim() === '') && existingObjectives.length === 0) {
      enGroup.patchValue({
        heroTitle: 'Objectives',
        heroSubtitle: 'The strategic objectives of the National Agency for Scientific Research and Innovation',
        sectionTitle: 'Our Objectives'
      });

      // Clear existing array for English
      while (existingObjectives.length) existingObjectives.removeAt(0);

      // Add default objectives for English
      this.addObjective({
        number: 1,
        title: 'Increase National Scientific Output',
        description: 'ANRSI aims to stimulate and significantly increase national scientific output by supporting researchers and research institutions.'
      }, 'en');
      this.addObjective({
        number: 2,
        title: 'Enhance Excellence and Visibility of Scientific Research in Mauritania',
        description: 'We are committed to promoting excellence in scientific research and strengthening the international visibility of Mauritanian research.'
      }, 'en');
      this.addObjective({
        number: 3,
        title: 'Improve the Impact of Research and Innovation on Economy, Society, and Sustainable Development',
        description: 'ANRSI works to maximize the impact of research and innovation on Mauritania\'s economic, social, and sustainable development.'
      }, 'en');
      this.addObjective({
        number: 4,
        title: 'Increase the Country\'s Innovation Capacity and Wealth Creation through Research',
        description: 'We aim to strengthen national innovation capacities and foster wealth creation through scientific research outcomes.'
      }, 'en');
    }
  }

  populateForm(content: ObjectivesContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          sectionTitle: langContent.sectionTitle || ''
        });

        // Clear existing array
        const objectives = langGroup.get('objectives') as FormArray;
        while (objectives.length) objectives.removeAt(0);

        // Populate array
        langContent.objectives?.forEach(objective => this.addObjective(objective, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: ObjectivesContent = {
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
        translations[lang] = {
          title: langContent.heroTitle || 'Objectifs',
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          extra: JSON.stringify(langContent) // Store the full content in extra (JSONB)
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
        slug: 'objectives',
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

  private buildLanguageContent(langData: any): ObjectivesLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      sectionTitle: langData.sectionTitle || '',
      objectives: langData.objectives || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Objectifs',
        ar: 'تعديل صفحة الأهداف',
        en: 'Edit Objectives Page'
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
      'contentSection': {
        fr: 'Section Contenu',
        ar: 'قسم المحتوى',
        en: 'Content Section'
      },
      'sectionTitle': {
        fr: 'Titre de la section *',
        ar: 'عنوان القسم *',
        en: 'Section Title *'
      },
      'objectives': {
        fr: 'Objectifs',
        ar: 'الأهداف',
        en: 'Objectives'
      },
      'number': {
        fr: 'Numéro *',
        ar: 'الرقم *',
        en: 'Number *'
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



