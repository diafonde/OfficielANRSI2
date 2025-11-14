import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface OverviewItem {
  icon: string;
  title: string;
  content: { label: string; value: string }[];
}

interface ThemeItem {
  icon: string;
  title: string;
  items: string[];
}

interface Session {
  time: string;
  title: string;
  description: string;
}

interface ProgrammeDay {
  date: string;
  theme: string;
  sessions: Session[];
}

interface Speaker {
  avatar: string;
  name: string;
  title: string;
  bio: string;
}

interface RegistrationMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
  price: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ZoneHumideLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  overview: OverviewItem[];
  themes: ThemeItem[];
  programme: ProgrammeDay[];
  speakers: Speaker[];
  registrationModes: RegistrationMode[];
  processSteps: ProcessStep[];
  contactInfo: ContactItem[];
}

interface ZoneHumideContent {
  translations: {
    fr: ZoneHumideLanguageContent;
    ar: ZoneHumideLanguageContent;
    en: ZoneHumideLanguageContent;
  };
}

@Component({
  selector: 'app-admin-zone-humide-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-zone-humide-form.component.html',
  styleUrls: ['./admin-zone-humide-form.component.scss']
})
export class AdminZoneHumideFormComponent implements OnInit {
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
      overview: this.fb.array([]),
      themes: this.fb.array([]),
      programme: this.fb.array([]),
      speakers: this.fb.array([]),
      registrationModes: this.fb.array([]),
      processSteps: this.fb.array([]),
      contactInfo: this.fb.array([])
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

  // Overview FormArray methods
  get overview(): FormArray {
    return this.getActiveLanguageFormGroup().get('overview') as FormArray;
  }

