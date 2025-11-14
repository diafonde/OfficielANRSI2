import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface PlateformeItem {
  icon: string;
  title: string;
  description: string;
  equipments: string[];
  services: string[];
  contact: string;
}

interface AccessMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface BookingStep {
  number: number;
  title: string;
  description: string;
}

interface SupportItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface PlateformesLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  plateformes: PlateformeItem[];
  accessModes: AccessMode[];
  bookingSteps: BookingStep[];
  bookingRequirements: string[];
  supportItems: SupportItem[];
  contactInfo: ContactItem[];
}

interface PlateformesContent {
  translations: {
    fr: PlateformesLanguageContent;
    ar: PlateformesLanguageContent;
    en: PlateformesLanguageContent;
  };
}

@Component({
  selector: 'app-admin-plateformes-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-plateformes-form.component.html',
  styleUrls: ['./admin-plateformes-form.component.scss']
})
export class AdminPlateformesFormComponent implements OnInit {
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
      plateformes: this.fb.array([]),
      accessModes: this.fb.array([]),
      bookingSteps: this.fb.array([]),
      bookingRequirements: this.fb.array([]),
      supportItems: this.fb.array([]),
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

  // Plateformes FormArray methods
  get plateformes(): FormArray {
    return this.getActiveLanguageFormGroup().get('plateformes') as FormArray;
  }

