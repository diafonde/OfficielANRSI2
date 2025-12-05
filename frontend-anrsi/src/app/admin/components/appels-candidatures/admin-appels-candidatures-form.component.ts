import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';
import { AuthService } from '../../services/auth.service';

interface AppelItem {
  title: string;
  url: string;
  image: string | null;
  summary: string;
  date: string;
  full_text: string;
  documentUrls?: string[]; // Changed from documentUrl to documentUrls array
}

interface AppelsCandidaturesLanguageContent {
  appels: AppelItem[];
}

interface AppelsCandidaturesContent {
  translations: {
    fr: AppelsCandidaturesLanguageContent;
    ar: AppelsCandidaturesLanguageContent;
    en: AppelsCandidaturesLanguageContent;
  };
}

@Component({
  selector: 'app-admin-appels-candidatures-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-appels-candidatures-form.component.html',
  styleUrls: ['./admin-appels-candidatures-form.component.scss']
})
export class AdminAppelsCandidaturesFormComponent implements OnInit { 
  form: FormGroup;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;
  activeLanguage: 'fr' | 'ar' | 'en' = 'fr';
  documentUploadStates: { [key: string]: { isUploading: boolean; uploadProgress: number; fileName?: string } } = {};
  imageUploadStates: { [key: string]: { file?: File; preview?: string; isUploading: boolean; uploadProgress: number } } = {};
  isImporting = false;
  importProgress = 0;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;

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
    private http: HttpClient,
    private authService: AuthService,
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

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.pageId = +id;
        this.loadPage();
      } else {
        // Try to load by slug
        this.pageService.getPageBySlug('appels-candidatures').subscribe({
          next: (page: PageDTO) => {
            this.pageId = page.id || null;
            this.initializeForm(page);
          },
          error: (error: any) => this.handleError(error)
        });
      }
    });
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
      appels: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
      this.currentPage = 1; // Reset to first page when switching languages
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    return this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
  }

  getLanguageFormGroup(lang: string): FormGroup {
    return this.form.get(`translations.${lang}`) as FormGroup;
  }

  get appels(): FormArray {
    return this.getActiveLanguageFormGroup().get('appels') as FormArray;
  }

  getAppelsForLanguage(lang: string): FormArray {
    return this.getLanguageFormGroup(lang).get('appels') as FormArray;
  }

  // Pagination methods
  get paginatedAppels(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.appels.controls.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.appels.length / this.itemsPerPage);
  }

  get totalItems(): number {
    return this.appels.length;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of the appels list
      const element = document.querySelector('.appels-list-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value, 10);
    this.currentPage = 1; // Reset to first page when changing items per page
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (current <= 4) {
        // Near the start
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        // Near the end
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }
    
    return pages;
  }

  onPageNumberClick(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  hasTranslation(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    const appels = langGroup.get('appels') as FormArray;
    return appels.length > 0;
  }

  isLanguageFormValid(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    const appels = langGroup.get('appels') as FormArray;
    
    if (appels.length === 0) return false;
    
    return appels.controls.every(control => {
      const group = control as FormGroup;
      return group.get('title')?.valid && group.get('url')?.valid && group.get('date')?.valid;
    });
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || 'Français';
  }

  addAppel(): void {
    // Add new appel at the top (index 0) in ALL language tabs
    ['fr', 'ar', 'en'].forEach(lang => {
      const langAppelsArray = this.getAppelsForLanguage(lang);
      if (!langAppelsArray) {
        console.error(`Cannot add appel: appels FormArray is not available for language ${lang}`);
        return;
      }
      
      const appelGroup = this.fb.group({
        title: [''],
        url: [''],
        image: [''],
        summary: [''],
        date: [''],
        full_text: [''],
        documentUrls: this.fb.array([]) // Changed to FormArray
      });
      
      // Insert at the beginning (index 0) so the new item appears at the top
      langAppelsArray.insert(0, appelGroup);
    });
    
    // Navigate to the first page where the new item will be visible
    this.currentPage = 1;
    
    // Force change detection to update the UI
    this.cdr.detectChanges();
    
    // Scroll to the appels list container
    setTimeout(() => {
      const element = document.querySelector('.appels-list-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  removeAppel(index: number): void {
    this.appels.removeAt(index);
    
    // Adjust pagination if needed
    const totalAfterRemove = this.appels.length;
    const maxPageAfterRemove = Math.ceil(totalAfterRemove / this.itemsPerPage);
    
    // If current page is now empty, go to the last available page
    if (this.currentPage > maxPageAfterRemove && maxPageAfterRemove > 0) {
      this.currentPage = maxPageAfterRemove;
    }
    
    // If we're on the last page and it becomes empty, go to previous page
    if (this.currentPage > maxPageAfterRemove) {
      this.currentPage = Math.max(1, maxPageAfterRemove);
    }
  }

  loadPage(): void {
    this.isLoading = true;
    
    if (this.pageId) {
      // Load by ID if available
      this.pageService.getPageById(this.pageId).subscribe({
        next: (page: PageDTO) => {
          this.initializeForm(page);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.handleError(error);
          this.isLoading = false;
        }
      });
    } else {
      // Try to load by slug
      this.pageService.getPageBySlug('appels-candidatures').subscribe({
        next: (page: PageDTO) => {
          this.pageId = page.id || null;
          this.initializeForm(page);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.handleError(error);
          this.isLoading = false;
        }
      });
    }
  }

  initializeForm(page: PageDTO): void {
    console.log('Initializing form with page:', page);
    console.log('Page has translations:', !!page.translations);
    console.log('Page has content:', !!page.content);
    
    // First, check if we have valid data to load BEFORE clearing
    let hasDataToLoad = false;
    let translationsData: { [key: string]: any } = {};
    
    // Priority 1: Check page.translations (from page_translations table)
    if (page.translations && Object.keys(page.translations).length > 0) {
      console.log('Loading from page.translations (normalized structure)');
      ['fr', 'ar', 'en'].forEach(lang => {
        const translation = page.translations![lang];
        if (translation && translation.content) {
          try {
            const langContent = JSON.parse(translation.content);
            if (langContent && langContent.appels && langContent.appels.length > 0) {
              console.log(`Found ${langContent.appels.length} appels for ${lang} in translations`);
              translationsData[lang] = langContent;
              hasDataToLoad = true;
            }
          } catch (e) {
            console.error(`Error parsing ${lang} translation content:`, e);
          }
        }
      });
    }
    
    // Priority 2: Fallback to page.content (old format)
    if (!hasDataToLoad && page.content) {
      console.log('Loading from page.content (legacy format)');
      try {
        const parsedContent = JSON.parse(page.content);
        console.log('Parsed content structure:', {
          hasTranslations: !!parsedContent.translations,
          isArray: Array.isArray(parsedContent),
          keys: Object.keys(parsedContent)
        });
        
        // Check if it's the new format with translations
        if (parsedContent.translations) {
          const content: AppelsCandidaturesContent = parsedContent;
          ['fr', 'ar', 'en'].forEach(lang => {
            const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
            if (langContent && langContent.appels && langContent.appels.length > 0) {
              console.log(`Found ${langContent.appels.length} appels for ${lang} in content`);
              translationsData[lang] = langContent;
              hasDataToLoad = true;
            }
          });
        } else if (Array.isArray(parsedContent) && parsedContent.length > 0) {
          console.log(`Found ${parsedContent.length} appels in old format`);
          // Convert old format to new format structure
          translationsData['fr'] = { appels: parsedContent };
          hasDataToLoad = true;
        }
      } catch (e) {
        console.error('Error parsing content:', e);
        this.errorMessage = 'Erreur lors du chargement des données. Le format JSON est invalide.';
        return;
      }
    }

    // Only clear if we have valid data to load
    if (!hasDataToLoad) {
      console.log('No valid data to load, keeping existing form data');
      return;
    }
    
    // Clear existing appels for all languages
    ['fr', 'ar', 'en'].forEach(lang => {
      const langAppels = this.getAppelsForLanguage(lang);
      while (langAppels.length !== 0) {
        langAppels.removeAt(0);
      }
    });

    // Load data from translationsData
    try {
      ['fr', 'ar', 'en'].forEach(lang => {
        const langContent = translationsData[lang];
        if (langContent && langContent.appels) {
          console.log(`Loading ${lang} content:`, langContent);
          console.log(`Found ${langContent.appels.length} appels for ${lang}`);
          langContent.appels.forEach((appel: any) => {
            // Convert from public page format to admin form format
            const url = appel.actions && appel.actions.length > 0 
              ? appel.actions[0].url || '' 
              : appel.url || '';
            
            const date = appel.details && appel.details.length > 0
              ? appel.details.find((d: any) => d.label && d.label.toLowerCase().includes('date'))?.value || ''
              : appel.date || '';
            
            const appelGroup = this.fb.group({
              title: [appel.title || ''],
              url: [url],
              image: [appel.imageUrl || appel.image || ''],
              summary: [appel.summary || appel.description || ''],
              date: [date],
              full_text: [appel.fullText || appel.full_text || ''],
              documentUrls: this.fb.array(
                // Handle both old format (documentUrl) and new format (documentUrls)
                (appel.documentUrls || (appel.documentUrl ? [appel.documentUrl] : [])).map((docUrl: string) => 
                  this.fb.control(docUrl)
                )
              )
            });
            this.getAppelsForLanguage(lang).push(appelGroup);
          });
        } else {
          console.log(`No appels found for ${lang}`);
        }
      });
      
      // Log final state
      const counts = {
        fr: this.getAppelsForLanguage('fr').length,
        ar: this.getAppelsForLanguage('ar').length,
        en: this.getAppelsForLanguage('en').length
      };
      console.log('Form initialized. Appels count:', counts);
      
      // Switch to first language that has data
      if (this.appels.length === 0) {
        if (counts.fr > 0) {
          this.activeLanguage = 'fr';
          console.log('Switching to French tab (has data)');
        } else if (counts.ar > 0) {
          this.activeLanguage = 'ar';
            console.log('Switching to Arabic tab (has data)');
          } else if (counts.en > 0) {
            this.activeLanguage = 'en';
            console.log('Switching to English tab (has data)');
          }
        }
        
        // Force change detection
        this.cdr.detectChanges();
      } catch (e) {
        console.error('Error loading appels:', e);
        this.errorMessage = 'Erreur lors du chargement des données. Le format JSON est invalide.';
      }

    // If no appels loaded for any language, add one empty appel to French
    if (this.appels.length === 0 && 
        this.getAppelsForLanguage('fr').length === 0 && 
        this.getAppelsForLanguage('ar').length === 0 && 
        this.getAppelsForLanguage('en').length === 0) {
      console.log('No appels found in any language, adding empty appel');
      this.addAppel();
    }
    
    // Force change detection after initialization
    this.cdr.detectChanges();
  }

  onImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner uniquement des fichiers image';
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 10MB';
        return;
      }
      
      const key = `${this.activeLanguage}-appel-${index}`;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUploadStates[key] = {
          file: file,
          preview: e.target.result,
          isUploading: true,
          uploadProgress: 0
        };
      };
      reader.readAsDataURL(file);
      
      // Upload image
      this.uploadImage(file, index);
      
      // Reset file input
      input.value = '';
    }
  }

  uploadImage(file: File, index: number): void {
    const key = `${this.activeLanguage}-appel-${index}`;
    
    if (!this.imageUploadStates[key]) {
      this.imageUploadStates[key] = {
        file: file,
        preview: undefined,
        isUploading: true,
        uploadProgress: 0
      };
    } else {
      this.imageUploadStates[key].isUploading = true;
      this.imageUploadStates[key].uploadProgress = 0;
    }
    
    this.errorMessage = '';
    
    this.articleService.uploadImage(file).subscribe({
      next: (response) => {
        const appelGroup = this.appels.at(index) as FormGroup;
        appelGroup.patchValue({ image: response.url });
        this.imageUploadStates[key] = {
          file: file,
          preview: this.imageUploadStates[key]?.preview,
          isUploading: false,
          uploadProgress: 100
        };
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.errorMessage = 'Erreur lors du téléchargement de l\'image.';
        this.imageUploadStates[key] = {
          file: file,
          preview: this.imageUploadStates[key]?.preview,
          isUploading: false,
          uploadProgress: 0
        };
      }
    });
  }

  getImageUploadState(index: number): { file?: File; preview?: string; isUploading: boolean; uploadProgress: number } {
    const key = `${this.activeLanguage}-appel-${index}`;
    return this.imageUploadStates[key] || { isUploading: false, uploadProgress: 0 };
  }

  removeImage(index: number): void {
    const appelGroup = this.appels.at(index) as FormGroup;
    appelGroup.patchValue({ image: '' });
    const key = `${this.activeLanguage}-appel-${index}`;
    delete this.imageUploadStates[key];
  }

  // Document handling methods - similar to ai4agri
  getAppelDocuments(appelIndex: number): FormArray {
    const appelGroup = this.appels.at(appelIndex) as FormGroup;
    return appelGroup.get('documentUrls') as FormArray;
  }

  getAppelDocumentsForLanguage(lang: string, appelIndex: number): FormArray {
    const langAppelsArray = this.getAppelsForLanguage(lang);
    if (!langAppelsArray || langAppelsArray.length <= appelIndex) {
      return this.fb.array([]);
    }
    const appelGroup = langAppelsArray.at(appelIndex) as FormGroup;
    if (!appelGroup) {
      return this.fb.array([]);
    }
    return appelGroup.get('documentUrls') as FormArray;
  }

  addDocumentUrl(appelIndex: number, url: string = ''): void {
    const documentUrls = this.getAppelDocuments(appelIndex);
    documentUrls.push(this.fb.control(url));
  }

  removeDocumentUrl(appelIndex: number, documentIndex: number): void {
    const documentUrls = this.getAppelDocuments(appelIndex);
    documentUrls.removeAt(documentIndex);
  }

  getAppelDocumentUrl(appelIndex: number, documentIndex: number): string | null {
    const documentUrls = this.getAppelDocuments(appelIndex);
    if (!documentUrls || documentUrls.length <= documentIndex) {
      return null;
    }
    const control = documentUrls.at(documentIndex);
    return control ? control.value : null;
  }

  getDocumentUploadState(appelIndex: number, documentIndex: number): { isUploading: boolean; uploadProgress: number; fileName?: string } {
    const key = `${this.activeLanguage}-appel-${appelIndex}-doc-${documentIndex}`;
    return this.documentUploadStates[key] || { isUploading: false, uploadProgress: 0 };
  }

  onDocumentSelected(event: Event, appelIndex: number, documentIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const files = Array.from(input.files);
    const documentUrls = this.getAppelDocuments(appelIndex);
    const startIndex = documentUrls.length;
    
    files.forEach((file, fileIndex) => {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/vnd.ms-excel', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        this.errorMessage = 'Le fichier doit être un PDF, Word ou Excel';
        return;
      }
      
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 50MB';
        return;
      }
      
      // Determine document index
      let docIndex: number;
      if (documentIndex !== undefined && fileIndex === 0) {
        // Replacing existing document
        docIndex = documentIndex;
      } else {
        // Adding new document(s)
        docIndex = startIndex + fileIndex;
      }
      
      const key = `${this.activeLanguage}-appel-${appelIndex}-doc-${docIndex}`;
      
      this.documentUploadStates[key] = {
        isUploading: true,
        uploadProgress: 0,
        fileName: file.name
      };

      // Upload file
      this.uploadDocument(file, appelIndex, docIndex);
    });
    
    // Reset file input
    input.value = '';
  }

  uploadDocument(file: File, appelIndex: number, documentIndex: number): void {
    const key = `${this.activeLanguage}-appel-${appelIndex}-doc-${documentIndex}`;
    this.errorMessage = '';
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        const downloadUrl = response.url;
        
        // Update documentUrls for the same index in ALL language tabs
        // since the document is shared across all translations
        ['fr', 'ar', 'en'].forEach(lang => {
          const langGroup = this.getLanguageFormGroup(lang);
          const langAppelsArray = this.getAppelsForLanguage(lang);
          
          // Ensure the appel exists at this index
          while (langAppelsArray.length <= appelIndex) {
            this.addAppel();
          }
          
          // Get the documentUrls array for this language and appel
          const appelGroup = langAppelsArray.at(appelIndex) as FormGroup;
          const documentUrls = appelGroup.get('documentUrls') as FormArray;
          
          // Ensure the control exists at this index
          while (documentUrls.length <= documentIndex) {
            documentUrls.push(this.fb.control(''));
          }
          
          // Set the URL value and mark as dirty/touched
          const control = documentUrls.at(documentIndex);
          if (control) {
            control.setValue(downloadUrl, { emitEvent: true });
            control.markAsDirty();
            control.markAsTouched();
            control.updateValueAndValidity({ emitEvent: true });
          }
          
          // Update the FormArray to ensure changes are detected
          documentUrls.updateValueAndValidity({ emitEvent: true });
          
          // Update the appel FormGroup to ensure changes are detected
          appelGroup.updateValueAndValidity({ emitEvent: true });
        });
        
        // Update the language FormGroup to ensure changes propagate
        ['fr', 'ar', 'en'].forEach(lang => {
          const langGroup = this.getLanguageFormGroup(lang);
          if (langGroup) {
            langGroup.updateValueAndValidity({ emitEvent: true });
          }
        });
        
        // Update upload state for active language
        this.documentUploadStates[key] = {
          isUploading: false,
          uploadProgress: 100,
          fileName: file.name
        };
        
        this.errorMessage = '';
        
        // Force immediate change detection to update all tabs
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        
        // Also trigger change detection after a short delay to ensure UI updates in all tabs
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      },
      error: (error) => {
        console.error('Error uploading document:', error);
        
        let errorMsg = 'Erreur lors du téléchargement du document. ';
        if (error.status === 0) {
          errorMsg += 'Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution.';
        } else if (error.status === 401) {
          errorMsg += 'Authentification requise. Veuillez vous connecter.';
        } else if (error.status === 403) {
          errorMsg += 'Accès refusé. Vous devez être connecté avec un compte ADMIN ou EDITOR.';
        } else if (error.status === 413 || error.status === 400) {
          errorMsg = error.error?.error || error.error?.message || 'Le fichier est trop volumineux. Taille maximale: 50MB.';
        } else if (error.status === 400) {
          errorMsg += error.error?.error || 'Fichier invalide. Veuillez sélectionner un fichier PDF, DOC ou DOCX.';
        } else if (error.status >= 500) {
          errorMsg += 'Erreur serveur: ' + (error.error?.error || error.message || 'Veuillez réessayer plus tard.');
        } else {
          errorMsg += error.error?.error || error.error?.message || error.message || 'Veuillez réessayer.';
        }
        
        this.errorMessage = errorMsg;
        this.documentUploadStates[key] = {
          isUploading: false,
          uploadProgress: 0
        };
        this.cdr.markForCheck();
      }
    });
  }

  removeDocument(appelIndex: number, documentIndex: number): void {
    // Remove document from the same index in ALL language tabs
    // since the document is shared across all translations
    ['fr', 'ar', 'en'].forEach(lang => {
      const langAppelsArray = this.getAppelsForLanguage(lang);
      if (langAppelsArray && langAppelsArray.length > appelIndex) {
        const langAppelGroup = langAppelsArray.at(appelIndex) as FormGroup;
        if (langAppelGroup) {
          const documentUrls = langAppelGroup.get('documentUrls') as FormArray;
          if (documentUrls && documentUrls.length > documentIndex) {
            documentUrls.removeAt(documentIndex);
            documentUrls.updateValueAndValidity({ emitEvent: true });
          }
        }
        
        // Update the language FormGroup
        const langGroup = this.getLanguageFormGroup(lang);
        if (langGroup) {
          langGroup.updateValueAndValidity({ emitEvent: true });
        }
      }
    });
    
    // Clean up upload state for active language
    const key = `${this.activeLanguage}-appel-${appelIndex}-doc-${documentIndex}`;
    delete this.documentUploadStates[key];
    this.cdr.markForCheck();
  }

  getDocumentFileName(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  copyFromFrench(): void {
    const frAppels = this.getAppelsForLanguage('fr');
    const currentAppels = this.appels;
    
    // Clear current language appels
    while (currentAppels.length !== 0) {
      currentAppels.removeAt(0);
    }
    
    // Copy from French
    frAppels.controls.forEach(control => {
      const frGroup = control as FormGroup;
      const newGroup = this.fb.group({
        title: [frGroup.get('title')?.value || ''],
        url: [frGroup.get('url')?.value || ''],
        image: [frGroup.get('image')?.value || ''],
        summary: [frGroup.get('summary')?.value || ''],
        date: [frGroup.get('date')?.value || ''],
        full_text: [frGroup.get('full_text')?.value || ''],
        documentUrls: this.fb.array(
          (frGroup.get('documentUrls') as FormArray).controls.map(control => 
            this.fb.control(control.value)
          )
        )
      });
      currentAppels.push(newGroup);
    });
  }

  onSubmit(): void {
    // Allow saving even if form is incomplete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Helper function to convert admin form format to public page format
    const convertToPublicFormat = (appel: any, lang: string) => {
      // Truncate full_text to 250 chars for description
      const fullText = appel.full_text || '';
      const description = fullText.length > 250 ? fullText.substring(0, 250).trim() + '...' : fullText || appel.summary || '';
      
      // Build details array with date
      const details: any[] = [];
      if (appel.date) {
        details.push({
          label: lang === 'ar' ? 'التاريخ' : (lang === 'en' ? 'Date' : 'Date'),
          value: appel.date
        });
      }
      
      // Build actions array with URL
      const actions: any[] = [];
      if (appel.url) {
        actions.push({
          text: lang === 'fr' ? 'En savoir plus' : (lang === 'ar' ? 'المزيد' : 'Learn more'),
          url: appel.url,
          type: 'primary'
        });
      }
      
      // Handle both old format (documentUrl) and new format (documentUrls)
      const documentUrls = appel.documentUrls || (appel.documentUrl ? [appel.documentUrl] : []);
      
      return {
        status: 'active',
        title: appel.title,
        description: description,
        summary: appel.summary || undefined,  // ADD THIS BACK
        fullText: fullText || undefined,
        imageUrl: appel.image || undefined,
        documentUrls: documentUrls.length > 0 ? documentUrls : undefined, // Use array
        details: details,
        actions: actions
      };
    };
    
    const content: AppelsCandidaturesContent = {
      translations: {
        fr: {
          appels: formValue.translations.fr.appels.map((appel: any) => convertToPublicFormat(appel, 'fr'))
        },
        ar: {
          appels: formValue.translations.ar.appels.map((appel: any) => convertToPublicFormat(appel, 'ar'))
        },
        en: {
          appels: formValue.translations.en.appels.map((appel: any) => convertToPublicFormat(appel, 'en'))
        }
      }
    };

    // Build translations for the new structure
    const translations: { [key: string]: any } = {};
    
    if (content.translations) {
      (['fr', 'ar', 'en'] as const).forEach(lang => {
        const langContent = content.translations[lang];
        if (langContent) {
          const langContentJson = JSON.stringify(langContent);
          translations[lang] = {
            title: 'Appels à Candidatures',
            content: langContentJson, // Store the language-specific content in content field
            extra: langContentJson // Also store in extra for backward compatibility
          };
        }
      });
    }

    if (this.pageId) {
      // Update existing page
      const updateData: PageUpdateDTO = {
        translations: translations,
        pageType: 'STRUCTURED'
      };

      this.pageService.updatePage(this.pageId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/admin/pages']);
        },
        error: (error: any) => {
          this.errorMessage = error?.message || 'Erreur lors de la sauvegarde.';
          this.isSaving = false;
        }
      });
    } else {
      // Create new page
      const createData: PageCreateDTO = {
        slug: 'appels-candidatures',
        pageType: 'STRUCTURED',
        translations: translations
      };

      this.pageService.createPage(createData).subscribe({
        next: (page) => {
          this.pageId = page.id || null;
          this.router.navigate(['/admin/pages']);
        },
        error: (error: any) => {
          this.errorMessage = error?.message || 'Erreur lors de la création.';
          this.isSaving = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  handleError(error: any): void {
    this.errorMessage = error?.message || 'Une erreur est survenue lors du chargement de la page.';
    this.isLoading = false;
  }

  onJsonFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.name.endsWith('.json')) {
        this.errorMessage = 'Veuillez sélectionner un fichier JSON';
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 10MB';
        return;
      }
      
      this.importJsonFile(file);
      
      // Reset file input
      input.value = '';
    }
  }

  importJsonFile(file: File): void {
    this.isImporting = true;
    this.importProgress = 0;
    this.errorMessage = '';
    
    const formData = new FormData();
    formData.append('file', file);
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    
    this.http.post<{ success: boolean; message?: string; error?: string }>(
      '/api/admin/appels-candidatures/import',
      formData,
      { headers }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.importProgress = 100;
          // Reload the page data after successful import
          // Always reload by slug to ensure we get the latest data
          this.pageService.getPageBySlug('appels-candidatures').subscribe({
            next: (page: PageDTO) => {
              console.log('Page loaded after import:', page);
              console.log('Page content:', page.content);
              this.pageId = page.id || null;
              
              // Reset pagination
              this.currentPage = 1;
              
              // Clear any existing form data first
              ['fr', 'ar', 'en'].forEach(lang => {
                const langAppels = this.getAppelsForLanguage(lang);
                while (langAppels.length !== 0) {
                  langAppels.removeAt(0);
                }
              });
              
              // Initialize form with imported data
              this.initializeForm(page);
              
              // Verify data was loaded
              const counts = {
                fr: this.getAppelsForLanguage('fr').length,
                ar: this.getAppelsForLanguage('ar').length,
                en: this.getAppelsForLanguage('en').length
              };
              console.log('Appels loaded after import:', counts);
              
              this.isImporting = false;
              this.importProgress = 0;
              this.errorMessage = '';
              
              // Force change detection multiple times to ensure UI updates
              this.cdr.detectChanges();
              setTimeout(() => {
                this.cdr.detectChanges();
                if (counts.fr > 0 || counts.ar > 0 || counts.en > 0) {
                  alert(`Import réussi ! ${counts.fr + counts.ar + counts.en} appels chargés.`);
                } else {
                  alert('Import réussi mais aucun appel trouvé. Vérifiez le format du fichier.');
                }
              }, 100);
            },
            error: (error: any) => {
              console.error('Error loading page after import:', error);
              this.handleError(error);
              this.isImporting = false;
              this.importProgress = 0;
              // Still show success message since import worked
              alert('Import réussi ! Veuillez recharger la page pour voir les données.');
            }
          });
        } else {
          this.errorMessage = response.error || 'Erreur lors de l\'import';
          this.isImporting = false;
          this.importProgress = 0;
        }
      },
      error: (error) => {
        console.error('Error importing JSON file:', error);
        this.errorMessage = error?.error?.error || error?.message || 'Erreur lors de l\'import du fichier JSON';
        this.isImporting = false;
        this.importProgress = 0;
      }
    });
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Gérer les Appels à Candidatures',
        ar: 'إدارة دعوات التقديم',
        en: 'Manage Calls for Applications'
      },
      'cancel': {
        fr: 'Annuler',
        ar: 'إلغاء',
        en: 'Cancel'
      },
      'loading': {
        fr: 'Chargement...',
        ar: 'جار التحميل...',
        en: 'Loading...'
      },
      'addAppel': {
        fr: 'Ajouter un Appel',
        ar: 'إضافة دعوة',
        en: 'Add Call'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'حذف',
        en: 'Remove'
      },
      'saveChanges': {
        fr: 'Enregistrer',
        ar: 'حفظ',
        en: 'Save'
      },
      'saving': {
        fr: 'Sauvegarde...',
        ar: 'جار الحفظ...',
        en: 'Saving...'
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
      'importJson': {
        fr: 'Importer des fichiers JSON',
        ar: 'استيراد ملفات JSON',
        en: 'Import JSON Files'
      },
      'importing': {
        fr: 'Import en cours...',
        ar: 'جار الاستيراد...',
        en: 'Importing...'
      }
    };

    const langTranslations = translations[key];
    if (langTranslations) {
      return langTranslations[this.activeLanguage] || langTranslations.fr;
    }
    return key;
  }
}