  addOverview(item?: OverviewItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const overview = langGroup.get('overview') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📅', Validators.required],
      title: [item?.title || '', Validators.required],
      content: this.fb.array(item?.content?.map(c => this.createContentItemGroup(c)) || [])
    });
    overview.push(group);
  }

  removeOverview(index: number): void {
    this.overview.removeAt(index);
  }

  getOverviewContent(index: number): FormArray {
    return this.overview.at(index).get('content') as FormArray;
  }

  createContentItemGroup(item?: { label: string; value: string }): FormGroup {
    return this.fb.group({
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
  }

  addOverviewContentItem(overviewIndex: number): void {
    this.getOverviewContent(overviewIndex).push(this.createContentItemGroup());
  }

  removeOverviewContentItem(overviewIndex: number, itemIndex: number): void {
    this.getOverviewContent(overviewIndex).removeAt(itemIndex);
  }

  // Themes FormArray methods
  get themes(): FormArray {
    return this.getActiveLanguageFormGroup().get('themes') as FormArray;
  }

  addTheme(item?: ThemeItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const themes = langGroup.get('themes') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '💧', Validators.required],
      title: [item?.title || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    themes.push(group);
  }

  removeTheme(index: number): void {
    this.themes.removeAt(index);
  }

  getThemeItems(index: number): FormArray {
    return this.themes.at(index).get('items') as FormArray;
  }

  addThemeItem(index: number, value = ''): void {
    this.getThemeItems(index).push(this.fb.control(value));
  }

  removeThemeItem(themeIndex: number, itemIndex: number): void {
    this.getThemeItems(themeIndex).removeAt(itemIndex);
  }

  // Programme FormArray methods
  get programme(): FormArray {
    return this.getActiveLanguageFormGroup().get('programme') as FormArray;
  }

  addProgrammeDay(day?: ProgrammeDay, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const programme = langGroup.get('programme') as FormArray;
    const group = this.fb.group({
      date: [day?.date || '', Validators.required],
      theme: [day?.theme || '', Validators.required],
      sessions: this.fb.array(day?.sessions?.map(s => this.createSessionGroup(s)) || [])
    });
    programme.push(group);
  }

  removeProgrammeDay(index: number): void {
    this.programme.removeAt(index);
  }

  getDaySessions(index: number): FormArray {
    return this.programme.at(index).get('sessions') as FormArray;
  }

  createSessionGroup(session?: Session): FormGroup {
    return this.fb.group({
      time: [session?.time || '', Validators.required],
      title: [session?.title || '', Validators.required],
      description: [session?.description || '', Validators.required]
    });
  }

  addSession(dayIndex: number): void {
    this.getDaySessions(dayIndex).push(this.createSessionGroup());
  }

  removeSession(dayIndex: number, sessionIndex: number): void {
    this.getDaySessions(dayIndex).removeAt(sessionIndex);
  }

  // Speakers FormArray methods
  get speakers(): FormArray {
    return this.getActiveLanguageFormGroup().get('speakers') as FormArray;
  }

  addSpeaker(speaker?: Speaker, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const speakers = langGroup.get('speakers') as FormArray;
    const group = this.fb.group({
      avatar: [speaker?.avatar || '👨‍🔬', Validators.required],
      name: [speaker?.name || '', Validators.required],
      title: [speaker?.title || '', Validators.required],
      bio: [speaker?.bio || '', Validators.required]
    });
    speakers.push(group);
  }

  removeSpeaker(index: number): void {
    this.speakers.removeAt(index);
  }

  // Registration Modes FormArray methods
  get registrationModes(): FormArray {
    return this.getActiveLanguageFormGroup().get('registrationModes') as FormArray;
  }

  addRegistrationMode(mode?: RegistrationMode, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const registrationModes = langGroup.get('registrationModes') as FormArray;
    const group = this.fb.group({
      icon: [mode?.icon || '🏢', Validators.required],
      title: [mode?.title || '', Validators.required],
      description: [mode?.description || '', Validators.required],
      items: this.fb.array(mode?.items?.map(i => this.fb.control(i)) || []),
      price: [mode?.price || '', Validators.required]
    });
    registrationModes.push(group);
  }

  removeRegistrationMode(index: number): void {
    this.registrationModes.removeAt(index);
  }

  getModeItems(index: number): FormArray {
    return this.registrationModes.at(index).get('items') as FormArray;
  }

  addModeItem(index: number, value = ''): void {
    this.getModeItems(index).push(this.fb.control(value));
  }

  removeModeItem(modeIndex: number, itemIndex: number): void {
    this.getModeItems(modeIndex).removeAt(itemIndex);
  }

  // Process Steps FormArray methods
  get processSteps(): FormArray {
    return this.getActiveLanguageFormGroup().get('processSteps') as FormArray;
  }

  addProcessStep(step?: ProcessStep, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const processSteps = langGroup.get('processSteps') as FormArray;
    const group = this.fb.group({
      number: [step?.number || processSteps.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required]
    });
    processSteps.push(group);
  }

  removeProcessStep(index: number): void {
    this.processSteps.removeAt(index);
    // Renumber remaining steps
    this.processSteps.controls.forEach((control, i) => {
      control.patchValue({ number: i + 1 });
    });
  }

  // Contact Info FormArray methods
  get contactInfo(): FormArray {
    return this.getActiveLanguageFormGroup().get('contactInfo') as FormArray;
  }

  addContactItem(item?: ContactItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const contactInfo = langGroup.get('contactInfo') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || 'fas fa-envelope', Validators.required],
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
    contactInfo.push(group);
  }

  removeContactItem(index: number): void {
    this.contactInfo.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('zone-humide').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: ZoneHumideContent = parsedContent;
              this.populateForm(content);
            } else {
              // Old format - migrate to new format
              const oldContent: ZoneHumideLanguageContent = parsedContent;
              const content: ZoneHumideContent = {
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

  private getEmptyLanguageContent(): ZoneHumideLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      overview: [],
      themes: [],
      programme: [],
      speakers: [],
      registrationModes: [],
      processSteps: [],
      contactInfo: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Zone Humide',
      heroSubtitle: 'Colloque International sur les Zones Humides du Sahel',
      introText: 'L\'ANRSI organise un colloque international majeur sur la préservation et la gestion durable des zones humides du Sahel, réunissant experts, chercheurs et décideurs pour échanger sur les enjeux environnementaux et climatiques.'
    });

    // Add default overview for French
    this.addOverview({
      icon: '📅',
      title: 'Dates et Lieu',
      content: [
        { label: 'Date :', value: '15-17 Mars 2024' },
        { label: 'Lieu :', value: 'Centre International de Conférences, Nouakchott' },
        { label: 'Format :', value: 'Présentiel et en ligne' }
      ]
    }, 'fr');
    this.addOverview({
      icon: '👥',
      title: 'Participants Attendus',
      content: [
        { label: 'Experts internationaux :', value: '50+ spécialistes' },
        { label: 'Chercheurs :', value: '100+ scientifiques' },
        { label: 'Décideurs :', value: 'Ministres et responsables' },
        { label: 'ONG et OSC :', value: 'Organisations de la société civile' }
      ]
    }, 'fr');
    this.addOverview({
      icon: '🌍',
      title: 'Pays Participants',
      content: [
        { label: 'Afrique de l\'Ouest :', value: 'Sénégal, Mali, Niger, Burkina Faso' },
        { label: 'Afrique du Nord :', value: 'Maroc, Algérie, Tunisie' },
        { label: 'Europe :', value: 'France, Belgique, Espagne' },
        { label: 'Organisations :', value: 'UICN, Ramsar, PNUE' }
      ]
    }, 'fr');

    // Add default themes for French
    this.addTheme({
      icon: '💧',
      title: 'Gestion des Ressources Hydriques',
      items: ['Conservation des zones humides', 'Gestion intégrée des bassins versants', 'Technologies de traitement de l\'eau', 'Économie de l\'eau']
    }, 'fr');
    this.addTheme({
      icon: '🌱',
      title: 'Biodiversité et Écosystèmes',
      items: ['Protection de la faune et flore', 'Restauration écologique', 'Services écosystémiques', 'Corridors écologiques']
    }, 'fr');
    this.addTheme({
      icon: '🌡️',
      title: 'Changement Climatique',
      items: ['Adaptation aux changements climatiques', 'Atténuation des effets', 'Modélisation climatique', 'Stratégies de résilience']
    }, 'fr');
    this.addTheme({
      icon: '👨‍🌾',
      title: 'Développement Durable',
      items: ['Agriculture durable', 'Pêche responsable', 'Écotourisme', 'Économie verte']
    }, 'fr');
    this.addTheme({
      icon: '🏛️',
      title: 'Gouvernance et Politiques',
      items: ['Cadres législatifs', 'Politiques publiques', 'Participation communautaire', 'Coopération internationale']
    }, 'fr');
    this.addTheme({
      icon: '🔬',
      title: 'Recherche et Innovation',
      items: ['Technologies de monitoring', 'Innovation environnementale', 'Transfert de connaissances', 'Formation et éducation']
    }, 'fr');

    // Add default contact info for French
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'zonehumide@anrsi.mr' }, 'fr');
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' }, 'fr');
    this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Lieu', value: 'Centre International de Conférences, Nouakchott' }, 'fr');
    this.addContactItem({ icon: 'fas fa-calendar', label: 'Date Limite', value: '28 Février 2024' }, 'fr');
  }

  populateForm(content: ZoneHumideContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || ''
        });

        // Clear existing arrays
        const overview = langGroup.get('overview') as FormArray;
        const themes = langGroup.get('themes') as FormArray;
        const programme = langGroup.get('programme') as FormArray;
        const speakers = langGroup.get('speakers') as FormArray;
        const registrationModes = langGroup.get('registrationModes') as FormArray;
        const processSteps = langGroup.get('processSteps') as FormArray;
        const contactInfo = langGroup.get('contactInfo') as FormArray;
        while (overview.length) overview.removeAt(0);
        while (themes.length) themes.removeAt(0);
        while (programme.length) programme.removeAt(0);
        while (speakers.length) speakers.removeAt(0);
        while (registrationModes.length) registrationModes.removeAt(0);
        while (processSteps.length) processSteps.removeAt(0);
        while (contactInfo.length) contactInfo.removeAt(0);

        // Populate arrays
        langContent.overview?.forEach(item => this.addOverview(item, lang));
        langContent.themes?.forEach(item => this.addTheme(item, lang));
        langContent.programme?.forEach(item => this.addProgrammeDay(item, lang));
        langContent.speakers?.forEach(item => this.addSpeaker(item, lang));
        langContent.registrationModes?.forEach(item => this.addRegistrationMode(item, lang));
        langContent.processSteps?.forEach(item => this.addProcessStep(item, lang));
        langContent.contactInfo?.forEach(item => this.addContactItem(item, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: ZoneHumideContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Zone Humide';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Zone Humide',
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
        slug: 'zone-humide',
        title: 'Zone Humide',
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

  private buildLanguageContent(langData: any): ZoneHumideLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      overview: (langData.overview || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        content: item.content || []
      })),
      themes: (langData.themes || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        items: item.items || []
      })),
      programme: langData.programme || [],
      speakers: langData.speakers || [],
      registrationModes: (langData.registrationModes || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        items: item.items || [],
        price: item.price
      })),
      processSteps: langData.processSteps || [],
      contactInfo: langData.contactInfo || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Zone Humide',
        ar: 'تعديل صفحة المناطق الرطبة',
        en: 'Edit Wetlands Page'
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
      'introSection': {
        fr: 'Introduction',
        ar: 'مقدمة',
        en: 'Introduction'
      },
      'introText': {
        fr: 'Texte d\'introduction *',
        ar: 'نص المقدمة *',
        en: 'Intro Text *'
      },
      'overviewSection': {
        fr: 'Aperçu du Colloque',
        ar: 'نظرة عامة على المؤتمر',
        en: 'Colloquium Overview'
      },
      'themesSection': {
        fr: 'Thèmes',
        ar: 'المواضيع',
        en: 'Themes'
      },
      'programmeSection': {
        fr: 'Programme',
        ar: 'البرنامج',
        en: 'Programme'
      },
      'speakersSection': {
        fr: 'Intervenants',
        ar: 'المتحدثون',
        en: 'Speakers'
      },
      'registrationModesSection': {
        fr: 'Modes d\'Inscription',
        ar: 'طرق التسجيل',
        en: 'Registration Modes'
      },
      'processStepsSection': {
        fr: 'Étapes du Processus d\'Inscription',
        ar: 'خطوات عملية التسجيل',
        en: 'Registration Process Steps'
      },
      'contactInfoSection': {
        fr: 'Informations de Contact',
        ar: 'معلومات الاتصال',
        en: 'Contact Information'
      },
      'icon': {
        fr: 'Icône',
        ar: 'أيقونة',
        en: 'Icon'
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
      'contentItems': {
        fr: 'Éléments de Contenu',
        ar: 'عناصر المحتوى',
        en: 'Content Items'
      },
      'items': {
        fr: 'Éléments',
        ar: 'العناصر',
        en: 'Items'
      },
      'date': {
        fr: 'Date *',
        ar: 'التاريخ *',
        en: 'Date *'
      },
      'theme': {
        fr: 'Thème *',
        ar: 'الموضوع *',
        en: 'Theme *'
      },
      'sessions': {
        fr: 'Sessions',
        ar: 'الجلسات',
        en: 'Sessions'
      },
      'time': {
        fr: 'Heure *',
        ar: 'الوقت *',
        en: 'Time *'
      },
      'avatar': {
        fr: 'Avatar (Emoji)',
        ar: 'الصورة الرمزية (إيموجي)',
        en: 'Avatar (Emoji)'
      },
      'name': {
        fr: 'Nom *',
        ar: 'الاسم *',
        en: 'Name *'
      },
      'bio': {
        fr: 'Biographie *',
        ar: 'السيرة الذاتية *',
        en: 'Bio *'
      },
      'price': {
        fr: 'Prix *',
        ar: 'السعر *',
        en: 'Price *'
      },
      'stepNumber': {
        fr: 'Numéro d\'étape *',
        ar: 'رقم الخطوة *',
        en: 'Step Number *'
      },
      'label': {
        fr: 'Libellé *',
        ar: 'التسمية *',
        en: 'Label *'
      },
      'value': {
        fr: 'Valeur *',
        ar: 'القيمة *',
        en: 'Value *'
      },
      'iconFontAwesome': {
        fr: 'Icône (classe FontAwesome) *',
        ar: 'أيقونة (فئة FontAwesome) *',
        en: 'Icon (FontAwesome class) *'
      },
      'addOverview': {
        fr: 'Ajouter un élément d\'aperçu',
        ar: 'إضافة عنصر نظرة عامة',
        en: 'Add Overview Item'
      },
      'addTheme': {
        fr: 'Ajouter un thème',
        ar: 'إضافة موضوع',
        en: 'Add Theme'
      },
      'addProgrammeDay': {
        fr: 'Ajouter une journée de programme',
        ar: 'إضافة يوم برنامج',
        en: 'Add Programme Day'
      },
      'addSession': {
        fr: 'Ajouter une session',
        ar: 'إضافة جلسة',
        en: 'Add Session'
      },
      'addSpeaker': {
        fr: 'Ajouter un intervenant',
        ar: 'إضافة متحدث',
        en: 'Add Speaker'
      },
      'addRegistrationMode': {
        fr: 'Ajouter un mode d\'inscription',
        ar: 'إضافة طريقة تسجيل',
        en: 'Add Registration Mode'
      },
      'addProcessStep': {
        fr: 'Ajouter une étape de processus',
        ar: 'إضافة خطوة عملية',
        en: 'Add Process Step'
      },
      'addContactItem': {
        fr: 'Ajouter un élément de contact',
        ar: 'إضافة عنصر اتصال',
        en: 'Add Contact Item'
      },
      'addContentItem': {
        fr: 'Ajouter un élément de contenu',
        ar: 'إضافة عنصر محتوى',
        en: 'Add Content Item'
      },
      'addItem': {
        fr: 'Ajouter un élément',
        ar: 'إضافة عنصر',
        en: 'Add Item'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'إزالة',
        en: 'Remove'
      },
      'removeDay': {
        fr: 'Supprimer la journée',
        ar: 'إزالة اليوم',
        en: 'Remove Day'
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



