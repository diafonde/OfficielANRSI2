import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
      texts: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
      
      // Verify form data is available for the switched language
      const langGroup = this.getLanguageFormGroup(this.activeLanguage);
      if (langGroup) {
        const textsArray = langGroup.get('texts') as FormArray;
        const rawValues = textsArray?.getRawValue() || [];
        console.log(`Switched to ${this.activeLanguage} tab:`, {
          heroTitle: langGroup.get('heroTitle')?.value,
          heroSubtitle: langGroup.get('heroSubtitle')?.value,
          sectionTitle: langGroup.get('sectionTitle')?.value,
          textsCount: textsArray?.length || 0,
          texts: rawValues,
          firstTextTitle: rawValues[0]?.title || 'N/A',
          firstTextTitleLength: rawValues[0]?.title?.length || 0
        });
        
        // Ensure the form array is marked as touched/dirty so Angular recognizes it
        if (textsArray) {
          textsArray.markAsTouched();
          textsArray.updateValueAndValidity({ emitEvent: true });
        }
      }
      
      // Force change detection after switching - use markForCheck for better performance
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    return this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
  }

  getLanguageFormGroup(lang: string): FormGroup {
    const group = this.form.get(`translations.${lang}`) as FormGroup;
    if (!group) {
      console.error(`Form group not found for language: ${lang}`);
      console.error('Form structure:', this.form.value);
    }
    return group;
  }

  get texts(): FormArray {
    const langGroup = this.getActiveLanguageFormGroup();
    if (!langGroup) {
      console.error('Active language form group not found for:', this.activeLanguage);
      // Return empty array as fallback
      return this.fb.array([]);
    }
    const textsArray = langGroup.get('texts') as FormArray;
    if (!textsArray) {
      console.error('Texts array not found for language:', this.activeLanguage);
      return this.fb.array([]);
    }
    return textsArray;
  }
  
  getTextsForLanguage(lang: string): FormArray {
    const langGroup = this.getLanguageFormGroup(lang);
    if (!langGroup) {
      return this.fb.array([]);
    }
    return langGroup.get('texts') as FormArray;
  }

  addText(text?: TextJuridique): void {
    const group = this.fb.group({
      title: [text?.title || ''], // Removed required validator to allow saving incomplete forms
      description: [text?.description || ''],
      downloadUrl: [text?.downloadUrl || '']
    });
    this.texts.push(group);
  }

  removeText(index: number): void {
    this.texts.removeAt(index);
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
    this.pageService.getPageBySlug('texts-juridiques').subscribe({
      next: (page) => {
        console.log('Page loaded from backend:', page);
        console.log('Page content (raw):', page.content);
        console.log('Page translations:', page.translations);
        
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
            const parsedContent: TextsJuridiquesContent = JSON.parse(page.content);
            console.log('Using main content field, parsed content:', JSON.stringify(parsedContent, null, 2));
            contentToUse = parsedContent;
          } catch (e) {
            console.error('Error parsing main content:', e);
          }
        }
        
        if (contentToUse) {
          console.log('Final content to use:', JSON.stringify(contentToUse, null, 2));
          console.log('Has translations?', !!contentToUse.translations);
          if (contentToUse.translations) {
            console.log('Translations keys:', Object.keys(contentToUse.translations));
            console.log('Arabic translation exists?', !!contentToUse.translations.ar);
            if (contentToUse.translations.ar) {
              console.log('Arabic content:', JSON.stringify(contentToUse.translations.ar, null, 2));
              console.log('Arabic texts count:', contentToUse.translations.ar.texts?.length || 0);
              if (contentToUse.translations.ar.texts && contentToUse.translations.ar.texts.length > 0) {
                console.log('Arabic texts details:');
                contentToUse.translations.ar.texts.forEach((text, index) => {
                  console.log(`  Arabic text ${index}:`, {
                    title: text.title,
                    titleLength: text.title?.length || 0,
                    hasTitle: !!text.title && text.title.trim().length > 0,
                    description: text.description,
                    downloadUrl: text.downloadUrl
                  });
                });
              }
            }
            if (contentToUse.translations.en) {
              console.log('English content:', JSON.stringify(contentToUse.translations.en, null, 2));
              console.log('English texts count:', contentToUse.translations.en.texts?.length || 0);
            }
          }
          this.populateForm(contentToUse, page);
        } else {
          console.log('No content found, loading default data');
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

      // Add default texts only for French (can be translated later)
      if (lang === 'fr') {
        const defaultTexts = [
          { title: 'Décret n:2020-066/PM/M.E.S.R.S.T.I.C/M.F/ portant création d\'un établissement public à caractère administratif dénommé, Agence nationale de la recherche scientifique et de l\'innovation et fixant les régles de son organisation et de son fonctionnement', downloadUrl: '' },
          { title: 'Arrêté conjoint n:001102/MF/MESRSTIC fixant le nomenclature des recettes et dépenses et le montant pour chaque dépense du compte d\'affectation spéciale de la recherche scientifique et l\'innovation.', downloadUrl: '' },
          { title: 'Décret n: 2015-119 / PM/2015 fixant la composition et le fonctionnement du conseil national de l\'Enseignement Supérieur et de la recherche scientifique (CNESRS).', downloadUrl: '' },
          { title: 'Arrêté n:0316 / MESRS, fixant les régles d\'organisation des des sociétés savantes', downloadUrl: '' },
          { title: 'Décret n: 2020-070/PM portant modification de certaines dispositions du décret n:2006-126 portant statut des enseignants chercheurs universitaires et hospitalo-universitaires modifié par le décret n:2019-115/PM du 11 juin 2019', downloadUrl: '' },
          { title: 'Décret n:2017-093/PM/MESRS/CI/2017, portant création de ( l\'autorité mauritanienne d\'Assurance-qualité de l\'enseignement supérieur ) et fixant les régles de son organisation et fonctionnement .', downloadUrl: '' },
          { title: 'Arrêté n:0863/ portant création des écoles doctorales à L\'Université de nouakchott AL-Aasriya et fixant leur organisation et leurs régles de fonctionnement', downloadUrl: '' }
        ];
        defaultTexts.forEach(text => {
          const group = this.fb.group({
            title: [text.title], // Removed required validator to allow saving incomplete forms
            description: [''],
            downloadUrl: [text.downloadUrl]
          });
          textsArray.push(group);
        });
      }
    });
  }

  populateForm(content: TextsJuridiquesContent, page: PageDTO): void {
    console.log('populateForm called with content:', JSON.stringify(content, null, 2));
    console.log('Page data:', page);
    console.log('Form structure before population:', this.form.value);
    
    // Handle both old format (without translations) and new format (with translations)
    if (content.translations) {
      console.log('Loading new format with translations');
      console.log('Available translation keys:', Object.keys(content.translations));
      
      // New format with translations - load each language separately
      ['fr', 'ar', 'en'].forEach(lang => {
        const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
        const langGroup = this.getLanguageFormGroup(lang);
        
        if (!langGroup) {
          console.error(`Form group not found for language: ${lang}`);
          return;
        }
        
        console.log(`Loading language ${lang}:`, langContent);
        
        if (langContent) {
          console.log(`Populating ${lang} form group with:`, {
            heroTitle: langContent.heroTitle,
            heroSubtitle: langContent.heroSubtitle,
            sectionTitle: langContent.sectionTitle,
            textsCount: langContent.texts?.length || 0
          });
          
          // Load content for this language - use patchValue to update fields
          langGroup.patchValue({
            heroTitle: langContent.heroTitle || '',
            heroSubtitle: langContent.heroSubtitle || '',
            sectionTitle: langContent.sectionTitle || ''
          }, { emitEvent: true }); // Emit events to trigger change detection

          // Clear existing array first
          const textsArray = langGroup.get('texts') as FormArray;
          while (textsArray.length > 0) {
            textsArray.removeAt(0);
          }

          // Populate array for this language
          if (langContent.texts && langContent.texts.length > 0) {
            console.log(`Adding ${langContent.texts.length} texts to ${lang} array`);
            console.log(`Raw texts data for ${lang}:`, JSON.stringify(langContent.texts, null, 2));
            
            langContent.texts.forEach((text, index) => {
              // Log the raw text object to see exactly what we're getting
              console.log(`  Text ${index} for ${lang} (raw object):`, text);
              console.log(`  Text ${index} for ${lang} (stringified):`, JSON.stringify(text));
              console.log(`  Text ${index} for ${lang} (details):`, {
                title: text.title,
                titleType: typeof text.title,
                titleLength: text.title?.length || 0,
                titleIsEmpty: !text.title || text.title.trim().length === 0,
                description: text.description,
                downloadUrl: text.downloadUrl,
                fullObject: text
              });
              
              // Ensure title is not null/undefined - preserve the actual value
              const titleValue = (text.title !== null && text.title !== undefined) ? String(text.title) : '';
              const descriptionValue = (text.description !== null && text.description !== undefined) ? String(text.description || '') : '';
              const downloadUrlValue = (text.downloadUrl !== null && text.downloadUrl !== undefined) ? String(text.downloadUrl || '') : '';
              
              console.log(`  Creating form group for ${lang} text ${index}:`, {
                titleValue: titleValue,
                titleValueLength: titleValue.length,
                descriptionValue: descriptionValue,
                downloadUrlValue: downloadUrlValue
              });
              
              const group = this.fb.group({
                title: [titleValue], // Removed required validator to allow saving incomplete forms
                description: [descriptionValue],
                downloadUrl: [downloadUrlValue]
              });
              
              textsArray.push(group);
              
              // Verify immediately after adding
              const addedGroup = textsArray.at(textsArray.length - 1) as FormGroup;
              const addedTitle = addedGroup.get('title')?.value;
              console.log(`  Verified added group for ${lang} text ${index}:`, {
                title: addedTitle,
                titleType: typeof addedTitle,
                titleLength: addedTitle?.length || 0,
                description: addedGroup.get('description')?.value,
                downloadUrl: addedGroup.get('downloadUrl')?.value
              });
              
              // Double-check: if title is empty but we expected it, log a warning
              if (!titleValue && lang === 'ar') {
                console.warn(`  WARNING: Arabic text ${index} has empty title! Expected title from saved data.`);
              }
            });
            
            // Mark the form array as touched to ensure it's recognized
            textsArray.markAsTouched();
            textsArray.updateValueAndValidity();
            
            console.log(`${lang} texts array after population:`, textsArray.getRawValue());
            console.log(`${lang} texts array length:`, textsArray.length);
          } else {
            console.log(`No texts found for ${lang}`);
          }
          
          // Immediately verify the form was populated correctly
          const verifyGroup = this.getLanguageFormGroup(lang);
          const verifyTextsArray = verifyGroup.get('texts') as FormArray;
          console.log(`${lang} form group immediately after population:`, {
            heroTitle: verifyGroup.get('heroTitle')?.value,
            heroSubtitle: verifyGroup.get('heroSubtitle')?.value,
            sectionTitle: verifyGroup.get('sectionTitle')?.value,
            textsCount: verifyTextsArray?.length || 0,
            textsValues: verifyTextsArray?.getRawValue() || []
          });
        } else {
          console.log(`No content found for language ${lang}, initializing with empty values`);
          // Language not found in translations, initialize with empty/default values
          langGroup.patchValue({
            heroTitle: '',
            heroSubtitle: '',
            sectionTitle: ''
          }, { emitEvent: false });
          const textsArray = langGroup.get('texts') as FormArray;
          while (textsArray.length) textsArray.removeAt(0);
        }
      });
      
      // Final verification - log all form values after population
      console.log('Form structure after population:', JSON.stringify(this.form.value, null, 2));
      
      // Verify each language's form array
      ['fr', 'ar', 'en'].forEach(lang => {
        const langGroup = this.getLanguageFormGroup(lang);
        const textsArray = langGroup.get('texts') as FormArray;
        const rawValues = textsArray.getRawValue();
        console.log(`Final verification - ${lang} texts array:`, {
          length: textsArray.length,
          values: rawValues,
          firstTextTitle: rawValues[0]?.title || 'N/A',
          firstTextTitleLength: rawValues[0]?.title?.length || 0
        });
        
        // Mark the form array as dirty and touched to ensure Angular recognizes it
        textsArray.markAsDirty();
        textsArray.markAsTouched();
        textsArray.updateValueAndValidity({ emitEvent: true });
      });
      
      // Force change detection to ensure UI updates
      this.cdr.detectChanges();
      
      // After a short delay, verify the form is still populated and force another change detection
      setTimeout(() => {
        console.log('Form structure after 500ms delay:', JSON.stringify(this.form.value, null, 2));
        ['fr', 'ar', 'en'].forEach(lang => {
          const langGroup = this.getLanguageFormGroup(lang);
          const textsArray = langGroup.get('texts') as FormArray;
          const rawValues = textsArray.getRawValue();
          console.log(`Delayed verification - ${lang} texts array:`, {
            length: textsArray.length,
            values: rawValues,
            firstTextTitle: rawValues[0]?.title || 'N/A',
            firstTextTitleLength: rawValues[0]?.title?.length || 0
          });
        });
        
        // Force another change detection after delay
        this.cdr.detectChanges();
      }, 500);
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
      const frTextsArray = frGroup.get('texts') as FormArray;
      while (frTextsArray.length) frTextsArray.removeAt(0);
      if (oldContent.texts && oldContent.texts.length > 0) {
        oldContent.texts.forEach((text: TextJuridique) => {
          const group = this.fb.group({
            title: [text.title], // Removed required validator to allow saving incomplete forms
            description: [text.description || ''],
            downloadUrl: [text.downloadUrl || '']
          });
          frTextsArray.push(group);
        });
      }

      // Initialize Arabic and English with default/empty values
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
              title: [''], // Empty for translation - removed required validator to allow saving incomplete forms
              description: [''],
              downloadUrl: [text.downloadUrl || ''] // Keep same download URLs
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
    
    console.log('Uploading document:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        textGroup.patchValue({ downloadUrl: response.url });
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
    
    // First, ensure form is properly structured
    console.log('Form structure:', this.form.value);
    console.log('Form valid:', this.form.valid);
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      if (!langGroup) {
        console.error(`Language form group not found for: ${lang}`);
        console.error('Available form groups:', Object.keys(this.form.get('translations')?.value || {}));
        translationsToSave[lang] = {
          heroTitle: '',
          heroSubtitle: '',
          sectionTitle: '',
          texts: []
        };
        return;
      }
      
      // Get the raw form values for this language
      const langValue = langGroup.getRawValue();
      console.log(`Language ${lang} form values:`, JSON.stringify(langValue, null, 2));
      
      // Get texts array directly to ensure we have the latest values
      const textsArray = langGroup.get('texts') as FormArray;
      const textsValues = textsArray ? textsArray.getRawValue() : [];
      console.log(`Language ${lang} texts array values:`, JSON.stringify(textsValues, null, 2));
      
      // Filter out empty texts (texts without title)
      const validTexts = textsValues.filter((text: any) => 
        text && text.title && typeof text.title === 'string' && text.title.trim().length > 0
      );
      
      console.log(`Language ${lang} valid texts (after filter):`, JSON.stringify(validTexts, null, 2));
      
      // Always save all languages, even if empty
      translationsToSave[lang] = {
        heroTitle: (langValue.heroTitle || '').trim(),
        heroSubtitle: (langValue.heroSubtitle || '').trim(),
        sectionTitle: (langValue.sectionTitle || '').trim(),
        texts: validTexts
      };
    });
    
    console.log('All translations to save (final):', JSON.stringify(translationsToSave, null, 2));

    this.isSaving = true;
    this.errorMessage = '';

    const content: TextsJuridiquesContent = {
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
    pageTitle = pageTitle?.trim() || 'Textes Juridiques';
    
    // Ensure heroTitle and heroSubtitle are set (can be empty strings)
    if (!heroTitle) {
      heroTitle = pageTitle; // Use pageTitle as fallback
    }

    const updateData: PageUpdateDTO = {
      title: pageTitle,
      heroTitle: heroTitle,
      heroSubtitle: heroSubtitle,
      content: JSON.stringify(content),
      pageType: 'STRUCTURED',
      isPublished: true,
      isActive: true
    };

    console.log('Saving page with data:', {
      pageId: this.pageId,
      updateData: {
        ...updateData,
        content: content // Log parsed content, not stringified
      }
    });

    if (this.pageId) {
      this.pageService.updatePage(this.pageId, updateData).subscribe({
        next: (response) => {
          console.log('Page updated successfully:', response);
          console.log('Response content:', response.content);
          
          // Parse and log the saved content to verify it was saved correctly
          if (response.content) {
            try {
              const savedContent = JSON.parse(response.content);
              console.log('Saved content (parsed):', JSON.stringify(savedContent, null, 2));
              console.log('Arabic data in saved content:', savedContent.translations?.ar);
              console.log('English data in saved content:', savedContent.translations?.en);
            } catch (e) {
              console.error('Error parsing saved content:', e);
            }
          }
          
          this.isSaving = false;
          this.errorMessage = ''; // Clear any errors
          
          // Reload the page to verify the data was saved and can be loaded back
          console.log('Reloading page to verify saved data...');
          this.loadPage();
          
          // Optional: Show success message (you can add a success message component if needed)
          // For now, we'll just reload and let the user see the data
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
        slug: 'texts-juridiques',
        title: pageTitle,
        heroTitle: heroTitle,
        heroSubtitle: heroSubtitle,
        content: JSON.stringify(content),
        pageType: 'STRUCTURED',
        isPublished: true,
        isActive: true
      }).subscribe({
        next: (response) => {
          console.log('Page created successfully:', response);
          console.log('Response content:', response.content);
          
          // Parse and log the saved content to verify it was saved correctly
          if (response.content) {
            try {
              const savedContent = JSON.parse(response.content);
              console.log('Saved content (parsed):', JSON.stringify(savedContent, null, 2));
              console.log('Arabic data in saved content:', savedContent.translations?.ar);
              console.log('English data in saved content:', savedContent.translations?.en);
            } catch (e) {
              console.error('Error parsing saved content:', e);
            }
          }
          
          this.isSaving = false;
          this.errorMessage = ''; // Clear any errors
          
          // Set the pageId so we can reload
          this.pageId = response.id || null;
          
          // Reload the page to verify the data was saved and can be loaded back
          console.log('Reloading page to verify saved data...');
          this.loadPage();
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

