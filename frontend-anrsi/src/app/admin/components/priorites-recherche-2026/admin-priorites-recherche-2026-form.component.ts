import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface ResearchPriority {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface PrioritesRecherche2026LanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introParagraphs: string[];
  sectionTitle: string;
  researchPriorities: ResearchPriority[];
  publicationDate: string;
}

interface PrioritesRecherche2026Content {
  translations: {
    fr: PrioritesRecherche2026LanguageContent;
    ar: PrioritesRecherche2026LanguageContent;
    en: PrioritesRecherche2026LanguageContent;
  };
}

@Component({
  selector: 'app-admin-priorites-recherche-2026-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-priorites-recherche-2026-form.component.html',
  styleUrls: ['./admin-priorites-recherche-2026-form.component.scss']
})
export class AdminPrioritesRecherche2026FormComponent implements OnInit {
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
      introParagraphs: this.fb.array([]),
      sectionTitle: ['', Validators.required],
      researchPriorities: this.fb.array([]),
      publicationDate: ['', Validators.required]
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

  // Intro Paragraphs FormArray methods
  get introParagraphs(): FormArray {
    return this.getActiveLanguageFormGroup().get('introParagraphs') as FormArray;
  }

  addIntroParagraph(text?: string, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const paragraphs = langGroup.get('introParagraphs') as FormArray;
    const group = this.fb.group({
      text: [text || '', Validators.required]
    });
    paragraphs.push(group);
  }

  removeIntroParagraph(index: number): void {
    this.introParagraphs.removeAt(index);
  }

  // Research Priorities FormArray methods
  get researchPriorities(): FormArray {
    return this.getActiveLanguageFormGroup().get('researchPriorities') as FormArray;
  }

  addResearchPriority(priority?: ResearchPriority, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const priorities = langGroup.get('researchPriorities') as FormArray;
    const group = this.fb.group({
      id: [priority?.id || priorities.length + 1, Validators.required],
      title: [priority?.title || '', Validators.required],
      description: [priority?.description || '', Validators.required],
      icon: [priority?.icon || '', Validators.required]
    });
    priorities.push(group);
  }

  removeResearchPriority(index: number): void {
    this.researchPriorities.removeAt(index);
    // Update IDs after removal
    this.updatePriorityIds();
  }

