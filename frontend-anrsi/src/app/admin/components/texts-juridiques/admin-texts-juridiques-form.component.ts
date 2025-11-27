import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';

interface TextJuridique {
  title: string;
  description?: string;
  downloadUrl?: string;
}

interface TextsJuridiquesLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  texts: TextJuridique[];
}

interface TextsJuridiquesContent {
  translations: {
    fr: TextsJuridiquesLanguageContent;
    ar: TextsJuridiquesLanguageContent;
    en: TextsJuridiquesLanguageContent;
  };
}

@Component({
  selector: 'app-admin-texts-juridiques-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-texts-juridiques-form.component.html',
  styleUrls: ['./admin-texts-juridiques-form.component.scss']
})
export class AdminTextsJuridiquesFormComponent implements OnInit {
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
      texts: this.fb.array([])
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

  get texts(): FormArray {
    const langGroup = this.getActiveLanguageFormGroup();
    if (!langGroup) {
      return this.fb.array([]);
    }
    return langGroup.get('texts') as FormArray;
  }

  getTextsForLanguage(lang: string): FormArray {
    const langGroup = this.getLanguageFormGroup(lang);
    if (!langGroup) {
      return this.fb.array([]);
    }
    return langGroup.get('texts') as FormArray;
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

  addText(text?: TextJuridique): void {
    const group = this.fb.group({
      title: [text?.title || '', Validators.required],
      description: [text?.description || ''],
      downloadUrl: [text?.downloadUrl || '']
    });
    this.texts.push(group);
  }

  removeText(index: number): void {
    this.texts.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('texts-juridiques').subscribe({
      next: (page) => {
        console.log('Page loaded:', page);
        console.log('Page translations:', page.translations);
        console.log('Page content:', page.content);
        
        this.pageId = page.id || null;
        
        // Check if we have translations from the normalized structure
        let contentToUse: TextsJuridiquesContent | null = null;
        
        if (page.translations && Object.keys(page.translations).length > 0) {
          console.log('Found translations in normalized structure, reconstructing content...');
          // Reconstruct content from translations
          const reconstructedTranslations: any = {};
          
          ['fr', 'ar', 'en'].forEach(lang => {
            const translation = page.translations![lang];
            if (translation && translation.content) {
              try {
                const langContent = JSON.parse(translation.content);
                reconstructedTranslations[lang] = langContent;
                console.log(`Reconstructed ${lang} content from translation:`, langContent);
              } catch (e) {
                console.error(`Error parsing ${lang} translation content:`, e);
              }
            }
          });
          
          if (Object.keys(reconstructedTranslations).length > 0) {
            contentToUse = {
              translations: reconstructedTranslations
            };
            console.log('Reconstructed content from translations:', JSON.stringify(contentToUse, null, 2));
          }
        }
        
        // Fallback to main content field if translations don't exist
        if (!contentToUse && page.content) {
          try {
            const parsedContent: any = JSON.parse(page.content);
            if (parsedContent.translations) {
              contentToUse = parsedContent;
              console.log('Using main content field with translations structure');
            } else {
              // Old format - will be handled in populateForm
              contentToUse = parsedContent;
              console.log('Using old format from main content field');
            }
          } catch (e) {
            console.error('Error parsing main content:', e);
          }
        }
        
        if (contentToUse) {
          this.populateForm(contentToUse, page);
        } else {
          console.log('No content found, loading default data');
          this.loadDefaultData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
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
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      
      if (lang === 'fr') {
        langGroup.patchValue({
          heroTitle: 'Textes Juridiques',
          heroSubtitle: 'Textes juridiques régissant l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
          sectionTitle: 'Textes Juridiques'
        });
      } else if (lang === 'ar') {
        langGroup.patchValue({
          heroTitle: 'النصوص القانونية',
          heroSubtitle: 'النصوص القانونية التي تحكم الوكالة الوطنية للبحث العلمي والابتكار',
          sectionTitle: 'النصوص القانونية'
        });
      } else {
        langGroup.patchValue({
          heroTitle: 'Legal Texts',
          heroSubtitle: 'Legal texts governing the National Agency for Scientific Research and Innovation',
          sectionTitle: 'Legal Texts'
        });
      }

      // Clear existing array
      const textsArray = langGroup.get('texts') as FormArray;
      while (textsArray.length) textsArray.removeAt(0);
    });
  }

  populateForm(content: TextsJuridiquesContent | any, page: PageDTO): void {
    console.log('populateForm called with content:', JSON.stringify(content, null, 2));
    
    if (content.translations) {
      // New format with translations
      console.log('Loading new format with translations');
      ['fr', 'ar', 'en'].forEach(lang => {
        const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
        const langGroup = this.getLanguageFormGroup(lang);
        
        if (langContent) {
          console.log(`Populating ${lang} form group with:`, langContent);
          langGroup.patchValue({
            heroTitle: langContent.heroTitle || '',
            heroSubtitle: langContent.heroSubtitle || '',
            sectionTitle: langContent.sectionTitle || ''
          });

          // Clear existing array
          const textsArray = langGroup.get('texts') as FormArray;
          while (textsArray.length) textsArray.removeAt(0);

          // Populate array
          if (langContent.texts && langContent.texts.length > 0) {
            console.log(`Adding ${langContent.texts.length} texts to ${lang} array`);
            langContent.texts.forEach((text: TextJuridique) => {
              const group = this.fb.group({
                title: [text.title || '', Validators.required],
                description: [text.description || ''],
                downloadUrl: [text.downloadUrl || '']
              });
              textsArray.push(group);
            });
          }
        } else {
          console.log(`No content found for language ${lang}`);
        }
      });
    } else {
      // Old format - migrate to new format
      console.log('Loading old format, migrating to new format');
      const oldContent = content;
      const frGroup = this.getLanguageFormGroup('fr');
      frGroup.patchValue({
        heroTitle: oldContent.heroTitle || page.heroTitle || '',
        heroSubtitle: oldContent.heroSubtitle || page.heroSubtitle || '',
        sectionTitle: oldContent.sectionTitle || ''
      });
      const frTextsArray = frGroup.get('texts') as FormArray;
      while (frTextsArray.length) frTextsArray.removeAt(0);
      if (oldContent.texts && oldContent.texts.length > 0) {
        oldContent.texts.forEach((text: TextJuridique) => {
          const group = this.fb.group({
            title: [text.title || '', Validators.required],
            description: [text.description || ''],
            downloadUrl: [text.downloadUrl || '']
          });
          frTextsArray.push(group);
        });
      }
      // Initialize Arabic and English with default values
      ['ar', 'en'].forEach(lang => {
        const langGroup = this.getLanguageFormGroup(lang);
        if (lang === 'ar') {
          langGroup.patchValue({
            heroTitle: 'النصوص القانونية',
            heroSubtitle: 'النصوص القانونية التي تحكم الوكالة الوطنية للبحث العلمي والابتكار',
            sectionTitle: 'النصوص القانونية'
          });
        } else {
          langGroup.patchValue({
            heroTitle: 'Legal Texts',
            heroSubtitle: 'Legal texts governing the National Agency for Scientific Research and Innovation',
            sectionTitle: 'Legal Texts'
          });
        }
        const textsArray = langGroup.get('texts') as FormArray;
        while (textsArray.length) textsArray.removeAt(0);
        // Copy texts structure from French but leave titles empty for translation
        if (oldContent.texts && oldContent.texts.length > 0) {
          oldContent.texts.forEach((text: TextJuridique) => {
            const group = this.fb.group({
              title: [''],
              description: [''],
              downloadUrl: [text.downloadUrl || '']
            });
            textsArray.push(group);
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
    const textGroup = this.texts.at(index) as FormGroup;
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        const downloadUrl = response.url;
        
        // Update downloadUrl for the same index in ALL language tabs
        // since the document is shared across all translations
        ['fr', 'ar', 'en'].forEach(lang => {
          const langTextsArray = this.getTextsForLanguage(lang);
          if (langTextsArray && langTextsArray.length > index) {
            const langTextGroup = langTextsArray.at(index) as FormGroup;
            if (langTextGroup) {
              const downloadUrlControl = langTextGroup.get('downloadUrl');
              if (downloadUrlControl) {
                downloadUrlControl.setValue(downloadUrl, { emitEvent: true });
                downloadUrlControl.markAsDirty();
                downloadUrlControl.markAsTouched();
              }
            }
          } else if (langTextsArray) {
            // If the text doesn't exist in this language yet, create it with the downloadUrl
            const emptyGroup = this.fb.group({
              title: [''],
              description: [''],
              downloadUrl: [downloadUrl]
            });
            langTextsArray.push(emptyGroup);
          }
        });
        
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.error?.error || 'Erreur lors du téléchargement du fichier';
      }
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    this.errorMessage = '';

    const translationsToSave: any = {};
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      const langValue = langGroup.getRawValue();
      const textsArray = langGroup.get('texts') as FormArray;
      const textsValues = textsArray ? textsArray.getRawValue() : [];
      
      // Filter out empty texts
      const validTexts = textsValues.filter((text: any) => 
        text && text.title && typeof text.title === 'string' && text.title.trim().length > 0
      );
      
      translationsToSave[lang] = {
        heroTitle: (langValue.heroTitle || '').trim(),
        heroSubtitle: (langValue.heroSubtitle || '').trim(),
        sectionTitle: (langValue.sectionTitle || '').trim(),
        texts: validTexts
      };
    });

    const content: TextsJuridiquesContent = {
      translations: translationsToSave
    };

    // Use French title as default for page title
    const frGroup = this.getLanguageFormGroup('fr');
    const pageTitle = frGroup.get('heroTitle')?.value?.trim() || 'Textes Juridiques';
    const heroTitle = frGroup.get('heroTitle')?.value?.trim() || pageTitle;
    const heroSubtitle = frGroup.get('heroSubtitle')?.value?.trim() || '';

    const updateData: PageUpdateDTO = {
      title: pageTitle,
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
          this.errorMessage = 'Erreur lors de l\'enregistrement de la page';
          console.error('Error saving page:', error);
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'texts-juridiques',
        title: pageTitle,
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
          this.errorMessage = 'Erreur lors de la création de la page';
          console.error('Error creating page:', error);
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

