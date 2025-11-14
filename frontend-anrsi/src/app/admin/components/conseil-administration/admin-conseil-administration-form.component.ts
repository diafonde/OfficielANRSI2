import { Component, OnInit } from '@angular/core';
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
      introText: ['', Validators.required],
      boardMembers: this.fb.array([]),
      updateDate: ['', Validators.required]
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
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: ConseilAdministrationContent = parsedContent;
              this.populateForm(content);
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

        // Populate array
        langContent.boardMembers?.forEach(member => this.addBoardMember(member, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: ConseilAdministrationContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Conseil d\'Administration';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Conseil d\'Administration',
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
        slug: 'conseil-administration',
        title: 'Conseil d\'Administration',
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



