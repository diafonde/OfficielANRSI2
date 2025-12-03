import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';

interface Rapport {
  year: string;
  title: string;
  downloadUrl?: string;
}

interface RapportsLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  rapports: Rapport[];
}

interface RapportsContent {
  translations: {
    fr: RapportsLanguageContent;
    ar: RapportsLanguageContent;
    en: RapportsLanguageContent;
  };
}

@Component({
  selector: 'app-admin-rapports-annuels-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-rapports-annuels-form.component.html',
  styleUrls: ['./admin-rapports-annuels-form.component.scss']
})
export class AdminRapportsAnnuelsFormComponent implements OnInit {
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
    private articleService: ArticleAdminService,
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
      heroTitle: [''], // Removed required validator to allow saving incomplete forms
      heroSubtitle: [''], // Removed required validator to allow saving incomplete forms
      sectionTitle: [''], // Removed required validator to allow saving incomplete forms
      rapports: this.fb.array([])
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

  get rapports(): FormArray {
    return this.getActiveLanguageFormGroup().get('rapports') as FormArray;
  }

  getRapportsForLanguage(lang: string): FormArray {
    const langGroup = this.getLanguageFormGroup(lang);
    if (!langGroup) {
      return this.fb.array([]);
    }
    return langGroup.get('rapports') as FormArray;
  }

  addRapport(rapport?: Rapport): void {
    const group = this.fb.group({
      year: [rapport?.year || ''], // Removed required validator to allow saving incomplete forms
      title: [rapport?.title || ''], // Removed required validator to allow saving incomplete forms
      downloadUrl: [rapport?.downloadUrl || '']
    });
    this.rapports.push(group);
  }

  removeRapport(index: number): void {
    this.rapports.removeAt(index);
  }

  hasTranslation(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return !!(langGroup.get('heroTitle')?.value || langGroup.get('heroSubtitle')?.value);
  }

