import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface StrategicVisionLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  visionTitle: string;
  visionText: string;
  messageTitle: string;
  messageText: string;
  valuesTitle: string;
  values: ValueItem[];
}

interface StrategicVisionContent {
  translations: {
    fr: StrategicVisionLanguageContent;
    ar: StrategicVisionLanguageContent;
    en: StrategicVisionLanguageContent;
  };
}

@Component({
  selector: 'app-admin-strategic-vision-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-strategic-vision-form.component.html',
  styleUrls: ['./admin-strategic-vision-form.component.scss']
})
export class AdminStrategicVisionFormComponent implements OnInit {
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
      visionTitle: ['', Validators.required],
      visionText: ['', Validators.required],
      messageTitle: ['', Validators.required],
      messageText: ['', Validators.required],
      valuesTitle: ['', Validators.required],
      values: this.fb.array([])
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

  // Values FormArray methods
  get values(): FormArray {
    return this.getActiveLanguageFormGroup().get('values') as FormArray;
  }

  addValue(item?: ValueItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const values = langGroup.get('values') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    values.push(group);
  }

  removeValue(index: number): void {
    this.values.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('strategic-vision').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: StrategicVisionContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              if (!arGroup.get('heroTitle')?.value || (arGroup.get('values') as FormArray).length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              if (!enGroup.get('heroTitle')?.value || (enGroup.get('values') as FormArray).length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: StrategicVisionLanguageContent = parsedContent;
              const content: StrategicVisionContent = {
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

  private getEmptyLanguageContent(): StrategicVisionLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      visionTitle: '',
      visionText: '',
      messageTitle: '',
      messageText: '',
      valuesTitle: '',
      values: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Vision Stratégique',
      heroSubtitle: 'La vision et le message de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      visionTitle: 'Vision',
      visionText: 'L\'Agence aspire à renforcer les capacités et les compétences en recherche scientifique pour être un leader régional et une référence dans le domaine de la science et de la technologie.',
      messageTitle: 'Le Message',
      messageText: 'Soutenir l\'innovation et promouvoir la recherche scientifique au service du développement du pays et de ses industries.',
      valuesTitle: 'Nos Valeurs'
    });

    // Clear existing array for French
    const frValues = frGroup.get('values') as FormArray;
    while (frValues.length) frValues.removeAt(0);

    // Add default values for French
    this.addValue({
      icon: '🔬',
      title: 'Excellence Scientifique',
      description: 'Promouvoir la qualité et l\'excellence dans toutes nos initiatives de recherche'
    }, 'fr');
    this.addValue({
      icon: '🤝',
      title: 'Collaboration',
      description: 'Encourager la coopération entre chercheurs, institutions et partenaires'
    }, 'fr');
    this.addValue({
      icon: '🌱',
      title: 'Innovation',
      description: 'Favoriser l\'innovation technologique et scientifique pour le développement'
    }, 'fr');
    this.addValue({
      icon: '🎯',
      title: 'Impact',
      description: 'Maximiser l\'impact de la recherche sur la société et l\'économie'
    }, 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    
    // Check if Arabic data already exists
    if (arGroup.get('heroTitle')?.value && (arGroup.get('values') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arGroup.patchValue({
      heroTitle: 'الرؤية الاستراتيجية',
      heroSubtitle: 'الرؤية والرسالة للوكالة الوطنية للبحث العلمي والابتكار',
      visionTitle: 'الرؤية',
      visionText: 'تهدف الوكالة إلى تعزيز القدرات والكفاءات في البحث العلمي لتكون رائدة إقليمياً ومرجعاً في مجال العلوم والتكنولوجيا.',
      messageTitle: 'الرسالة',
      messageText: 'دعم الابتكار وتعزيز البحث العلمي لخدمة تنمية البلاد وصناعاتها.',
      valuesTitle: 'قيمنا'
    });

    // Clear existing array for Arabic
    const arValues = arGroup.get('values') as FormArray;
    while (arValues.length) arValues.removeAt(0);

    // Add default values for Arabic
    this.addValue({
      icon: '🔬',
      title: 'التميز العلمي',
      description: 'تعزيز الجودة والتميز في جميع مبادرات البحث العلمي'
    }, 'ar');
    this.addValue({
      icon: '🤝',
      title: 'التعاون',
      description: 'تشجيع التعاون بين الباحثين والمؤسسات والشركاء'
    }, 'ar');
    this.addValue({
      icon: '🌱',
      title: 'الابتكار',
      description: 'تشجيع الابتكار التكنولوجي والعلمي من أجل التنمية'
    }, 'ar');
    this.addValue({
      icon: '🎯',
      title: 'الأثر',
      description: 'تعظيم أثر البحث العلمي على المجتمع والاقتصاد'
    }, 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    
    // Check if English data already exists
    if (enGroup.get('heroTitle')?.value && (enGroup.get('values') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enGroup.patchValue({
      heroTitle: 'Strategic Vision',
      heroSubtitle: 'The vision and message of the National Agency for Scientific Research and Innovation',
      visionTitle: 'Vision',
      visionText: 'The Agency aims to strengthen research capacities and skills to become a regional leader and a reference in the field of science and technology.',
      messageTitle: 'Message',
      messageText: 'Supporting innovation and promoting scientific research to serve the country\'s development and its industries.',
      valuesTitle: 'Our Values'
    });

    // Clear existing array for English
    const enValues = enGroup.get('values') as FormArray;
    while (enValues.length) enValues.removeAt(0);

    // Add default values for English
    this.addValue({
      icon: '🔬',
      title: 'Scientific Excellence',
      description: 'Promoting quality and excellence in all our research initiatives'
    }, 'en');
    this.addValue({
      icon: '🤝',
      title: 'Collaboration',
      description: 'Encouraging cooperation among researchers, institutions, and partners'
    }, 'en');
    this.addValue({
      icon: '🌱',
      title: 'Innovation',
      description: 'Fostering technological and scientific innovation for development'
    }, 'en');
    this.addValue({
      icon: '🎯',
      title: 'Impact',
      description: 'Maximizing the impact of research on society and the economy'
    }, 'en');
  }

  populateForm(content: StrategicVisionContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          visionTitle: langContent.visionTitle || '',
          visionText: langContent.visionText || '',
          messageTitle: langContent.messageTitle || '',
          messageText: langContent.messageText || '',
          valuesTitle: langContent.valuesTitle || ''
        });

        // Clear existing array
        const values = langGroup.get('values') as FormArray;
        while (values.length) values.removeAt(0);

        // Populate array
        langContent.values?.forEach(value => this.addValue(value, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: StrategicVisionContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Vision Stratégique';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Vision Stratégique',
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
        slug: 'strategic-vision',
        title: 'Vision Stratégique',
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

  private buildLanguageContent(langData: any): StrategicVisionLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      visionTitle: langData.visionTitle || '',
      visionText: langData.visionText || '',
      messageTitle: langData.messageTitle || '',
      messageText: langData.messageText || '',
      valuesTitle: langData.valuesTitle || '',
      values: langData.values || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Vision Stratégique',
        ar: 'تعديل صفحة الرؤية الاستراتيجية',
        en: 'Edit Strategic Vision Page'
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
      'visionCard': {
        fr: 'Carte Vision',
        ar: 'بطاقة الرؤية',
        en: 'Vision Card'
      },
      'visionTitle': {
        fr: 'Titre Vision *',
        ar: 'عنوان الرؤية *',
        en: 'Vision Title *'
      },
      'visionText': {
        fr: 'Texte Vision *',
        ar: 'نص الرؤية *',
        en: 'Vision Text *'
      },
      'messageCard': {
        fr: 'Carte Message',
        ar: 'بطاقة الرسالة',
        en: 'Message Card'
      },
      'messageTitle': {
        fr: 'Titre Message *',
        ar: 'عنوان الرسالة *',
        en: 'Message Title *'
      },
      'messageText': {
        fr: 'Texte Message *',
        ar: 'نص الرسالة *',
        en: 'Message Text *'
      },
      'valuesSection': {
        fr: 'Section Valeurs',
        ar: 'قسم القيم',
        en: 'Values Section'
      },
      'valuesTitle': {
        fr: 'Titre Section Valeurs *',
        ar: 'عنوان قسم القيم *',
        en: 'Values Section Title *'
      },
      'values': {
        fr: 'Valeurs',
        ar: 'القيم',
        en: 'Values'
      },
      'icon': {
        fr: 'Icône (Emoji) *',
        ar: 'أيقونة (رموز تعبيرية) *',
        en: 'Icon (Emoji) *'
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
      'addValue': {
        fr: 'Ajouter une valeur',
        ar: 'إضافة قيمة',
        en: 'Add Value'
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



