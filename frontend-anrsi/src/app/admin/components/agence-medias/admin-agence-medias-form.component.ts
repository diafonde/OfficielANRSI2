import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface MediaOverview {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface CoverageItem {
  date: string;
  title: string;
  description: string;
  mediaOutlets: { type: string; name: string }[];
}

interface MediaType {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface PressRelease {
  date: string;
  title: string;
  description: string;
  link?: string;
}

interface MediaKitItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface SocialPlatform {
  icon: string;
  name: string;
  handle: string;
  link?: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface AgenceMediasLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  mediaOverview: MediaOverview[];
  recentCoverage: CoverageItem[];
  mediaTypes: MediaType[];
  pressReleases: PressRelease[];
  mediaKit: MediaKitItem[];
  socialMedia: SocialPlatform[];
  contactInfo: ContactItem[];
}

interface AgenceMediasContent {
  translations: {
    fr: AgenceMediasLanguageContent;
    ar: AgenceMediasLanguageContent;
    en: AgenceMediasLanguageContent;
  };
}

@Component({
  selector: 'app-admin-agence-medias-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-agence-medias-form.component.html',
  styleUrls: ['./admin-agence-medias-form.component.scss']
})
export class AdminAgenceMediasFormComponent implements OnInit {
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
      mediaOverview: this.fb.array([]),
      recentCoverage: this.fb.array([]),
      mediaTypes: this.fb.array([]),
      pressReleases: this.fb.array([]),
      mediaKit: this.fb.array([]),
      socialMedia: this.fb.array([]),
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

  // Media Overview FormArray methods
  get mediaOverview(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaOverview') as FormArray;
  }

  addMediaOverview(item?: MediaOverview, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaOverview = langGroup.get('mediaOverview') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📺', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    mediaOverview.push(group);
  }

  removeMediaOverview(index: number): void {
    this.mediaOverview.removeAt(index);
  }

  getMediaOverviewItems(index: number): FormArray {
    return this.mediaOverview.at(index).get('items') as FormArray;
  }

  addMediaOverviewItem(index: number, value = ''): void {
    this.getMediaOverviewItems(index).push(this.fb.control(value));
  }

  removeMediaOverviewItem(overviewIndex: number, itemIndex: number): void {
    this.getMediaOverviewItems(overviewIndex).removeAt(itemIndex);
  }

  // Recent Coverage FormArray methods
  get recentCoverage(): FormArray {
    return this.getActiveLanguageFormGroup().get('recentCoverage') as FormArray;
  }

  addCoverageItem(item?: CoverageItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const recentCoverage = langGroup.get('recentCoverage') as FormArray;
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      mediaOutlets: this.fb.array(item?.mediaOutlets?.map(o => this.createMediaOutletGroup(o)) || [])
    });
    recentCoverage.push(group);
  }

  removeCoverageItem(index: number): void {
    this.recentCoverage.removeAt(index);
  }

  getCoverageMediaOutlets(index: number): FormArray {
    return this.recentCoverage.at(index).get('mediaOutlets') as FormArray;
  }

  createMediaOutletGroup(outlet?: { type: string; name: string }): FormGroup {
    return this.fb.group({
      type: [outlet?.type || '📺', Validators.required],
      name: [outlet?.name || '', Validators.required]
    });
  }

  addMediaOutlet(coverageIndex: number): void {
    this.getCoverageMediaOutlets(coverageIndex).push(this.createMediaOutletGroup());
  }

  removeMediaOutlet(coverageIndex: number, outletIndex: number): void {
    this.getCoverageMediaOutlets(coverageIndex).removeAt(outletIndex);
  }

  // Media Types FormArray methods
  get mediaTypes(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaTypes') as FormArray;
  }

  addMediaType(item?: MediaType, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaTypes = langGroup.get('mediaTypes') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🎤', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    mediaTypes.push(group);
  }

  removeMediaType(index: number): void {
    this.mediaTypes.removeAt(index);
  }

  getMediaTypeItems(index: number): FormArray {
    return this.mediaTypes.at(index).get('items') as FormArray;
  }

  addMediaTypeItem(index: number, value = ''): void {
    this.getMediaTypeItems(index).push(this.fb.control(value));
  }

  removeMediaTypeItem(typeIndex: number, itemIndex: number): void {
    this.getMediaTypeItems(typeIndex).removeAt(itemIndex);
  }

  // Press Releases FormArray methods
  get pressReleases(): FormArray {
    return this.getActiveLanguageFormGroup().get('pressReleases') as FormArray;
  }

  addPressRelease(item?: PressRelease, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const pressReleases = langGroup.get('pressReleases') as FormArray;
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      link: [item?.link || '']
    });
    pressReleases.push(group);
  }

  removePressRelease(index: number): void {
    this.pressReleases.removeAt(index);
  }

  // Media Kit FormArray methods
  get mediaKit(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaKit') as FormArray;
  }

  addMediaKitItem(item?: MediaKitItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaKit = langGroup.get('mediaKit') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📸', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      link: [item?.link || '']
    });
    mediaKit.push(group);
  }

  removeMediaKitItem(index: number): void {
    this.mediaKit.removeAt(index);
  }

  // Social Media FormArray methods
  get socialMedia(): FormArray {
    return this.getActiveLanguageFormGroup().get('socialMedia') as FormArray;
  }

  addSocialPlatform(item?: SocialPlatform, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const socialMedia = langGroup.get('socialMedia') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📘', Validators.required],
      name: [item?.name || '', Validators.required],
      handle: [item?.handle || '', Validators.required],
      link: [item?.link || '']
    });
    socialMedia.push(group);
  }

  removeSocialPlatform(index: number): void {
    this.socialMedia.removeAt(index);
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
    this.pageService.getPageBySlug('agence-medias').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: AgenceMediasContent = parsedContent;
              this.populateForm(content);
            } else {
              // Old format - migrate to new format
              const oldContent: AgenceMediasLanguageContent = parsedContent;
              const content: AgenceMediasContent = {
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

  private getEmptyLanguageContent(): AgenceMediasLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      mediaOverview: [],
      recentCoverage: [],
      mediaTypes: [],
      pressReleases: [],
      mediaKit: [],
      socialMedia: [],
      contactInfo: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'ANRSI dans les Médias',
      heroSubtitle: 'Actualités, publications et visibilité médiatique',
      introText: 'L\'Agence Nationale de la Recherche Scientifique et de l\'Innovation (ANRSI) maintient une présence active dans les médias pour promouvoir la recherche scientifique, l\'innovation technologique, et les initiatives de développement en Mauritanie.'
    });

    // Add default media overview items for French
    this.addMediaOverview({ 
      icon: '📺', 
      title: 'Médias Audiovisuels', 
      description: 'Interviews, reportages et émissions spéciales sur les chaînes de télévision et radios nationales et internationales.', 
      items: ['TVM (Télévision de Mauritanie)', 'Radio Mauritanie', 'Chaînes internationales', 'Podcasts scientifiques'] 
    }, 'fr');
    this.addMediaOverview({ 
      icon: '📰', 
      title: 'Presse Écrite', 
      description: 'Articles, tribunes et publications dans les journaux nationaux et internationaux.', 
      items: ['Le Calame', 'Horizons', 'Mauritanie News', 'Revues scientifiques'] 
    }, 'fr');
    this.addMediaOverview({ 
      icon: '🌐', 
      title: 'Médias Numériques', 
      description: 'Présence active sur les plateformes numériques et réseaux sociaux.', 
      items: ['Site web officiel', 'Réseaux sociaux', 'Newsletters', 'Webinaires'] 
    }, 'fr');

    // Add default media types for French
    this.addMediaType({ 
      icon: '🎤', 
      title: 'Interviews et Déclarations', 
      description: 'Interviews exclusives avec le Directeur Général et les experts de l\'ANRSI sur les enjeux scientifiques et technologiques.', 
      items: ['Interviews télévisées', 'Déclarations officielles', 'Points de presse', 'Conférences de presse'] 
    }, 'fr');
    this.addMediaType({ 
      icon: '📊', 
      title: 'Reportages et Documentaires', 
      description: 'Reportages approfondis sur les projets de recherche, les innovations technologiques et les initiatives de développement.', 
      items: ['Reportages terrain', 'Documentaires scientifiques', 'Émissions spéciales', 'Portraits d\'experts'] 
    }, 'fr');
    this.addMediaType({ 
      icon: '📝', 
      title: 'Articles et Publications', 
      description: 'Articles de fond, tribunes et publications dans les médias nationaux et internationaux.', 
      items: ['Articles d\'opinion', 'Tribunes libres', 'Publications scientifiques', 'Communiqués de presse'] 
    }, 'fr');
    this.addMediaType({ 
      icon: '🎥', 
      title: 'Contenu Multimédia', 
      description: 'Production de contenu vidéo, audio et interactif pour les plateformes numériques.', 
      items: ['Vidéos éducatives', 'Podcasts scientifiques', 'Webinaires', 'Contenu interactif'] 
    }, 'fr');

    // Add default media kit for French
    this.addMediaKitItem({ 
      icon: '📸', 
      title: 'Photos et Images', 
      description: 'Banque d\'images haute résolution des installations, équipements et événements de l\'ANRSI.', 
      link: '#' 
    }, 'fr');
    this.addMediaKitItem({ 
      icon: '🎥', 
      title: 'Vidéos et B-Roll', 
      description: 'Vidéos de présentation, interviews et séquences B-Roll pour les reportages télévisés.', 
      link: '#' 
    }, 'fr');
    this.addMediaKitItem({ 
      icon: '📄', 
      title: 'Documents et Fiches', 
      description: 'Fiches techniques, présentations et documents d\'information sur les programmes et projets.', 
      link: '#' 
    }, 'fr');
    this.addMediaKitItem({ 
      icon: '👥', 
      title: 'Contacts Presse', 
      description: 'Liste des contacts presse et experts disponibles pour interviews et commentaires.', 
      link: '#' 
    }, 'fr');

    // Add default social media for French
    this.addSocialPlatform({ icon: '📘', name: 'Facebook', handle: '@ANRSI.Mauritanie', link: '#' }, 'fr');
    this.addSocialPlatform({ icon: '🐦', name: 'Twitter', handle: '@ANRSI_MR', link: '#' }, 'fr');
    this.addSocialPlatform({ icon: '💼', name: 'LinkedIn', handle: 'ANRSI Mauritanie', link: '#' }, 'fr');
    this.addSocialPlatform({ icon: '📺', name: 'YouTube', handle: 'ANRSI Mauritanie', link: '#' }, 'fr');

    // Add default contact info for French
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email Presse', value: 'presse@anrsi.mr' }, 'fr');
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' }, 'fr');
    this.addContactItem({ icon: 'fas fa-user', label: 'Responsable Presse', value: 'Mme Fatima Mint Ahmed' }, 'fr');
    this.addContactItem({ icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 16h00' }, 'fr');
  }

  populateForm(content: AgenceMediasContent): void {
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
        const mediaOverview = langGroup.get('mediaOverview') as FormArray;
        const recentCoverage = langGroup.get('recentCoverage') as FormArray;
        const mediaTypes = langGroup.get('mediaTypes') as FormArray;
        const pressReleases = langGroup.get('pressReleases') as FormArray;
        const mediaKit = langGroup.get('mediaKit') as FormArray;
        const socialMedia = langGroup.get('socialMedia') as FormArray;
        const contactInfo = langGroup.get('contactInfo') as FormArray;
        while (mediaOverview.length) mediaOverview.removeAt(0);
        while (recentCoverage.length) recentCoverage.removeAt(0);
        while (mediaTypes.length) mediaTypes.removeAt(0);
        while (pressReleases.length) pressReleases.removeAt(0);
        while (mediaKit.length) mediaKit.removeAt(0);
        while (socialMedia.length) socialMedia.removeAt(0);
        while (contactInfo.length) contactInfo.removeAt(0);

        // Populate arrays
        langContent.mediaOverview?.forEach(item => this.addMediaOverview(item, lang));
        langContent.recentCoverage?.forEach(item => this.addCoverageItem(item, lang));
        langContent.mediaTypes?.forEach(item => this.addMediaType(item, lang));
        langContent.pressReleases?.forEach(item => this.addPressRelease(item, lang));
        langContent.mediaKit?.forEach(item => this.addMediaKitItem(item, lang));
        langContent.socialMedia?.forEach(item => this.addSocialPlatform(item, lang));
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
    const content: AgenceMediasContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'ANRSI dans les Médias';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'ANRSI dans les Médias',
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
        slug: 'agence-medias',
        title: 'ANRSI dans les Médias',
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

  private buildLanguageContent(langData: any): AgenceMediasLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      mediaOverview: (langData.mediaOverview || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        items: item.items || []
      })),
      recentCoverage: (langData.recentCoverage || []).map((item: any) => ({
        date: item.date,
        title: item.title,
        description: item.description,
        mediaOutlets: item.mediaOutlets || []
      })),
      mediaTypes: (langData.mediaTypes || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        items: item.items || []
      })),
      pressReleases: langData.pressReleases || [],
      mediaKit: langData.mediaKit || [],
      socialMedia: langData.socialMedia || [],
      contactInfo: langData.contactInfo || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Agence Médias',
        ar: 'تعديل صفحة وكالة الإعلام',
        en: 'Edit Media Agency Page'
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
      'mediaOverviewSection': {
        fr: 'Aperçu des Médias',
        ar: 'نظرة عامة على الإعلام',
        en: 'Media Overview'
      },
      'recentCoverageSection': {
        fr: 'Couverture Récente',
        ar: 'التغطية الأخيرة',
        en: 'Recent Coverage'
      },
      'mediaTypesSection': {
        fr: 'Types de Médias',
        ar: 'أنواع الإعلام',
        en: 'Media Types'
      },
      'pressReleasesSection': {
        fr: 'Communiqués de Presse',
        ar: 'البيانات الصحفية',
        en: 'Press Releases'
      },
      'mediaKitSection': {
        fr: 'Kit Médias',
        ar: 'مجموعة الإعلام',
        en: 'Media Kit'
      },
      'socialMediaSection': {
        fr: 'Réseaux Sociaux',
        ar: 'وسائل التواصل الاجتماعي',
        en: 'Social Media'
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
      'name': {
        fr: 'Nom *',
        ar: 'الاسم *',
        en: 'Name *'
      },
      'handle': {
        fr: 'Identifiant *',
        ar: 'المعرف *',
        en: 'Handle *'
      },
      'link': {
        fr: 'Lien',
        ar: 'رابط',
        en: 'Link'
      },
      'mediaOutlets': {
        fr: 'Organes de Presse',
        ar: 'وسائل الإعلام',
        en: 'Media Outlets'
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
      'addMediaOverview': {
        fr: 'Ajouter un élément d\'aperçu média',
        ar: 'إضافة عنصر نظرة عامة إعلامية',
        en: 'Add Media Overview Item'
      },
      'addCoverageItem': {
        fr: 'Ajouter un élément de couverture',
        ar: 'إضافة عنصر تغطية',
        en: 'Add Coverage Item'
      },
      'addMediaType': {
        fr: 'Ajouter un type de média',
        ar: 'إضافة نوع إعلام',
        en: 'Add Media Type'
      },
      'addPressRelease': {
        fr: 'Ajouter un communiqué de presse',
        ar: 'إضافة بيان صحفي',
        en: 'Add Press Release'
      },
      'addMediaKitItem': {
        fr: 'Ajouter un élément de kit média',
        ar: 'إضافة عنصر مجموعة إعلام',
        en: 'Add Media Kit Item'
      },
      'addSocialPlatform': {
        fr: 'Ajouter une plateforme sociale',
        ar: 'إضافة منصة اجتماعية',
        en: 'Add Social Platform'
      },
      'addContactItem': {
        fr: 'Ajouter un élément de contact',
        ar: 'إضافة عنصر اتصال',
        en: 'Add Contact Item'
      },
      'addItem': {
        fr: 'Ajouter un élément',
        ar: 'إضافة عنصر',
        en: 'Add Item'
      },
      'addOutlet': {
        fr: 'Ajouter un organe de presse',
        ar: 'إضافة وسيلة إعلام',
        en: 'Add Outlet'
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