  isLanguageFormValid(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.valid;
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || 'Français';
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('rapports-annuels').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: RapportsContent = JSON.parse(page.content);
            this.populateForm(content, page);
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
          this.errorMessage = 'Erreur lors du chargement de la page';
        }
        this.isLoading = false;
      }
    });
  }

  loadDefaultData(): void {
    // Load default data for all languages
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      
      if (lang === 'fr') {
        langGroup.patchValue({
      heroTitle: 'Rapports Annuels',
      heroSubtitle: 'Rapports annuels de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Rapports Annuels'
    });
      } else if (lang === 'ar') {
        langGroup.patchValue({
          heroTitle: 'التقارير السنوية',
          heroSubtitle: 'التقارير السنوية للوكالة الوطنية للبحث العلمي والابتكار',
          sectionTitle: 'التقارير السنوية'
        });
      } else {
        langGroup.patchValue({
          heroTitle: 'Annual Reports',
          heroSubtitle: 'Annual reports of the National Agency for Scientific Research and Innovation',
          sectionTitle: 'Annual Reports'
        });
      }

    // Clear existing array
      const rapportsArray = langGroup.get('rapports') as FormArray;
      while (rapportsArray.length) rapportsArray.removeAt(0);

      // Add default rapports only for French (can be translated later)
      if (lang === 'fr') {
        const defaultRapports = [
          { year: '2023', title: 'Rapport 2023', downloadUrl: '' },
          { year: '2022', title: 'Rapport 2022', downloadUrl: '' }
        ];
        defaultRapports.forEach(rapport => {
          const group = this.fb.group({
            year: [rapport.year], // Removed required validator to allow saving incomplete forms
            title: [rapport.title], // Removed required validator to allow saving incomplete forms
            downloadUrl: [rapport.downloadUrl]
          });
          rapportsArray.push(group);
        });
      }
    });
  }

  populateForm(content: RapportsContent, page: PageDTO): void {
    // Handle both old format (without translations) and new format (with translations)
    if (content.translations) {
      // New format with translations - load each language separately
      ['fr', 'ar', 'en'].forEach(lang => {
        const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
        const langGroup = this.getLanguageFormGroup(lang);
        
        if (langContent) {
          // Load content for this language
          langGroup.patchValue({
            heroTitle: langContent.heroTitle || '',
            heroSubtitle: langContent.heroSubtitle || '',
            sectionTitle: langContent.sectionTitle || ''
    });

    // Clear existing array
          const rapportsArray = langGroup.get('rapports') as FormArray;
          while (rapportsArray.length) rapportsArray.removeAt(0);

          // Populate array for this language
          if (langContent.rapports && langContent.rapports.length > 0) {
            langContent.rapports.forEach(rapport => {
              const group = this.fb.group({
                year: [rapport.year], // Removed required validator to allow saving incomplete forms
                title: [rapport.title], // Removed required validator to allow saving incomplete forms
                downloadUrl: [rapport.downloadUrl || '']
              });
              rapportsArray.push(group);
            });
          }
        } else {
          // Language not found in translations, initialize with empty/default values
          langGroup.patchValue({
            heroTitle: '',
            heroSubtitle: '',
            sectionTitle: ''
          });
          const rapportsArray = langGroup.get('rapports') as FormArray;
          while (rapportsArray.length) rapportsArray.removeAt(0);
        }
      });
    } else {
      // Old format - migrate to new format
      // Only populate French with old content, leave Arabic and English empty for translation
      const oldContent = content as any;
      
      // Populate French with old content
      const frGroup = this.getLanguageFormGroup('fr');
      frGroup.patchValue({
        heroTitle: oldContent.heroTitle || page.heroTitle || '',
        heroSubtitle: oldContent.heroSubtitle || page.heroSubtitle || '',
        sectionTitle: oldContent.sectionTitle || ''
      });
      const frRapportsArray = frGroup.get('rapports') as FormArray;
      while (frRapportsArray.length) frRapportsArray.removeAt(0);
      if (oldContent.rapports && oldContent.rapports.length > 0) {
        oldContent.rapports.forEach((rapport: Rapport) => {
          const group = this.fb.group({
            year: [rapport.year], // Removed required validator to allow saving incomplete forms
            title: [rapport.title], // Removed required validator to allow saving incomplete forms
            downloadUrl: [rapport.downloadUrl || '']
          });
          frRapportsArray.push(group);
        });
      }

      // Initialize Arabic and English with default/empty values
      ['ar', 'en'].forEach(lang => {
        const langGroup = this.getLanguageFormGroup(lang);
        if (lang === 'ar') {
          langGroup.patchValue({
            heroTitle: 'التقارير السنوية',
            heroSubtitle: 'التقارير السنوية للوكالة الوطنية للبحث العلمي والابتكار',
            sectionTitle: 'التقارير السنوية'
          });
        } else {
          langGroup.patchValue({
            heroTitle: 'Annual Reports',
            heroSubtitle: 'Annual reports of the National Agency for Scientific Research and Innovation',
            sectionTitle: 'Annual Reports'
          });
        }
        const rapportsArray = langGroup.get('rapports') as FormArray;
        while (rapportsArray.length) rapportsArray.removeAt(0);
        // Copy rapports structure from French but leave titles empty for translation
        if (oldContent.rapports && oldContent.rapports.length > 0) {
          oldContent.rapports.forEach((rapport: Rapport) => {
            const group = this.fb.group({
              year: [rapport.year], // Keep same year - removed required validator to allow saving incomplete forms
              title: [''], // Empty for translation - removed required validator to allow saving incomplete forms
              downloadUrl: [rapport.downloadUrl || ''] // Keep same download URLs
            });
            rapportsArray.push(group);
          });
        }
      });
    }
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        this.errorMessage = 'Le fichier doit être un PDF ou un document Word';
        return;
      }
      
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 50MB';
        return;
      }
      
      // Upload file
      this.uploadDocument(file, index);
    }
  }

  uploadDocument(file: File, index: number): void {
    this.errorMessage = '';
    
    console.log('Uploading document:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      activeLanguage: this.activeLanguage,
      index: index
    });
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        const downloadUrl = response.url;
        console.log('Upload successful:', response);
        
        // Update downloadUrl for the same index in ALL language tabs
        // since the document is shared across all translations
        ['fr', 'ar', 'en'].forEach(lang => {
          const langRapportsArray = this.getRapportsForLanguage(lang);
          if (langRapportsArray && langRapportsArray.length > index) {
            const langRapportGroup = langRapportsArray.at(index) as FormGroup;
            if (langRapportGroup) {
              const downloadUrlControl = langRapportGroup.get('downloadUrl');
              if (downloadUrlControl) {
                downloadUrlControl.setValue(downloadUrl, { emitEvent: true });
                downloadUrlControl.markAsDirty();
                downloadUrlControl.markAsTouched();
              }
            }
          } else if (langRapportsArray) {
            // If the rapport doesn't exist in this language yet, create it with the downloadUrl
            const emptyGroup = this.fb.group({
              year: [''],
              title: [''],
              downloadUrl: [downloadUrl]
            });
            langRapportsArray.push(emptyGroup);
          }
        });
        
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Upload error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        
        let errorMsg = 'Erreur lors du téléchargement du fichier. ';
        if (error.status === 0) {
          errorMsg += 'Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution.';
        } else if (error.status === 401) {
          errorMsg += 'Authentification requise. Veuillez vous connecter.';
        } else if (error.status === 403) {
          errorMsg += 'Accès refusé. Vous devez être connecté avec un compte ADMIN ou EDITOR.';
        } else if (error.status === 413 || error.status === 400) {
          // Handle both 413 (Payload Too Large) and 400 (if backend returns 400 for size)
          errorMsg = error.error?.error || error.error?.message || 'Le fichier est trop volumineux. Taille maximale: 50MB.';
        } else if (error.status === 400) {
          errorMsg += error.error?.error || 'Fichier invalide. Veuillez sélectionner un fichier PDF, DOC ou DOCX.';
        } else if (error.status >= 500) {
          errorMsg += 'Erreur serveur: ' + (error.error?.error || error.message || 'Veuillez réessayer plus tard.');
        } else {
          errorMsg += error.error?.error || error.error?.message || error.message || 'Veuillez réessayer.';
        }
        this.errorMessage = errorMsg;
      }
    });
  }

  onSubmit(): void {
    // Always save all languages, even if incomplete or empty
    const translationsToSave: any = {};
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      const langValue = langGroup.getRawValue();
      const rapportsArray = langGroup.get('rapports') as FormArray;
      const rapportsValues = rapportsArray ? rapportsArray.getRawValue() : [];
      
      // Filter out empty rapports (rapports without title or year)
      const validRapports = rapportsValues.filter((rapport: any) => 
        rapport && rapport.title && typeof rapport.title === 'string' && rapport.title.trim().length > 0 
        && rapport.year && typeof rapport.year === 'string' && rapport.year.trim().length > 0
      );
      
      // Log for debugging
      console.log(`Saving ${lang} language:`, {
        rapportsCount: validRapports.length,
        rapports: validRapports.map((r: any) => ({
          year: r.year,
          title: r.title,
          downloadUrl: r.downloadUrl
        }))
      });
      
      // Always save all languages, even if empty
      translationsToSave[lang] = {
        heroTitle: (langValue.heroTitle || '').trim(),
        heroSubtitle: (langValue.heroSubtitle || '').trim(),
        sectionTitle: (langValue.sectionTitle || '').trim(),
        rapports: validRapports
      };
    });

    this.isSaving = true;
    this.errorMessage = '';
    
    const content: RapportsContent = {
      translations: translationsToSave
    };

    // Use French title as default for page title, fallback to first available language
    const frGroup = this.getLanguageFormGroup('fr');
    let pageTitle = frGroup.get('heroTitle')?.value?.trim();
    let heroTitle = frGroup.get('heroTitle')?.value?.trim() || '';
    let heroSubtitle = frGroup.get('heroSubtitle')?.value?.trim() || '';
    
    // If French is not available, use first available language
    if (!pageTitle && translationsToSave['ar']?.heroTitle?.trim()) {
      pageTitle = translationsToSave['ar'].heroTitle.trim();
      heroTitle = translationsToSave['ar'].heroTitle.trim();
      heroSubtitle = translationsToSave['ar'].heroSubtitle?.trim() || '';
    } else if (!pageTitle && translationsToSave['en']?.heroTitle?.trim()) {
      pageTitle = translationsToSave['en'].heroTitle.trim();
      heroTitle = translationsToSave['en'].heroTitle.trim();
      heroSubtitle = translationsToSave['en'].heroSubtitle?.trim() || '';
    }
    
    // Ensure pageTitle is never empty (backend requires non-blank title)
    pageTitle = pageTitle?.trim() || 'Rapports Annuels';
    
    // Ensure heroTitle and heroSubtitle are set (can be empty strings)
    if (!heroTitle) {
      heroTitle = pageTitle; // Use pageTitle as fallback
    }

    // Build translations for the new structure
    const translations: { [key: string]: any } = {};
    
    (['fr', 'ar', 'en'] as const).forEach(lang => {
      const langContent = translationsToSave[lang];
      if (langContent) {
        translations[lang] = {
          title: langContent.heroTitle || pageTitle,
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          sectionTitle: langContent.sectionTitle || '',
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

    console.log('Saving page with data:', {
      pageId: this.pageId,
      updateData: {
        ...updateData,
        translations: translations // Log translations
      }
    });

    if (this.pageId) {
      this.pageService.updatePage(this.pageId, updateData).subscribe({
        next: (response) => {
          console.log('Page updated successfully:', response);
          this.isSaving = false;
          this.router.navigate(['/admin/pages']);
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error saving page:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          
          let errorMsg = 'Erreur lors de l\'enregistrement de la page. ';
          if (error.status === 0) {
            errorMsg += 'Impossible de se connecter au serveur.';
          } else if (error.status === 400) {
            errorMsg += error.error?.message || error.error?.error || 'Données invalides.';
          } else if (error.status === 401) {
            errorMsg += 'Authentification requise.';
          } else if (error.status === 403) {
            errorMsg += 'Accès refusé.';
          } else if (error.status >= 500) {
            errorMsg += 'Erreur serveur. Veuillez réessayer plus tard.';
          } else {
            errorMsg += error.error?.message || error.error?.error || error.message || 'Veuillez réessayer.';
          }
          this.errorMessage = errorMsg;
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'rapports-annuels',
        pageType: 'STRUCTURED',
        translations: translations,
        isPublished: true,
        isActive: true
      }).subscribe({
        next: (response) => {
          console.log('Page created successfully:', response);
          this.isSaving = false;
          this.router.navigate(['/admin/pages']);
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error creating page:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          
          let errorMsg = 'Erreur lors de la création de la page. ';
          if (error.status === 0) {
            errorMsg += 'Impossible de se connecter au serveur.';
          } else if (error.status === 400) {
            errorMsg += error.error?.message || error.error?.error || 'Données invalides.';
          } else if (error.status === 401) {
            errorMsg += 'Authentification requise.';
          } else if (error.status === 403) {
            errorMsg += 'Accès refusé.';
          } else if (error.status >= 500) {
            errorMsg += 'Erreur serveur. Veuillez réessayer plus tard.';
          } else {
            errorMsg += error.error?.message || error.error?.error || error.message || 'Veuillez réessayer.';
          }
          this.errorMessage = errorMsg;
        }
      });
    }
  }


  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

