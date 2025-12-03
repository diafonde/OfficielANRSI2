import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface Programme {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  icon: string;
  color: string;
  details?: string;
}

interface ProgrammesLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  programmes: Programme[];
  ctaTitle?: string;
  ctaDescription?: string;
}

interface ProgrammesContent {
  translations: {
    fr: ProgrammesLanguageContent;
    ar: ProgrammesLanguageContent;
    en: ProgrammesLanguageContent;
  };
}

@Component({
  selector: 'app-admin-programmes-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-programmes-form.component.html',
  styleUrls: ['./admin-programmes-form.component.scss']
})
export class AdminProgrammesFormComponent implements OnInit {
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
      programmes: this.fb.array([]),
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

  // Programmes FormArray methods
  get programmes(): FormArray {
    return this.getActiveLanguageFormGroup().get('programmes') as FormArray;
  }

  addProgramme(item?: Programme, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const programmes = langGroup.get('programmes') as FormArray;
    const group = this.fb.group({
      id: [item?.id || '', Validators.required],
      name: [item?.name || '', Validators.required],
      description: [item?.description || '', Validators.required],
      objectives: this.fb.array(item?.objectives?.map(o => this.fb.control(o)) || []),
      icon: [item?.icon || 'fas fa-university', Validators.required],
      color: [item?.color || '#0a3d62', Validators.required],
      details: [item?.details || '']
    });
    programmes.push(group);
  }

  removeProgramme(index: number): void {
    this.programmes.removeAt(index);
  }

  getProgrammeObjectives(index: number): FormArray {
    return this.programmes.at(index).get('objectives') as FormArray;
  }

  addProgrammeObjective(programmeIndex: number, value = ''): void {
    this.getProgrammeObjectives(programmeIndex).push(this.fb.control(value, Validators.required));
  }

