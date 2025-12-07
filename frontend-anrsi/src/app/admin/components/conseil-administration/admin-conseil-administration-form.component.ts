import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface BoardMember {
  name: string;
  position: string;
}

interface ConseilAdministrationLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  boardMembers: BoardMember[];
  updateDate: string;
}

interface ConseilAdministrationContent {
  translations: {
    fr: ConseilAdministrationLanguageContent;
    ar: ConseilAdministrationLanguageContent;
    en: ConseilAdministrationLanguageContent;
  };
}

@Component({
  selector: 'app-admin-conseil-administration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-conseil-administration-form.component.html',
  styleUrls: ['./admin-conseil-administration-form.component.scss']
})
export class AdminConseilAdministrationFormComponent implements OnInit {
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
      introText: ['', Validators.required],
      boardMembers: this.fb.array([]),
      updateDate: ['', Validators.required]
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
      this.cdr.markForCheck();
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    const group = this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
    if (!group) {
      console.error(`Form group for language ${this.activeLanguage} not found`);
      return this.form.get('translations.fr') as FormGroup;
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

  // Board Members FormArray methods
  get boardMembers(): FormArray {
    return this.getActiveLanguageFormGroup().get('boardMembers') as FormArray;
  }

  addBoardMember(member?: BoardMember, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const members = langGroup.get('boardMembers') as FormArray;
    const group = this.fb.group({
      name: [member?.name || '', Validators.required],
      position: [member?.position || '', Validators.required]
    });
    members.push(group);
  }

  removeBoardMember(index: number): void {
    this.boardMembers.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('conseil-administration').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        
        // First, try to get from page.translations (new system)
        if (page.translations && Object.keys(page.translations).length > 0) {
          try {
            const content: ConseilAdministrationContent = {
              translations: {
                fr: this.getEmptyLanguageContent(),
                ar: this.getEmptyLanguageContent(),
                en: this.getEmptyLanguageContent()
              }
            };
            
            // Track which languages have data
            const hasData: { [key: string]: boolean } = {
              fr: false,
              ar: false,
              en: false
            };
            
            // Extract content from each translation
            ['fr', 'ar', 'en'].forEach(lang => {
              const translation = page.translations?.[lang];
              if (translation && translation.content) {
                try {
                  const parsedContent = JSON.parse(translation.content);
                  // Check if the parsed content has actual data
                  if (parsedContent.heroTitle || 
                      (parsedContent.boardMembers && parsedContent.boardMembers.length > 0)) {
                    content.translations[lang as 'fr' | 'ar' | 'en'] = parsedContent;
                    hasData[lang] = true;
                  }
                } catch (e) {
                  console.error(`Error parsing ${lang} translation content:`, e);
                }
              }
            });
            
            this.populateForm(content);
            
            // Only load defaults for languages that don't have data
            if (!hasData['ar']) {
              this.loadDefaultArabicData();
            }
            if (!hasData['en']) {
              this.loadDefaultEnglishData();
            }
          } catch (e) {
            console.error('Error processing translations:', e);
            // Fall through to page.content check
          }
        }
        
        // Fallback: Try to get from page.content (old system or backup)
        // Only process if we didn't already process translations above
        if (page.content && (!page.translations || Object.keys(page.translations).length === 0)) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: ConseilAdministrationContent = parsedContent;
              
              // Track which languages have data
              const hasData: { [key: string]: boolean } = {
                fr: false,
                ar: false,
                en: false
              };
              
              ['fr', 'ar', 'en'].forEach(lang => {
                const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
                if (langContent && 
                    (langContent.heroTitle || 
                     (langContent.boardMembers && langContent.boardMembers.length > 0))) {
                  hasData[lang] = true;
                }
              });
              
              this.populateForm(content);
              
              // Only load defaults for languages that don't have data
              if (!hasData['ar']) {
                this.loadDefaultArabicData();
              }
              if (!hasData['en']) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: ConseilAdministrationLanguageContent = parsedContent;
              const content: ConseilAdministrationContent = {
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
        this.cdr.markForCheck();
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

  private getEmptyLanguageContent(): ConseilAdministrationLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      sectionTitle: '',
      introText: '',
      boardMembers: [],
      updateDate: ''
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Conseil d\'Administration',
      heroSubtitle: 'Composition du Conseil d\'Administration de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Membres du Conseil d\'Administration',
      introText: 'Le Conseil d\'Administration de l\'ANRSI est composé de représentants de différentes institutions et secteurs, assurant une gouvernance équilibrée et représentative.',
      updateDate: '11 Novembre 2021'
    });

    // Clear existing array for French
    const frMembers = frGroup.get('boardMembers') as FormArray;
    while (frMembers.length) frMembers.removeAt(0);

    // Add default board members for French
    this.addBoardMember({ name: 'Mohamed Sidiya Khabaz', position: 'Président du CA' }, 'fr');
    this.addBoardMember({ name: 'AHMED SALEM OULD MOHAMED VADEL', position: 'Représentant de la Présidence de la République' }, 'fr');
    this.addBoardMember({ name: 'HOUDA BABAH', position: 'Représentante du Premier Ministère' }, 'fr');
    this.addBoardMember({ name: 'SAAD BOUH OULD SIDATY', position: 'Représentant du Ministère des Finances' }, 'fr');
    this.addBoardMember({ name: 'Mohamed Yahya Dah', position: 'Représentant du Ministère de l\'Enseignement Supérieur, de la Recherche Scientifique et de l\'Innovation' }, 'fr');
    this.addBoardMember({ name: 'WAGUE OUSMANE', position: 'Enseignant-chercheur' }, 'fr');
    this.addBoardMember({ name: 'SALEM MOHAMED EL MOCTAR ABEIDNA', position: 'Enseignant-chercheur' }, 'fr');
    this.addBoardMember({ name: 'HANCHI MOHAMED SALEH', position: 'Représentant de l\'Union Nationale du Patronat Mauritanien' }, 'fr');
    this.addBoardMember({ name: 'MOHAMED EL MOCTAR YAHYA MOHAMEDINE', position: 'Représentant de l\'Union Nationale du Patronat Mauritanien' }, 'fr');
    this.addBoardMember({ name: 'WANE ABDOUL AZIZ', position: 'Représentant de la Chambre de Commerce, d\'Industrie et d\'Agriculture de Mauritanie' }, 'fr');
    this.addBoardMember({ name: 'AHMEDOU HAOUBA', position: 'Enseignant-chercheur' }, 'fr');
    this.addBoardMember({ name: 'Mohamedou Mbaba', position: 'Représentant du Ministère des Affaires Economiques et de la Promotion des secteurs Productifs' }, 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    
    // Check if Arabic data already exists
    if (arGroup.get('heroTitle')?.value && (arGroup.get('boardMembers') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arGroup.patchValue({
      heroTitle: 'مجلس الإدارة',
      heroSubtitle: 'تشكيل مجلس إدارة الوكالة الوطنية للبحث العلمي والابتكار',
      sectionTitle: 'أعضاء مجلس الإدارة',
      introText: 'يتكون مجلس إدارة الوكالة الوطنية للبحث العلمي والابتكار من ممثلين عن مؤسسات وقطاعات مختلفة، لضمان حوكمة متوازنة وتمثيلية.',
      updateDate: '11 نوفمبر 2021'
    });

    // Clear existing array for Arabic
    const arMembers = arGroup.get('boardMembers') as FormArray;
    while (arMembers.length) arMembers.removeAt(0);

    // Add default board members for Arabic
    this.addBoardMember({ name: 'محمد سيديا خباز', position: 'رئيس مجلس الإدارة' }, 'ar');
    this.addBoardMember({ name: 'أحمد سالم ولد محمد فادل', position: 'ممثل رئاسة الجمهورية' }, 'ar');
    this.addBoardMember({ name: 'هدى باباه', position: 'ممثلة رئاسة الوزراء' }, 'ar');
    this.addBoardMember({ name: 'سعد بوه ولد صيداتي', position: 'ممثل وزارة المالية' }, 'ar');
    this.addBoardMember({ name: 'محمد يحيى داه', position: 'ممثل وزارة التعليم العالي والبحث العلمي والابتكار' }, 'ar');
    this.addBoardMember({ name: 'واج أوسمان', position: 'أستاذ باحث' }, 'ar');
    this.addBoardMember({ name: 'سالم محمد المختار أبيضنا', position: 'أستاذ باحث' }, 'ar');
    this.addBoardMember({ name: 'هانشي محمد صالح', position: 'ممثل الاتحاد الوطني لأصحاب العمل الموريتانيين' }, 'ar');
    this.addBoardMember({ name: 'محمد المختار يحيى محمدين', position: 'ممثل الاتحاد الوطني لأصحاب العمل الموريتانيين' }, 'ar');
    this.addBoardMember({ name: 'وان عبد العزيز', position: 'ممثل غرفة التجارة والصناعة والزراعة في موريتانيا' }, 'ar');
    this.addBoardMember({ name: 'أحمدو حوبا', position: 'أستاذ باحث' }, 'ar');
    this.addBoardMember({ name: 'محمدو مبابا', position: 'ممثل وزارة الشؤون الاقتصادية وتشجيع القطاعات الإنتاجية' }, 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    
    // Check if English data already exists
    if (enGroup.get('heroTitle')?.value && (enGroup.get('boardMembers') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enGroup.patchValue({
      heroTitle: 'Board of Directors',
      heroSubtitle: 'Composition of the Board of Directors of the National Agency for Scientific Research and Innovation',
      sectionTitle: 'Board Members',
      introText: 'The Board of Directors of ANRSI is composed of representatives from various institutions and sectors, ensuring balanced and representative governance.',
      updateDate: '11 November 2021'
    });

    // Clear existing array for English
    const enMembers = enGroup.get('boardMembers') as FormArray;
    while (enMembers.length) enMembers.removeAt(0);

    // Add default board members for English
    this.addBoardMember({ name: 'Mohamed Sidiya Khabaz', position: 'Chairman of the Board' }, 'en');
    this.addBoardMember({ name: 'AHMED SALEM OULD MOHAMED VADEL', position: 'Representative of the Presidency of the Republic' }, 'en');
    this.addBoardMember({ name: 'HOUDA BABAH', position: 'Representative of the Prime Minister\'s Office' }, 'en');
    this.addBoardMember({ name: 'SAAD BOUH OULD SIDATY', position: 'Representative of the Ministry of Finance' }, 'en');
    this.addBoardMember({ name: 'Mohamed Yahya Dah', position: 'Representative of the Ministry of Higher Education, Scientific Research and Innovation' }, 'en');
    this.addBoardMember({ name: 'WAGUE OUSMANE', position: 'Teacher-Researcher' }, 'en');
    this.addBoardMember({ name: 'SALEM MOHAMED EL MOCTAR ABEIDNA', position: 'Teacher-Researcher' }, 'en');
    this.addBoardMember({ name: 'HANCHI MOHAMED SALEH', position: 'Representative of the National Union of Mauritanian Employers' }, 'en');
    this.addBoardMember({ name: 'MOHAMED EL MOCTAR YAHYA MOHAMEDINE', position: 'Representative of the National Union of Mauritanian Employers' }, 'en');
    this.addBoardMember({ name: 'WANE ABDOUL AZIZ', position: 'Representative of the Chamber of Commerce, Industry and Agriculture of Mauritania' }, 'en');
    this.addBoardMember({ name: 'AHMEDOU HAOUBA', position: 'Teacher-Researcher' }, 'en');
    this.addBoardMember({ name: 'Mohamedou Mbaba', position: 'Representative of the Ministry of Economic Affairs and Promotion of Productive Sectors' }, 'en');
  }

  populateForm(content: ConseilAdministrationContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          sectionTitle: langContent.sectionTitle || '',
          introText: langContent.introText || '',
          updateDate: langContent.updateDate || ''
        });

        // Clear existing array
        const members = langGroup.get('boardMembers') as FormArray;
        while (members.length) members.removeAt(0);

        // Populate array with validation
        if (langContent.boardMembers && Array.isArray(langContent.boardMembers)) {
          langContent.boardMembers.forEach(member => {
            if (member && member.name) {
              this.addBoardMember(member, lang);
            }
          });
        }
      }
    });
    
    // Trigger change detection after populating
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    // Use getRawValue() to ensure FormArrays are properly captured
    const translationsData: any = {};
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      const langValue = langGroup.getRawValue();
      translationsData[lang] = langValue;
    });
    
