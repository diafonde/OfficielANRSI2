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

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Programmes';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Programmes',
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
        slug: 'programmes',
        title: 'Programmes',
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



