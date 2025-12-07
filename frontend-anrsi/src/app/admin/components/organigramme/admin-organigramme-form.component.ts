import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface Position {
  icon: string;
  title: string;
  description: string;
  isDirector?: boolean;
}

interface Level {
  levelNumber: number;
  positions: Position[];
}

interface Responsibility {
  icon: string;
  title: string;
  description: string;
}

interface OrganigrammeLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  levels: Level[];
  responsibilitiesTitle: string;
  responsibilities: Responsibility[];
}

interface OrganigrammeContent {
  translations?: {
    fr: OrganigrammeLanguageContent;
    ar: OrganigrammeLanguageContent;
    en: OrganigrammeLanguageContent;
  };
  // Support old format for backward compatibility
  heroTitle?: string;
  heroSubtitle?: string;
  sectionTitle?: string;
  introText?: string;
  levels?: Level[];
  responsibilitiesTitle?: string;
  responsibilities?: Responsibility[];
}

@Component({
  selector: 'app-admin-organigramme-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-organigramme-form.component.html',
  styleUrls: ['./admin-organigramme-form.component.scss']
})
export class AdminOrganigrammeFormComponent implements OnInit {
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

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
      this.cdr.markForCheck();
    }
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
      levels: this.fb.array([]),
      responsibilitiesTitle: ['', Validators.required],
      responsibilities: this.fb.array([])
    });
  }

  getActiveLanguageFormGroup(): FormGroup {
    const group = this.getLanguageFormGroup(this.activeLanguage);
    if (!group) {
      console.error(`Form group for language ${this.activeLanguage} not found`);
      return this.getLanguageFormGroup('fr');
    }
    return group;
  }

  getLanguageFormGroup(lang: string): FormGroup {
    if (!this.form) {
      throw new Error('Form not initialized');
    }
    const translationsGroup = this.form.get('translations') as FormGroup;
    if (!translationsGroup) {
      throw new Error('Translations form group not found');
    }
    const langGroup = translationsGroup.get(lang) as FormGroup;
    if (!langGroup) {
      throw new Error(`Language form group '${lang}' not found`);
    }
    // Verify the form group has the expected structure
    if (!langGroup.get('heroTitle')) {
      console.error(`Form group '${lang}' is missing 'heroTitle' control. Form structure:`, langGroup);
      throw new Error(`Language form group '${lang}' is missing required controls`);
    }
    return langGroup;
  }

  // Levels FormArray methods
  get levels(): FormArray {
    return this.getActiveLanguageFormGroup().get('levels') as FormArray;
  }

  addLevel(level?: Level, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const levels = langGroup.get('levels') as FormArray;
    const levelGroup = this.fb.group({
      levelNumber: [level?.levelNumber || levels.length + 1, Validators.required],
      positions: this.fb.array([])
    });
    
    if (level?.positions) {
      level.positions.forEach(position => {
        this.addPositionToLevel(levelGroup, position);
      });
    }
    
    levels.push(levelGroup);
  }

  getLevelPositions(levelIndex: number): FormArray {
    return this.levels.at(levelIndex).get('positions') as FormArray;
  }

  addPositionToLevel(levelGroup: FormGroup, position?: Position): void {
    const positions = levelGroup.get('positions') as FormArray;
    const positionGroup = this.fb.group({
      icon: [position?.icon || '', Validators.required],
      title: [position?.title || '', Validators.required],
      description: [position?.description || '', Validators.required],
      isDirector: [position?.isDirector || false]
    });
    positions.push(positionGroup);
  }

  removePositionFromLevel(levelIndex: number, positionIndex: number): void {
    const positions = this.getLevelPositions(levelIndex);
    positions.removeAt(positionIndex);
  }

  removeLevel(index: number): void {
    this.levels.removeAt(index);
    // Update level numbers
    this.updateLevelNumbers();
  }

  updateLevelNumbers(): void {
    this.levels.controls.forEach((control, index) => {
      control.patchValue({ levelNumber: index + 1 }, { emitEvent: false });
    });
  }

  // Responsibilities FormArray methods
  get responsibilities(): FormArray {
    return this.getActiveLanguageFormGroup().get('responsibilities') as FormArray;
  }

  addResponsibility(item?: Responsibility, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const responsibilities = langGroup.get('responsibilities') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    responsibilities.push(group);
  }

  removeResponsibility(index: number): void {
    this.responsibilities.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('organigramme').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        
        // First, try to get from page.translations (new system)
        if (page.translations && Object.keys(page.translations).length > 0) {
          try {
            const content: OrganigrammeContent = {
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
                      (parsedContent.levels && parsedContent.levels.length > 0)) {
                    content.translations![lang as 'fr' | 'ar' | 'en'] = parsedContent;
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
              const content: OrganigrammeContent = parsedContent;
              
              // Track which languages have data
              const hasData: { [key: string]: boolean } = {
                fr: false,
                ar: false,
                en: false
              };
              
              ['fr', 'ar', 'en'].forEach(lang => {
                const langContent = content.translations?.[lang as 'fr' | 'ar' | 'en'];
                if (langContent && 
                    (langContent.heroTitle || 
                     (langContent.levels && langContent.levels.length > 0))) {
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
              const oldContent: OrganigrammeLanguageContent = parsedContent as any;
              const content: OrganigrammeContent = {
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
        
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        if (error.status === 404) {
          this.loadDefaultData();
        } else {
          this.errorMessage = 'Error loading page';
        }
        this.isLoading = false;
      }
    });
  }

  private getEmptyLanguageContent(): OrganigrammeLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      sectionTitle: '',
      introText: '',
      levels: [],
      responsibilitiesTitle: '',
      responsibilities: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Organigramme',
      heroSubtitle: 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Structure Organisationnelle',
      introText: 'L\'ANRSI est structurée de manière hiérarchique pour assurer une gestion efficace de la recherche scientifique et de l\'innovation en Mauritanie.',
      responsibilitiesTitle: 'Responsabilités Clés'
    });

    // Clear existing arrays for French
    const frLevels = frGroup.get('levels') as FormArray;
    const frResponsibilities = frGroup.get('responsibilities') as FormArray;
    while (frLevels.length) frLevels.removeAt(0);
    while (frResponsibilities.length) frResponsibilities.removeAt(0);

    // Add default levels for French
    this.addLevel({
      levelNumber: 1,
      positions: [{
        icon: '👑',
        title: 'Haut Conseil de la Recherche Scientifique et de l\'Innovation',
        description: 'Présidé par Son Excellence le Premier Ministre',
        isDirector: true
      }]
    }, 'fr');

    this.addLevel({
      levelNumber: 2,
      positions: [{
        icon: '👔',
        title: 'Direction Générale',
        description: 'Directeur Général de l\'ANRSI',
        isDirector: true
      }]
    }, 'fr');

    this.addLevel({
      levelNumber: 3,
      positions: [
        {
          icon: '🔬',
          title: 'Direction de la Recherche',
          description: 'Gestion des programmes de recherche',
          isDirector: false
        },
        {
          icon: '💡',
          title: 'Direction de l\'Innovation',
          description: 'Promotion de l\'innovation technologique',
          isDirector: false
        },
        {
          icon: '💰',
          title: 'Direction Financière',
          description: 'Gestion des fonds et budgets',
          isDirector: false
        }
      ]
    }, 'fr');

    this.addLevel({
      levelNumber: 4,
      positions: [
        {
          icon: '📊',
          title: 'Service d\'Évaluation',
          description: 'Suivi et évaluation des projets',
          isDirector: false
        },
        {
          icon: '🤝',
          title: 'Service de Coopération',
          description: 'Partenariats internationaux',
          isDirector: false
        },
        {
          icon: '📋',
          title: 'Service Administratif',
          description: 'Gestion administrative',
          isDirector: false
        },
        {
          icon: '💻',
          title: 'Service Informatique',
          description: 'Support technique et numérique',
          isDirector: false
        }
      ]
    }, 'fr');

    // Add default responsibilities for French
    this.addResponsibility({
      icon: '🎯',
      title: 'Définition des Priorités',
      description: 'Le Haut Conseil définit les priorités nationales de recherche et d\'innovation'
    }, 'fr');
    this.addResponsibility({
      icon: '📝',
      title: 'Appels à Projets',
      description: 'L\'ANRSI lance des appels à projets selon les priorités définies'
    }, 'fr');
    this.addResponsibility({
      icon: '💼',
      title: 'Gestion des Fonds',
      description: 'Allocation transparente et efficace des fonds de recherche'
    }, 'fr');
    this.addResponsibility({
      icon: '📈',
      title: 'Suivi et Évaluation',
      description: 'Monitoring continu des projets financés et évaluation de leur impact'
    }, 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    
    // Check if Arabic data already exists
    if (arGroup.get('heroTitle')?.value && (arGroup.get('levels') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arGroup.patchValue({
      heroTitle: 'الهيكل التنظيمي',
      heroSubtitle: 'الهيكل التنظيمي للوكالة الوطنية للبحث العلمي والابتكار',
      sectionTitle: 'الهيكل التنظيمي',
      introText: 'تتبع الوكالة الوطنية للبحث العلمي والابتكار هيكلًا هرميًا لضمان إدارة فعالة للبحث العلمي والابتكار في موريتانيا.',
      responsibilitiesTitle: 'المسؤوليات الرئيسية'
    });

    // Clear existing arrays for Arabic
    const arLevels = arGroup.get('levels') as FormArray;
    const arResponsibilities = arGroup.get('responsibilities') as FormArray;
    while (arLevels.length) arLevels.removeAt(0);
    while (arResponsibilities.length) arResponsibilities.removeAt(0);

    // Add default levels for Arabic
    this.addLevel({
      levelNumber: 1,
      positions: [{
        icon: '👑',
        title: 'المجلس الأعلى للبحث العلمي والابتكار',
        description: 'برئاسة معالي رئيس الوزراء',
        isDirector: true
      }]
    }, 'ar');

    this.addLevel({
      levelNumber: 2,
      positions: [{
        icon: '👔',
        title: 'الإدارة العامة',
        description: 'المدير العام للوكالة الوطنية للبحث العلمي والابتكار',
        isDirector: true
      }]
    }, 'ar');

    this.addLevel({
      levelNumber: 3,
      positions: [
        {
          icon: '🔬',
          title: 'إدارة البحث العلمي',
          description: 'إدارة برامج البحث العلمي',
          isDirector: false
        },
        {
          icon: '💡',
          title: 'إدارة الابتكار',
          description: 'تعزيز الابتكار التكنولوجي',
          isDirector: false
        },
        {
          icon: '💰',
          title: 'الإدارة المالية',
          description: 'إدارة الأموال والميزانيات',
          isDirector: false
        }
      ]
    }, 'ar');

    this.addLevel({
      levelNumber: 4,
      positions: [
        {
          icon: '📊',
          title: 'قسم التقييم',
          description: 'متابعة وتقييم المشاريع',
          isDirector: false
        },
        {
          icon: '🤝',
          title: 'قسم التعاون',
          description: 'الشراكات الدولية',
          isDirector: false
        },
        {
          icon: '📋',
          title: 'القسم الإداري',
          description: 'الإدارة الإدارية',
          isDirector: false
        },
        {
          icon: '💻',
          title: 'قسم تكنولوجيا المعلومات',
          description: 'الدعم الفني والرقمي',
          isDirector: false
        }
      ]
    }, 'ar');

    // Add default responsibilities for Arabic
    this.addResponsibility({
      icon: '🎯',
      title: 'تحديد الأولويات',
      description: 'يحدد المجلس الأعلى أولويات البحث والابتكار الوطنية'
    }, 'ar');
    this.addResponsibility({
      icon: '📝',
      title: 'دعوات للمشاريع',
      description: 'تطلق الوكالة دعوات للمشاريع وفق الأولويات المحددة'
    }, 'ar');
    this.addResponsibility({
      icon: '💼',
      title: 'إدارة الأموال',
      description: 'تخصيص شفاف وفعال لأموال البحث العلمي'
    }, 'ar');
    this.addResponsibility({
      icon: '📈',
      title: 'المتابعة والتقييم',
      description: 'المتابعة المستمرة للمشاريع الممولة وتقييم أثرها'
    }, 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    
    // Check if English data already exists
    if (enGroup.get('heroTitle')?.value && (enGroup.get('levels') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enGroup.patchValue({
      heroTitle: 'Organizational Chart',
      heroSubtitle: 'Organizational structure of the National Agency for Scientific Research and Innovation',
      sectionTitle: 'Organizational Structure',
      introText: 'ANRSI is structured hierarchically to ensure effective management of scientific research and innovation in Mauritania.',
      responsibilitiesTitle: 'Key Responsibilities'
    });

    // Clear existing arrays for English
    const enLevels = enGroup.get('levels') as FormArray;
    const enResponsibilities = enGroup.get('responsibilities') as FormArray;
    while (enLevels.length) enLevels.removeAt(0);
    while (enResponsibilities.length) enResponsibilities.removeAt(0);

    // Add default levels for English
    this.addLevel({
      levelNumber: 1,
      positions: [{
        icon: '👑',
        title: 'High Council for Scientific Research and Innovation',
        description: 'Chaired by His Excellency the Prime Minister',
        isDirector: true
      }]
    }, 'en');

    this.addLevel({
      levelNumber: 2,
      positions: [{
        icon: '👔',
        title: 'General Directorate',
        description: 'Director General of ANRSI',
        isDirector: true
      }]
    }, 'en');

    this.addLevel({
      levelNumber: 3,
      positions: [
        {
          icon: '🔬',
          title: 'Research Directorate',
          description: 'Management of research programs',
          isDirector: false
        },
        {
          icon: '💡',
          title: 'Innovation Directorate',
          description: 'Promotion of technological innovation',
          isDirector: false
        },
        {
          icon: '💰',
          title: 'Financial Directorate',
          description: 'Management of funds and budgets',
          isDirector: false
        }
      ]
    }, 'en');

    this.addLevel({
      levelNumber: 4,
      positions: [
        {
          icon: '📊',
          title: 'Evaluation Department',
          description: 'Monitoring and evaluation of projects',
          isDirector: false
        },
        {
          icon: '🤝',
          title: 'Cooperation Department',
          description: 'International partnerships',
          isDirector: false
        },
        {
          icon: '📋',
          title: 'Administrative Department',
          description: 'Administrative management',
          isDirector: false
        },
        {
          icon: '💻',
          title: 'IT Department',
          description: 'Technical and digital support',
          isDirector: false
        }
      ]
    }, 'en');

    // Add default responsibilities for English
    this.addResponsibility({
      icon: '🎯',
      title: 'Setting Priorities',
      description: 'The High Council defines national research and innovation priorities'
    }, 'en');
    this.addResponsibility({
      icon: '📝',
      title: 'Calls for Projects',
      description: 'ANRSI launches project calls according to defined priorities'
    }, 'en');
    this.addResponsibility({
      icon: '💼',
      title: 'Fund Management',
      description: 'Transparent and efficient allocation of research funds'
    }, 'en');
    this.addResponsibility({
      icon: '📈',
      title: 'Monitoring and Evaluation',
      description: 'Continuous monitoring of funded projects and evaluation of their impact'
    }, 'en');
  }

  populateForm(content: OrganigrammeContent): void {
    if (content.translations) {
      // New format with translations
      ['fr', 'ar', 'en'].forEach(lang => {
        const langContent = content.translations![lang as 'fr' | 'ar' | 'en'];
        const langGroup = this.getLanguageFormGroup(lang);
        
        if (langContent) {
          langGroup.patchValue({
            heroTitle: langContent.heroTitle || '',
            heroSubtitle: langContent.heroSubtitle || '',
            sectionTitle: langContent.sectionTitle || '',
            introText: langContent.introText || '',
            responsibilitiesTitle: langContent.responsibilitiesTitle || ''
          });

          // Clear existing arrays
          const levels = langGroup.get('levels') as FormArray;
          const responsibilities = langGroup.get('responsibilities') as FormArray;
          while (levels.length) levels.removeAt(0);
          while (responsibilities.length) responsibilities.removeAt(0);

          // Populate levels with validation
          if (langContent.levels && Array.isArray(langContent.levels)) {
            langContent.levels.forEach(level => {
              if (level && level.positions && Array.isArray(level.positions)) {
                this.addLevel(level, lang);
              }
            });
          }

          // Populate responsibilities with validation
          if (langContent.responsibilities && Array.isArray(langContent.responsibilities)) {
            langContent.responsibilities.forEach(responsibility => {
              if (responsibility && responsibility.title) {
                this.addResponsibility(responsibility, lang);
              }
            });
          }
        } else {
          // If translation doesn't exist, ensure form group is initialized with empty values
          langGroup.patchValue({
            heroTitle: '',
            heroSubtitle: '',
            sectionTitle: '',
            introText: '',
            responsibilitiesTitle: ''
          });
          // Clear arrays
          const levels = langGroup.get('levels') as FormArray;
          const responsibilities = langGroup.get('responsibilities') as FormArray;
          while (levels.length) levels.removeAt(0);
          while (responsibilities.length) responsibilities.removeAt(0);
        }
      });
    } else {
      // Old format - populate French only
      const frGroup = this.getLanguageFormGroup('fr');
      frGroup.patchValue({
        heroTitle: content.heroTitle || 'Organigramme',
        heroSubtitle: content.heroSubtitle || 'Structure organisationnelle de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
        sectionTitle: content.sectionTitle || 'Structure Organisationnelle',
        introText: content.introText || '',
        responsibilitiesTitle: content.responsibilitiesTitle || 'Responsabilités Clés'
      });

      // Clear existing arrays
      const levels = frGroup.get('levels') as FormArray;
      const responsibilities = frGroup.get('responsibilities') as FormArray;
      while (levels.length) levels.removeAt(0);
      while (responsibilities.length) responsibilities.removeAt(0);

      // Populate levels with validation
      if (content.levels && Array.isArray(content.levels)) {
        content.levels.forEach(level => {
          if (level && level.positions && Array.isArray(level.positions)) {
            this.addLevel(level, 'fr');
          }
        });
      }

      // Populate responsibilities with validation
      if (content.responsibilities && Array.isArray(content.responsibilities)) {
        content.responsibilities.forEach(responsibility => {
          if (responsibility && responsibility.title) {
            this.addResponsibility(responsibility, 'fr');
          }
        });
      }
    }
    
    // Trigger change detection after populating
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.form.valid) {
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
      const content: OrganigrammeContent = {
        translations: {
          fr: this.buildLanguageContent(translationsData.fr),
          ar: this.buildLanguageContent(translationsData.ar),
          en: this.buildLanguageContent(translationsData.en)
        }
      };

      // Build translations for the new structure
      const translations: { [key: string]: any } = {};
      
      if (content.translations) {
        (['fr', 'ar', 'en'] as const).forEach(lang => {
          const langContent = content.translations![lang];
          if (langContent) {
            const langContentJson = JSON.stringify(langContent);
            translations[lang] = {
              title: langContent.heroTitle || 'Organigramme',
              heroTitle: langContent.heroTitle || '',
              heroSubtitle: langContent.heroSubtitle || '',
              content: langContentJson, // Store the language-specific content in content field
              extra: langContentJson // Also store in extra for backward compatibility
            };
          }
        });
      }

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
            this.errorMessage = 'Error saving page';
            console.error('Error saving page:', error);
          }
        });
      } else {
        this.pageService.createPage({
          slug: 'organigramme',
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
            this.errorMessage = 'Error creating page';
            console.error('Error creating page:', error);
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  private buildLanguageContent(langData: any): OrganigrammeLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      sectionTitle: langData.sectionTitle || '',
      introText: langData.introText || '',
      levels: langData.levels || [],
      responsibilitiesTitle: langData.responsibilitiesTitle || '',
      responsibilities: langData.responsibilities || []
    };
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}