  updatePriorityIds(): void {
    this.researchPriorities.controls.forEach((control, index) => {
      control.patchValue({ id: index + 1 }, { emitEvent: false });
    });
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('priorites-recherche-2026').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: PrioritesRecherche2026Content = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              if (!arGroup.get('heroTitle')?.value || (arGroup.get('researchPriorities') as FormArray).length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              if (!enGroup.get('heroTitle')?.value || (enGroup.get('researchPriorities') as FormArray).length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: PrioritesRecherche2026LanguageContent = parsedContent;
              const content: PrioritesRecherche2026Content = {
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

  private getEmptyLanguageContent(): PrioritesRecherche2026LanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introParagraphs: [],
      sectionTitle: '',
      researchPriorities: [],
      publicationDate: ''
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'LES PRIORITÉS DE LA RECHERCHE À L\'HORIZON 2026',
      heroSubtitle: 'L\'ANRSI définit les priorités de la recherche scientifique et de l\'innovation pour le développement national',
      sectionTitle: 'Les Sept Axes Stratégiques',
      publicationDate: '18 Janvier 2023'
    });

    // Clear existing arrays for French
    const frParagraphs = frGroup.get('introParagraphs') as FormArray;
    const frPriorities = frGroup.get('researchPriorities') as FormArray;
    while (frParagraphs.length) frParagraphs.removeAt(0);
    while (frPriorities.length) frPriorities.removeAt(0);

    // Add default intro paragraphs for French
    this.addIntroParagraph('Se basant sur la stratégie nationale de la recherche scientifique et de l\'innovation adoptée par le Gouvernement, l\'Agence nationale de la recherche scientifique et de l\'innovation publie les détails des sept axes de ladite stratégie.', 'fr');
    this.addIntroParagraph('Ces axes sont répartis suivant les besoins de développement et en réponse aux défis actuels, pour couvrir des domaines variés allant de l\'autosuffisance alimentaire à la digitalisation et les défis émergents avec l\'explosion de l\'intelligence artificielle, en passant par la santé, les industries extractives.', 'fr');
    this.addIntroParagraph('Les recherches humaines et sociales occupent une place de choix dans ces axes, la stratégie leur ayant consacré deux axes à travers lesquels il est possible d\'œuvrer pour "la valorisation des savoirs autochtones ancestraux afin d\'affronter les enjeux sociétaux, de combattre la vulnérabilité, les disparités sociales et l\'exclusion et de consolider l\'unité nationale".', 'fr');

    // Add default research priorities for French
    this.addResearchPriority({
      id: 1,
      title: 'Autosuffisance Alimentaire',
      description: 'Développement de stratégies pour assurer la sécurité alimentaire nationale et réduire la dépendance aux importations.',
      icon: 'fas fa-seedling'
    }, 'fr');
    this.addResearchPriority({
      id: 2,
      title: 'Digitalisation et Intelligence Artificielle',
      description: 'Intégration des technologies numériques et de l\'IA pour moderniser les secteurs économiques et améliorer l\'efficacité.',
      icon: 'fas fa-robot'
    }, 'fr');
    this.addResearchPriority({
      id: 3,
      title: 'Santé et Bien-être',
      description: 'Amélioration des systèmes de santé, prévention des maladies et promotion du bien-être de la population.',
      icon: 'fas fa-heartbeat'
    }, 'fr');
    this.addResearchPriority({
      id: 4,
      title: 'Industries Extractives',
      description: 'Optimisation de l\'exploitation des ressources naturelles de manière durable et responsable.',
      icon: 'fas fa-mountain'
    }, 'fr');
    this.addResearchPriority({
      id: 5,
      title: 'Recherches Humaines et Sociales I',
      description: 'Valorisation des savoirs autochtones ancestraux pour affronter les enjeux sociétaux contemporains.',
      icon: 'fas fa-users'
    }, 'fr');
    this.addResearchPriority({
      id: 6,
      title: 'Recherches Humaines et Sociales II',
      description: 'Combattre la vulnérabilité, les disparités sociales et l\'exclusion pour consolider l\'unité nationale.',
      icon: 'fas fa-hands-helping'
    }, 'fr');
    this.addResearchPriority({
      id: 7,
      title: 'Développement Durable',
      description: 'Promotion de pratiques respectueuses de l\'environnement et du développement durable à long terme.',
      icon: 'fas fa-leaf'
    }, 'fr');

    // Load Arabic and English defaults
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  loadDefaultArabicData(): void {
    const arGroup = this.getLanguageFormGroup('ar');
    
    // Check if Arabic data already exists
    if (arGroup.get('heroTitle')?.value && (arGroup.get('researchPriorities') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    arGroup.patchValue({
      heroTitle: 'أولويات البحث في أفق 2026',
      heroSubtitle: 'تحدد الوكالة الوطنية للبحث العلمي والابتكار أولويات البحث العلمي والابتكار لخدمة التنمية الوطنية',
      sectionTitle: 'المحاور الاستراتيجية السبعة',
      publicationDate: '18 يناير 2023'
    });

    // Clear existing arrays for Arabic
    const arParagraphs = arGroup.get('introParagraphs') as FormArray;
    const arPriorities = arGroup.get('researchPriorities') as FormArray;
    while (arParagraphs.length) arParagraphs.removeAt(0);
    while (arPriorities.length) arPriorities.removeAt(0);

    // Add default intro paragraphs for Arabic
    this.addIntroParagraph('استنادًا إلى الاستراتيجية الوطنية للبحث العلمي والابتكار التي اعتمدتها الحكومة، تنشر الوكالة الوطنية للبحث العلمي والابتكار تفاصيل المحاور السبعة لهذه الاستراتيجية.', 'ar');
    this.addIntroParagraph('توزَّع هذه المحاور وفق احتياجات التنمية واستجابةً للتحديات الراهنة، لتغطي مجالات متنوعة تمتد من تحقيق الاكتفاء الذاتي الغذائي إلى الرقمنة والتحديات الناشئة مع تطور الذكاء الاصطناعي، مرورًا بالصحة والصناعات الاستخراجية.', 'ar');
    this.addIntroParagraph('تحظى البحوث الإنسانية والاجتماعية بمكانة مهمة في هذه المحاور، حيث خصصت لها الاستراتيجية محورين يمكن من خلالهما العمل على "تثمين المعارف التقليدية الأصيلة لمواجهة التحديات المجتمعية، ومحاربة الهشاشة والفوارق الاجتماعية والإقصاء، وتعزيز الوحدة الوطنية".', 'ar');

    // Add default research priorities for Arabic
    this.addResearchPriority({
      id: 1,
      title: 'الاكتفاء الذاتي الغذائي',
      description: 'تطوير استراتيجيات لضمان الأمن الغذائي الوطني وتقليل الاعتماد على الواردات.',
      icon: 'fas fa-seedling'
    }, 'ar');
    this.addResearchPriority({
      id: 2,
      title: 'الرقمنة والذكاء الاصطناعي',
      description: 'دمج التقنيات الرقمية والذكاء الاصطناعي لتحديث القطاعات الاقتصادية وتحسين الكفاءة.',
      icon: 'fas fa-robot'
    }, 'ar');
    this.addResearchPriority({
      id: 3,
      title: 'الصحة والرفاه',
      description: 'تحسين الأنظمة الصحية، الوقاية من الأمراض، وتعزيز رفاه السكان.',
      icon: 'fas fa-heartbeat'
    }, 'ar');
    this.addResearchPriority({
      id: 4,
      title: 'الصناعات الاستخراجية',
      description: 'تحسين استغلال الموارد الطبيعية بطريقة مستدامة ومسؤولة.',
      icon: 'fas fa-mountain'
    }, 'ar');
    this.addResearchPriority({
      id: 5,
      title: 'البحوث الإنسانية والاجتماعية I',
      description: 'تثمين المعارف التقليدية الأصيلة لمواجهة التحديات المجتمعية المعاصرة.',
      icon: 'fas fa-users'
    }, 'ar');
    this.addResearchPriority({
      id: 6,
      title: 'البحوث الإنسانية والاجتماعية II',
      description: 'مكافحة الهشاشة والفوارق الاجتماعية والإقصاء لتعزيز الوحدة الوطنية.',
      icon: 'fas fa-hands-helping'
    }, 'ar');
    this.addResearchPriority({
      id: 7,
      title: 'التنمية المستدامة',
      description: 'تعزيز الممارسات الصديقة للبيئة والتنمية المستدامة على المدى الطويل.',
      icon: 'fas fa-leaf'
    }, 'ar');
  }

  loadDefaultEnglishData(): void {
    const enGroup = this.getLanguageFormGroup('en');
    
    // Check if English data already exists
    if (enGroup.get('heroTitle')?.value && (enGroup.get('researchPriorities') as FormArray).length > 0) {
      return; // Don't overwrite existing data
    }

    enGroup.patchValue({
      heroTitle: 'RESEARCH PRIORITIES FOR 2026',
      heroSubtitle: 'ANRSI defines the priorities for scientific research and innovation for national development',
      sectionTitle: 'The Seven Strategic Axes',
      publicationDate: '18 January 2023'
    });

    // Clear existing arrays for English
    const enParagraphs = enGroup.get('introParagraphs') as FormArray;
    const enPriorities = enGroup.get('researchPriorities') as FormArray;
    while (enParagraphs.length) enParagraphs.removeAt(0);
    while (enPriorities.length) enPriorities.removeAt(0);

    // Add default intro paragraphs for English
    this.addIntroParagraph('Based on the national strategy for scientific research and innovation adopted by the Government, the National Agency for Scientific Research and Innovation publishes the details of the seven axes of this strategy.', 'en');
    this.addIntroParagraph('These axes are organized according to development needs and in response to current challenges, covering various fields ranging from food self-sufficiency to digitalization and emerging challenges with the rise of artificial intelligence, as well as health and extractive industries.', 'en');
    this.addIntroParagraph('Human and social sciences occupy a central place in these axes, as the strategy dedicated two axes to them, enabling efforts toward "the promotion of ancestral indigenous knowledge to address societal challenges, combat vulnerability, social disparities and exclusion, and strengthen national unity."', 'en');

    // Add default research priorities for English
    this.addResearchPriority({
      id: 1,
      title: 'Food Self-Sufficiency',
      description: 'Development of strategies to ensure national food security and reduce dependence on imports.',
      icon: 'fas fa-seedling'
    }, 'en');
    this.addResearchPriority({
      id: 2,
      title: 'Digitalization and Artificial Intelligence',
      description: 'Integration of digital technologies and AI to modernize economic sectors and improve efficiency.',
      icon: 'fas fa-robot'
    }, 'en');
    this.addResearchPriority({
      id: 3,
      title: 'Health and Well-being',
      description: 'Improving health systems, disease prevention, and promoting population well-being.',
      icon: 'fas fa-heartbeat'
    }, 'en');
    this.addResearchPriority({
      id: 4,
      title: 'Extractive Industries',
      description: 'Optimizing the exploitation of natural resources in a sustainable and responsible manner.',
      icon: 'fas fa-mountain'
    }, 'en');
    this.addResearchPriority({
      id: 5,
      title: 'Human and Social Research I',
      description: 'Promoting ancestral indigenous knowledge to face contemporary societal challenges.',
      icon: 'fas fa-users'
    }, 'en');
    this.addResearchPriority({
      id: 6,
      title: 'Human and Social Research II',
      description: 'Fighting vulnerability, social disparities, and exclusion to strengthen national unity.',
      icon: 'fas fa-hands-helping'
    }, 'en');
    this.addResearchPriority({
      id: 7,
      title: 'Sustainable Development',
      description: 'Promoting environmentally friendly practices and long-term sustainable development.',
      icon: 'fas fa-leaf'
    }, 'en');
  }

  populateForm(content: PrioritesRecherche2026Content): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          sectionTitle: langContent.sectionTitle || '',
          publicationDate: langContent.publicationDate || ''
        });

        // Clear existing arrays
        const paragraphs = langGroup.get('introParagraphs') as FormArray;
        const priorities = langGroup.get('researchPriorities') as FormArray;
        
        while (paragraphs.length) paragraphs.removeAt(0);
        while (priorities.length) priorities.removeAt(0);

        // Populate arrays
        langContent.introParagraphs?.forEach(paragraph => this.addIntroParagraph(paragraph, lang));
        langContent.researchPriorities?.forEach(priority => this.addResearchPriority(priority, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: PrioritesRecherche2026Content = {
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
          title: langContent.heroTitle || 'Priorités de la Recherche 2026',
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
        slug: 'priorites-recherche-2026',
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

  private buildLanguageContent(langData: any): PrioritesRecherche2026LanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introParagraphs: (langData.introParagraphs || []).map((p: any) => p.text || ''),
      sectionTitle: langData.sectionTitle || '',
      researchPriorities: langData.researchPriorities || [],
      publicationDate: langData.publicationDate || ''
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Priorités de la Recherche 2026',
        ar: 'تعديل صفحة أولويات البحث 2026',
        en: 'Edit Research Priorities 2026 Page'
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
      'introductionParagraphs': {
        fr: 'Paragraphes d\'introduction',
        ar: 'فقرات المقدمة',
        en: 'Introduction Paragraphs'
      },
      'paragraph': {
        fr: 'Paragraphe',
        ar: 'فقرة',
        en: 'Paragraph'
      },
      'addParagraph': {
        fr: 'Ajouter un paragraphe',
        ar: 'إضافة فقرة',
        en: 'Add Paragraph'
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
      'publicationDate': {
        fr: 'Date de publication *',
        ar: 'تاريخ النشر *',
        en: 'Publication Date *'
      },
      'researchPriorities': {
        fr: 'Priorités de recherche',
        ar: 'أولويات البحث',
        en: 'Research Priorities'
      },
      'id': {
        fr: 'ID *',
        ar: 'المعرف *',
        en: 'ID *'
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
        fr: 'Icône (classe Font Awesome) *',
        ar: 'أيقونة (فئة Font Awesome) *',
        en: 'Icon (Font Awesome class) *'
      },
      'addResearchPriority': {
        fr: 'Ajouter une priorité de recherche',
        ar: 'إضافة أولوية بحث',
        en: 'Add Research Priority'
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