  addPlateforme(item?: PlateformeItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const plateformes = langGroup.get('plateformes') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      equipments: this.fb.array(item?.equipments?.map(e => this.fb.control(e)) || []),
      services: this.fb.array(item?.services?.map(s => this.fb.control(s)) || []),
      contact: [item?.contact || '', Validators.required]
    });
    plateformes.push(group);
  }

  removePlateforme(index: number): void {
    this.plateformes.removeAt(index);
  }

  getPlateformeEquipments(index: number): FormArray {
    return this.plateformes.at(index).get('equipments') as FormArray;
  }

  addEquipment(plateformeIndex: number, value = ''): void {
    this.getPlateformeEquipments(plateformeIndex).push(this.fb.control(value));
  }

  removeEquipment(plateformeIndex: number, equipmentIndex: number): void {
    this.getPlateformeEquipments(plateformeIndex).removeAt(equipmentIndex);
  }

  getPlateformeServices(index: number): FormArray {
    return this.plateformes.at(index).get('services') as FormArray;
  }

  addService(plateformeIndex: number, value = ''): void {
    this.getPlateformeServices(plateformeIndex).push(this.fb.control(value));
  }

  removeService(plateformeIndex: number, serviceIndex: number): void {
    this.getPlateformeServices(plateformeIndex).removeAt(serviceIndex);
  }

  // Access Modes FormArray methods
  get accessModes(): FormArray {
    return this.getActiveLanguageFormGroup().get('accessModes') as FormArray;
  }

  addAccessMode(mode?: AccessMode, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const accessModes = langGroup.get('accessModes') as FormArray;
    const group = this.fb.group({
      icon: [mode?.icon || '🎓', Validators.required],
      title: [mode?.title || '', Validators.required],
      description: [mode?.description || '', Validators.required],
      items: this.fb.array(mode?.items?.map(i => this.fb.control(i)) || [])
    });
    accessModes.push(group);
  }

  removeAccessMode(index: number): void {
    this.accessModes.removeAt(index);
  }

  getAccessModeItems(index: number): FormArray {
    return this.accessModes.at(index).get('items') as FormArray;
  }

  addAccessModeItem(index: number, value = ''): void {
    this.getAccessModeItems(index).push(this.fb.control(value));
  }

  removeAccessModeItem(modeIndex: number, itemIndex: number): void {
    this.getAccessModeItems(modeIndex).removeAt(itemIndex);
  }

  // Booking Steps FormArray methods
  get bookingSteps(): FormArray {
    return this.getActiveLanguageFormGroup().get('bookingSteps') as FormArray;
  }

  addBookingStep(step?: BookingStep, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const bookingSteps = langGroup.get('bookingSteps') as FormArray;
    const group = this.fb.group({
      number: [step?.number || bookingSteps.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required]
    });
    bookingSteps.push(group);
  }

  removeBookingStep(index: number): void {
    this.bookingSteps.removeAt(index);
    // Renumber remaining steps
    this.bookingSteps.controls.forEach((control, i) => {
      control.patchValue({ number: i + 1 });
    });
  }

  // Booking Requirements FormArray methods
  get bookingRequirements(): FormArray {
    return this.getActiveLanguageFormGroup().get('bookingRequirements') as FormArray;
  }

  addBookingRequirement(value = '', lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const bookingRequirements = langGroup.get('bookingRequirements') as FormArray;
    bookingRequirements.push(this.fb.control(value));
  }

  removeBookingRequirement(index: number): void {
    this.bookingRequirements.removeAt(index);
  }

  // Support Items FormArray methods
  get supportItems(): FormArray {
    return this.getActiveLanguageFormGroup().get('supportItems') as FormArray;
  }

  addSupportItem(item?: SupportItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const supportItems = langGroup.get('supportItems') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📚', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    supportItems.push(group);
  }

  removeSupportItem(index: number): void {
    this.supportItems.removeAt(index);
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
    this.pageService.getPageBySlug('plateformes').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: PlateformesContent = parsedContent;
              this.populateForm(content);
            } else {
              // Old format - migrate to new format
              const oldContent: PlateformesLanguageContent = parsedContent;
              const content: PlateformesContent = {
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

  private getEmptyLanguageContent(): PlateformesLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      plateformes: [],
      accessModes: [],
      bookingSteps: [],
      bookingRequirements: [],
      supportItems: [],
      contactInfo: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Plateformes',
      heroSubtitle: 'Outils et technologies pour la recherche et l\'innovation',
      introText: 'L\'ANRSI met à disposition des chercheurs et innovateurs mauritaniens des plateformes technologiques de pointe pour soutenir leurs projets de recherche et d\'innovation.'
    });

    // Add default plateformes for French
    this.addPlateforme({
      icon: '🔬',
      title: 'Plateforme d\'Analyse Chimique',
      description: 'Laboratoire équipé d\'instruments de pointe pour l\'analyse chimique, spectroscopie, et caractérisation des matériaux.',
      equipments: ['Spectromètre de masse', 'Chromatographe en phase gazeuse', 'Diffractomètre RX', 'Microscope électronique'],
      services: ['Analyse de composition', 'Caractérisation de matériaux', 'Contrôle qualité', 'Formation technique'],
      contact: 'chimie@anrsi.mr'
    }, 'fr');
    this.addPlateforme({
      icon: '💻',
      title: 'Plateforme Informatique et Calcul',
      description: 'Infrastructure informatique haute performance pour le calcul scientifique, simulation numérique, et traitement de données.',
      equipments: ['Cluster de calcul haute performance', 'Serveurs de stockage massif', 'Réseau haute vitesse', 'Logiciels scientifiques'],
      services: ['Calcul parallèle', 'Simulation numérique', 'Analyse de données', 'Support technique'],
      contact: 'informatique@anrsi.mr'
    }, 'fr');
    this.addPlateforme({
      icon: '🌱',
      title: 'Plateforme Biotechnologique',
      description: 'Laboratoire spécialisé en biotechnologie pour la recherche en biologie moléculaire, génétique, et biologie végétale.',
      equipments: ['PCR en temps réel', 'Électrophorèse', 'Microscopes de fluorescence', 'Incubateurs contrôlés'],
      services: ['Analyse génétique', 'Culture cellulaire', 'Tests biologiques', 'Consultation scientifique'],
      contact: 'biotech@anrsi.mr'
    }, 'fr');
    this.addPlateforme({
      icon: '⚡',
      title: 'Plateforme Énergétique',
      description: 'Installation dédiée aux tests et développement de technologies énergétiques renouvelables et systèmes de stockage.',
      equipments: ['Simulateur solaire', 'Banc d\'essai éolien', 'Système de stockage batterie', 'Analyseur de puissance'],
      services: ['Tests de performance', 'Optimisation de systèmes', 'Études de faisabilité', 'Formation technique'],
      contact: 'energie@anrsi.mr'
    }, 'fr');
    this.addPlateforme({
      icon: '🌍',
      title: 'Plateforme Environnementale',
      description: 'Laboratoire d\'analyse environnementale pour l\'étude de la qualité de l\'air, de l\'eau, et des sols.',
      equipments: ['Analyseur de qualité d\'air', 'Spectromètre UV-Vis', 'pH-mètres de précision', 'Échantillonneurs automatiques'],
      services: ['Monitoring environnemental', 'Analyse de pollution', 'Études d\'impact', 'Consultation réglementaire'],
      contact: 'environnement@anrsi.mr'
    }, 'fr');
    this.addPlateforme({
      icon: '🏭',
      title: 'Plateforme de Prototypage',
      description: 'Atelier de fabrication numérique pour le prototypage rapide, impression 3D, et développement de produits.',
      equipments: ['Imprimantes 3D industrielles', 'Machine de découpe laser', 'Fraiseuse CNC', 'Scanner 3D'],
      services: ['Prototypage rapide', 'Design assisté par ordinateur', 'Fabrication sur mesure', 'Formation technique'],
      contact: 'prototypage@anrsi.mr'
    }, 'fr');

    // Add default access modes for French
    this.addAccessMode({
      icon: '🎓',
      title: 'Accès Académique',
      description: 'Tarifs préférentiels pour les universités et institutions de recherche publiques.',
      items: ['50% de réduction sur les tarifs standards', 'Formation gratuite incluse', 'Support technique prioritaire']
    }, 'fr');
    this.addAccessMode({
      icon: '🏢',
      title: 'Accès Industriel',
      description: 'Services complets pour les entreprises et startups innovantes.',
      items: ['Tarifs compétitifs', 'Confidentialité garantie', 'Rapports détaillés']
    }, 'fr');
    this.addAccessMode({
      icon: '🤝',
      title: 'Partenariats',
      description: 'Collaborations à long terme avec des institutions partenaires.',
      items: ['Accès privilégié', 'Co-développement de projets', 'Formation du personnel']
    }, 'fr');

    // Add default booking steps for French
    this.addBookingStep({ number: 1, title: 'Demande d\'Accès', description: 'Soumission d\'une demande détaillée avec description du projet et besoins techniques.' }, 'fr');
    this.addBookingStep({ number: 2, title: 'Évaluation Technique', description: 'Analyse de la faisabilité technique et évaluation des ressources nécessaires.' }, 'fr');
    this.addBookingStep({ number: 3, title: 'Formation', description: 'Formation obligatoire aux procédures de sécurité et d\'utilisation des équipements.' }, 'fr');
    this.addBookingStep({ number: 4, title: 'Réservation', description: 'Planification des créneaux d\'utilisation selon la disponibilité des équipements.' }, 'fr');
    this.addBookingStep({ number: 5, title: 'Utilisation', description: 'Accès aux plateformes avec support technique et supervision si nécessaire.' }, 'fr');

    // Add default booking requirements for French
    this.addBookingRequirement('Projet de recherche ou d\'innovation validé', 'fr');
    this.addBookingRequirement('Formation aux procédures de sécurité', 'fr');
    this.addBookingRequirement('Assurance responsabilité civile', 'fr');
    this.addBookingRequirement('Respect des règles d\'utilisation', 'fr');
    this.addBookingRequirement('Signature d\'un accord de confidentialité', 'fr');

    // Add default support items for French
    this.addSupportItem({ icon: '📚', title: 'Formation Technique', description: 'Formation complète sur l\'utilisation des équipements et les procédures de sécurité.' }, 'fr');
    this.addSupportItem({ icon: '🔧', title: 'Support Technique', description: 'Assistance technique pendant l\'utilisation des plateformes et maintenance préventive.' }, 'fr');
    this.addSupportItem({ icon: '📊', title: 'Analyse de Données', description: 'Support dans l\'analyse et l\'interprétation des résultats obtenus sur les plateformes.' }, 'fr');
    this.addSupportItem({ icon: '🤝', title: 'Consultation Scientifique', description: 'Conseil scientifique pour l\'optimisation des protocoles et l\'amélioration des résultats.' }, 'fr');

    // Add default contact info for French
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email Général', value: 'plateformes@anrsi.mr' }, 'fr');
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' }, 'fr');
    this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Adresse', value: 'ANRSI, Nouakchott, Mauritanie' }, 'fr');
    this.addContactItem({ icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 18h00' }, 'fr');
  }

  populateForm(content: PlateformesContent): void {
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
        const plateformes = langGroup.get('plateformes') as FormArray;
        const accessModes = langGroup.get('accessModes') as FormArray;
        const bookingSteps = langGroup.get('bookingSteps') as FormArray;
        const bookingRequirements = langGroup.get('bookingRequirements') as FormArray;
        const supportItems = langGroup.get('supportItems') as FormArray;
        const contactInfo = langGroup.get('contactInfo') as FormArray;
        while (plateformes.length) plateformes.removeAt(0);
        while (accessModes.length) accessModes.removeAt(0);
        while (bookingSteps.length) bookingSteps.removeAt(0);
        while (bookingRequirements.length) bookingRequirements.removeAt(0);
        while (supportItems.length) supportItems.removeAt(0);
        while (contactInfo.length) contactInfo.removeAt(0);

        // Populate arrays
        langContent.plateformes?.forEach(item => this.addPlateforme(item, lang));
        langContent.accessModes?.forEach(item => this.addAccessMode(item, lang));
        langContent.bookingSteps?.forEach(item => this.addBookingStep(item, lang));
        langContent.bookingRequirements?.forEach(item => this.addBookingRequirement(item, lang));
        langContent.supportItems?.forEach(item => this.addSupportItem(item, lang));
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
    const content: PlateformesContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Plateformes';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Plateformes',
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
        slug: 'plateformes',
        title: 'Plateformes',
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

  private buildLanguageContent(langData: any): PlateformesLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      plateformes: (langData.plateformes || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        equipments: item.equipments || [],
        services: item.services || [],
        contact: item.contact
      })),
      accessModes: (langData.accessModes || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        items: item.items || []
      })),
      bookingSteps: langData.bookingSteps || [],
      bookingRequirements: langData.bookingRequirements || [],
      supportItems: langData.supportItems || [],
      contactInfo: langData.contactInfo || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Plateformes',
        ar: 'تعديل صفحة المنصات',
        en: 'Edit Platforms Page'
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
      'plateformesSection': {
        fr: 'Plateformes',
        ar: 'المنصات',
        en: 'Platforms'
      },
      'accessModesSection': {
        fr: 'Modes d\'Accès',
        ar: 'طرق الوصول',
        en: 'Access Modes'
      },
      'bookingStepsSection': {
        fr: 'Étapes de Réservation',
        ar: 'خطوات الحجز',
        en: 'Booking Steps'
      },
      'bookingRequirementsSection': {
        fr: 'Exigences de Réservation',
        ar: 'متطلبات الحجز',
        en: 'Booking Requirements'
      },
      'supportItemsSection': {
        fr: 'Éléments de Support',
        ar: 'عناصر الدعم',
        en: 'Support Items'
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
      'equipments': {
        fr: 'Équipements',
        ar: 'المعدات',
        en: 'Equipments'
      },
      'services': {
        fr: 'Services',
        ar: 'الخدمات',
        en: 'Services'
      },
      'contact': {
        fr: 'Contact *',
        ar: 'الاتصال *',
        en: 'Contact *'
      },
      'items': {
        fr: 'Éléments',
        ar: 'العناصر',
        en: 'Items'
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
      'addPlateforme': {
        fr: 'Ajouter une plateforme',
        ar: 'إضافة منصة',
        en: 'Add Platform'
      },
      'addAccessMode': {
        fr: 'Ajouter un mode d\'accès',
        ar: 'إضافة طريقة وصول',
        en: 'Add Access Mode'
      },
      'addBookingStep': {
        fr: 'Ajouter une étape de réservation',
        ar: 'إضافة خطوة حجز',
        en: 'Add Booking Step'
      },
      'addBookingRequirement': {
        fr: 'Ajouter une exigence',
        ar: 'إضافة متطلب',
        en: 'Add Requirement'
      },
      'addSupportItem': {
        fr: 'Ajouter un élément de support',
        ar: 'إضافة عنصر دعم',
        en: 'Add Support Item'
      },
      'addContactItem': {
        fr: 'Ajouter un élément de contact',
        ar: 'إضافة عنصر اتصال',
        en: 'Add Contact Item'
      },
      'addEquipment': {
        fr: 'Ajouter un équipement',
        ar: 'إضافة معدات',
        en: 'Add Equipment'
      },
      'addService': {
        fr: 'Ajouter un service',
        ar: 'إضافة خدمة',
        en: 'Add Service'
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