    // Build content with translations
    const content: ConseilAdministrationContent = {
      translations: {
        fr: this.buildLanguageContent(translationsData.fr),
        ar: this.buildLanguageContent(translationsData.ar),
        en: this.buildLanguageContent(translationsData.en)
      }
    };

    // Build translations for the new structure
    const translations: { [key: string]: any } = {};
    
    (['fr', 'ar', 'en'] as const).forEach(lang => {
      const langContent = content.translations[lang];
      if (langContent) {
        const langContentJson = JSON.stringify(langContent);
        translations[lang] = {
          title: langContent.heroTitle || 'Conseil d\'Administration',
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
        slug: 'conseil-administration',
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

  private buildLanguageContent(langData: any): ConseilAdministrationLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      sectionTitle: langData.sectionTitle || '',
      introText: langData.introText || '',
      boardMembers: langData.boardMembers || [],
      updateDate: langData.updateDate || ''
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Conseil d\'Administration',
        ar: 'تعديل صفحة مجلس الإدارة',
        en: 'Edit Board of Directors Page'
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
      'introText': {
        fr: 'Texte d\'introduction *',
        ar: 'نص المقدمة *',
        en: 'Intro Text *'
      },
      'updateDate': {
        fr: 'Date de mise à jour *',
        ar: 'تاريخ التحديث *',
        en: 'Update Date *'
      },
      'boardMembers': {
        fr: 'Membres du Conseil',
        ar: 'أعضاء المجلس',
        en: 'Board Members'
      },
      'name': {
        fr: 'Nom *',
        ar: 'الاسم *',
        en: 'Name *'
      },
      'position': {
        fr: 'Poste *',
        ar: 'المنصب *',
        en: 'Position *'
      },
      'addBoardMember': {
        fr: 'Ajouter un membre du conseil',
        ar: 'إضافة عضو مجلس',
        en: 'Add Board Member'
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