  removeProgrammeObjective(programmeIndex: number, objectiveIndex: number): void {
    this.getProgrammeObjectives(programmeIndex).removeAt(objectiveIndex);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('programmes').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: ProgrammesContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              if (!arGroup.get('heroTitle')?.value || (arGroup.get('programmes') as FormArray).length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              if (!enGroup.get('heroTitle')?.value || (enGroup.get('programmes') as FormArray).length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: ProgrammesLanguageContent = parsedContent;
              const content: ProgrammesContent = {
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

  private getEmptyLanguageContent(): ProgrammesLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      programmes: [],
      ctaTitle: '',
      ctaDescription: ''
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Programmes',
      heroSubtitle: 'Programmes de l\'Agence',
      ctaTitle: 'Intéressé par nos programmes ?',
      ctaDescription: 'Découvrez comment participer à nos programmes de recherche et d\'innovation'
    });

    // Clear existing array for French
    const frProgrammes = frGroup.get('programmes') as FormArray;
    while (frProgrammes.length) frProgrammes.removeAt(0);

    // Add default programmes for French
    this.addProgramme({
      id: 'temkin',
      name: 'Programme Temkin (Autonomisation)',
      description: 'Programme d\'autonomisation des structures de recherche',
      objectives: [
        'Garantir le fonctionnement des structures de recherche (SR) reconnues',
        'Encourager la culture de mutualisation des moyens',
        'Briser l\'isolement des chercheurs',
        'Renforcer les capacités des Etablissements d\'Enseignement Supérieur et de Recherche et des chercheurs en matière de pilotage et de gouvernance de la recherche'
      ],
      icon: 'fas fa-university',
      color: '#0a3d62'
    }, 'fr');
    this.addProgramme({
      id: 'temeyouz',
      name: 'Programme Temeyouz (Excellence)',
      description: 'Programme d\'excellence scientifique pour les jeunes chercheurs',
      objectives: [
        'Soutenir l\'excellence scientifique chez les jeunes chercheurs',
        'Encourager les doctorants à consacrer leur plein temps à leurs thèses',
        'Accroitre la production scientifique nationale et améliorer sa visibilité',
        'Inciter et motiver l\'encadrement et la production scientifique',
        'Développer la créativité et l\'esprit d\'entreprise chez les jeunes chercheurs'
      ],
      icon: 'fas fa-graduation-cap',
      color: '#20a39e'
    }, 'fr');
    this.addProgramme({
      id: 'tethmin',
      name: 'Programme Tethmin (Valorisation)',
      description: 'Programme de valorisation de la recherche scientifique',
      objectives: [
        'Assurer la diffusion et le partage du savoir',
        'Faire connaitre les thématiques de recherche des Structures de Recherche',
        'Consolider le réseautage des chercheurs autour des thématiques prioritaires',
        'Promouvoir la visibilité de la production scientifique nationale',
        'Appuyer la mise en place des structures de valorisation de la recherche (incubateurs)',
        'Protéger la propriété intellectuelle'
      ],
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    }, 'fr');
    this.addProgramme({
      id: 'temm',
      name: 'Programme TEMM pour le développement local',
      description: 'Programme de développement local et d\'industrialisation',
      objectives: [
        'Concevoir et financer des projets pilotes dans des domaines spécifiques de développement local',
        'Démontrer et exploiter les grandes potentialités du pays',
        'Encourager les investissements dans l\'industrialisation et la recherche scientifique',
        'Collaborer avec les partenaires techniques et scientifiques'
      ],
      details: 'Le programme TEMM parmi les programmes le plus récent adopté par le Conseil d\'Administration de l\'ANRSI. Ce programme conçoit et finance des projets pilotes dans des domaines spécifiques de développement local en vue de démontrer et exploiter les grandes potentialités du pays et d\'encourager les investissements dans l\'industrialisation et la recherche scientifique avec les partenaires techniques et scientifiques. Le premier projet de ce programme portera sur les cultures maraichères abritées, leur production, leur conservation et leur transformation, a été démarré effectivement dans le cadre de la convention signée le 04 novembre 2021 entre l\'ANRSI et L\'ISET.',
      icon: 'fas fa-industry',
      color: '#126564'
    }, 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    
    // Check if Arabic data already exists
    if (arGroup.get('heroTitle')?.value && (arGroup.get('programmes') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arGroup.patchValue({
      heroTitle: 'البرامج',
      heroSubtitle: 'برامج الوكالة',
      ctaTitle: 'مهتم ببرامجنا؟',
      ctaDescription: 'اكتشف كيفية المشاركة في برامجنا للبحث والابتكار'
    });

    // Clear existing array for Arabic
    const arProgrammes = arGroup.get('programmes') as FormArray;
    while (arProgrammes.length) arProgrammes.removeAt(0);

    // Add default programmes for Arabic
    this.addProgramme({
      id: 'temkin',
      name: 'برنامج تمكين (التمكين)',
      description: 'برنامج تمكين الهياكل البحثية',
      objectives: [
        'ضمان سير عمل الهياكل البحثية المعترف بها',
        'تشجيع ثقافة تبادل الموارد',
        'كسر عزلة الباحثين',
        'تعزيز قدرات مؤسسات التعليم العالي والبحث العلمي والباحثين في مجال إدارة وحوكمة البحث العلمي'
      ],
      icon: 'fas fa-university',
      color: '#0a3d62'
    }, 'ar');
    this.addProgramme({
      id: 'temeyouz',
      name: 'برنامج تميوز (التميز)',
      description: 'برنامج التميز العلمي للباحثين الشباب',
      objectives: [
        'دعم التميز العلمي بين الباحثين الشباب',
        'تشجيع طلبة الدكتوراه على تكريس وقت كامل لأطروحاتهم',
        'زيادة الإنتاج العلمي الوطني وتحسين وضوحه',
        'تشجيع وتحفيز الإشراف والإنتاج العلمي',
        'تطوير الإبداع وروح ريادة الأعمال لدى الباحثين الشباب'
      ],
      icon: 'fas fa-graduation-cap',
      color: '#20a39e'
    }, 'ar');
    this.addProgramme({
      id: 'tethmin',
      name: 'برنامج تثمين (التثمين)',
      description: 'برنامج تثمين البحث العلمي',
      objectives: [
        'ضمان نشر ومشاركة المعرفة',
        'التعريف بموضوعات البحث لدى الهياكل البحثية',
        'تعزيز شبكة الباحثين حول الموضوعات ذات الأولوية',
        'تعزيز وضوح الإنتاج العلمي الوطني',
        'دعم إنشاء هياكل لتثمين البحث العلمي (حاضنات)',
        'حماية الملكية الفكرية'
      ],
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    }, 'ar');
    this.addProgramme({
      id: 'temm',
      name: 'برنامج TEMM للتنمية المحلية',
      description: 'برنامج التنمية المحلية والتصنيع',
      objectives: [
        'تصميم وتمويل مشاريع تجريبية في مجالات محددة من التنمية المحلية',
        'إظهار واستغلال الإمكانيات الكبرى للبلاد',
        'تشجيع الاستثمارات في التصنيع والبحث العلمي',
        'التعاون مع الشركاء الفنيين والعلميين'
      ],
      details: 'يعد برنامج TEMM أحد أحدث البرامج التي اعتمدها مجلس إدارة الوكالة. يقوم البرنامج بتصميم وتمويل مشاريع تجريبية في مجالات محددة من التنمية المحلية لإظهار واستغلال الإمكانيات الكبرى للبلاد وتشجيع الاستثمارات في التصنيع والبحث العلمي مع الشركاء الفنيين والعلميين. وقد تم إطلاق أول مشروع في إطار هذا البرنامج، الذي يركز على المحاصيل الزراعية المحمية وإنتاجها وحفظها وتحويلها، بشكل فعلي بموجب الاتفاقية الموقعة في 4 نوفمبر 2021 بين الوكالة وISET.',
      icon: 'fas fa-industry',
      color: '#126564'
    }, 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    
    // Check if English data already exists
    if (enGroup.get('heroTitle')?.value && (enGroup.get('programmes') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enGroup.patchValue({
      heroTitle: 'Programs',
      heroSubtitle: 'Agency Programs',
      ctaTitle: 'Interested in our programs?',
      ctaDescription: 'Discover how to participate in our research and innovation programs'
    });

    // Clear existing array for English
    const enProgrammes = enGroup.get('programmes') as FormArray;
    while (enProgrammes.length) enProgrammes.removeAt(0);

    // Add default programmes for English
    this.addProgramme({
      id: 'temkin',
      name: 'Temkin Program (Empowerment)',
      description: 'Program for empowering research structures',
      objectives: [
        'Ensure the proper functioning of recognized Research Structures (RS)',
        'Encourage a culture of resource sharing',
        'Break the isolation of researchers',
        'Strengthen the capacities of Higher Education and Research Institutions and researchers in research management and governance'
      ],
      icon: 'fas fa-university',
      color: '#0a3d62'
    }, 'en');
    this.addProgramme({
      id: 'temeyouz',
      name: 'Temeyouz Program (Excellence)',
      description: 'Scientific excellence program for young researchers',
      objectives: [
        'Support scientific excellence among young researchers',
        'Encourage PhD students to dedicate full time to their theses',
        'Increase national scientific output and improve its visibility',
        'Encourage and motivate supervision and scientific production',
        'Develop creativity and entrepreneurship among young researchers'
      ],
      icon: 'fas fa-graduation-cap',
      color: '#20a39e'
    }, 'en');
    this.addProgramme({
      id: 'tethmin',
      name: 'Tethmin Program (Valorization)',
      description: 'Program for the valorization of scientific research',
      objectives: [
        'Ensure dissemination and sharing of knowledge',
        'Raise awareness of the research topics of Research Structures',
        'Strengthen networking among researchers around priority topics',
        'Promote the visibility of national scientific output',
        'Support the establishment of research valorization structures (incubators)',
        'Protect intellectual property'
      ],
      icon: 'fas fa-lightbulb',
      color: '#ff6b6b'
    }, 'en');
    this.addProgramme({
      id: 'temm',
      name: 'TEMM Program for Local Development',
      description: 'Program for local development and industrialization',
      objectives: [
        'Design and fund pilot projects in specific areas of local development',
        'Demonstrate and exploit the country\'s major potential',
        'Encourage investments in industrialization and scientific research',
        'Collaborate with technical and scientific partners'
      ],
      details: 'The TEMM program is one of the most recent programs adopted by the ANRSI Board of Directors. It designs and funds pilot projects in specific areas of local development to demonstrate and exploit the country\'s major potential and encourage investments in industrialization and scientific research with technical and scientific partners. The first project under this program, focused on protected horticultural crops, their production, conservation, and processing, was effectively launched under the agreement signed on November 4, 2021, between ANRSI and ISET.',
      icon: 'fas fa-industry',
      color: '#126564'
    }, 'en');
  }

  populateForm(content: ProgrammesContent): void {
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

        // Clear existing array
        const programmes = langGroup.get('programmes') as FormArray;
        while (programmes.length) programmes.removeAt(0);

        // Populate array
        langContent.programmes?.forEach(programme => this.addProgramme(programme, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: ProgrammesContent = {
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
          title: langContent.heroTitle || 'Programmes',
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
        slug: 'programmes',
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

  private buildLanguageContent(langData: any): ProgrammesLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      programmes: (langData.programmes || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        objectives: p.objectives || [],
        icon: p.icon,
        color: p.color,
        details: p.details || undefined
      })),
      ctaTitle: langData.ctaTitle || '',
      ctaDescription: langData.ctaDescription || ''
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Programmes',
        ar: 'تعديل صفحة البرامج',
        en: 'Edit Programmes Page'
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
      'programmesSection': {
        fr: 'Programmes',
        ar: 'البرامج',
        en: 'Programmes'
      },
      'ctaSection': {
        fr: 'Section Appel à l\'Action',
        ar: 'قسم الدعوة إلى العمل',
        en: 'Call to Action Section'
      },
      'id': {
        fr: 'ID *',
        ar: 'المعرف *',
        en: 'ID *'
      },
      'name': {
        fr: 'Nom *',
        ar: 'الاسم *',
        en: 'Name *'
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
      'addProgramme': {
        fr: 'Ajouter un programme',
        ar: 'إضافة برنامج',
        en: 'Add Programme'
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



