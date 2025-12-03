import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';

interface Ai4agriNewsItem {
  title: string;
  imageUrls?: string[];
  documentUrls?: string[]; // Array of document URLs (PDFs, DOC, etc.)
  description?: string;
  date?: string;
  url?: string;
}

interface Ai4agriLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  newsItems: Ai4agriNewsItem[];
}

interface Ai4agriContent {
  translations: {
    fr: Ai4agriLanguageContent;
    ar: Ai4agriLanguageContent;
    en: Ai4agriLanguageContent;
  };
}

@Component({
  selector: 'app-admin-ai4agri-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-ai4agri-form.component.html',
  styleUrls: ['./admin-ai4agri-form.component.scss']
})
export class AdminAi4agriFormComponent implements OnInit {
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
      heroTitle: ['', Validators.required],
      heroSubtitle: [''],
      newsItems: this.fb.array([])
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
    const newsItems = langGroup.get('newsItems') as FormArray;
    return langGroup.get('heroTitle')?.value || langGroup.get('heroSubtitle')?.value || newsItems.length > 0 || false;
  }

  isLanguageFormValid(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.valid;
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || 'Français';
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page AI 4 AGRI',
        ar: 'تعديل صفحة AI 4 AGRI',
        en: 'Edit AI 4 AGRI Page'
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
        fr: 'Sous-titre Hero',
        ar: 'العنوان الفرعي للبطل',
        en: 'Hero Subtitle'
      },
      'newsItems': {
        fr: 'Actualités AI 4 AGRI',
        ar: 'أخبار AI 4 AGRI',
        en: 'AI 4 AGRI News'
      },
      'addNewsItem': {
        fr: 'Ajouter une actualité',
        ar: 'إضافة خبر',
        en: 'Add News Item'
      },
      'date': {
        fr: 'Date',
        ar: 'التاريخ',
        en: 'Date'
      },
      'title': {
        fr: 'Titre *',
        ar: 'العنوان *',
        en: 'Title *'
      },
      'description': {
        fr: 'Description',
        ar: 'الوصف',
        en: 'Description'
      },
      'imageUrl': {
        fr: 'URL de l\'image',
        ar: 'رابط الصورة',
        en: 'Image URL'
      },
      'url': {
        fr: 'URL du lien "En savoir plus"',
        ar: 'رابط "المزيد"',
        en: 'Learn More URL'
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

  // NewsItems FormArray methods
  get newsItems(): FormArray {
    return this.getActiveLanguageFormGroup().get('newsItems') as FormArray;
  }

  addNewsItem(item?: Ai4agriNewsItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const newsItems = langGroup.get('newsItems') as FormArray;
    const imageUrlsArray = this.fb.array(
      (item?.imageUrls || []).map(url => this.fb.control(url))
    );
    const documentUrlsArray = this.fb.array(
      (item?.documentUrls || []).map(url => this.fb.control(url))
    );
    const group = this.fb.group({
      title: [item?.title || '', Validators.required],
      imageUrls: imageUrlsArray,
      documentUrls: documentUrlsArray,
      description: [item?.description || ''],
      date: [item?.date || ''],
      url: [item?.url || '']
    });
    newsItems.push(group);
  }

  removeNewsItem(index: number): void {
    this.newsItems.removeAt(index);
    // Clean up all image upload states for this news item
    const baseKey = `${this.activeLanguage}-${index}-`;
    for (const key of this.imageUploadState.keys()) {
      if (key.startsWith(baseKey)) {
        this.imageUploadState.delete(key);
      }
    }
    // Clean up all document upload states for this news item
    for (const key of this.documentUploadState.keys()) {
      if (key.startsWith(baseKey)) {
        this.documentUploadState.delete(key);
      }
    }
  }

  // Image upload state tracking - now supports multiple images per news item
  private imageUploadState = new Map<string, {
    file?: File;
    preview?: string;
    isUploading?: boolean;
    uploadProgress?: number;
  }>();

  // Document upload state tracking - supports multiple documents per news item
  private documentUploadState = new Map<string, {
    file?: File;
    isUploading?: boolean;
    uploadProgress?: number;
  }>();

  getImageUploadState(newsItemIndex: number, imageIndex: number): {
    file?: File;
    preview?: string;
    isUploading?: boolean;
    uploadProgress?: number;
  } {
    const stateKey = `${this.activeLanguage}-${newsItemIndex}-${imageIndex}`;
    return this.imageUploadState.get(stateKey) || {};
  }

  getNewsItemImages(newsItemIndex: number): FormArray {
    const newsItemGroup = this.newsItems.at(newsItemIndex) as FormGroup;
    return newsItemGroup.get('imageUrls') as FormArray;
  }

  addImageUrl(newsItemIndex: number, url: string = ''): void {
    const imageUrls = this.getNewsItemImages(newsItemIndex);
    imageUrls.push(this.fb.control(url));
  }

  removeImageUrl(newsItemIndex: number, imageIndex: number): void {
    const imageUrls = this.getNewsItemImages(newsItemIndex);
    imageUrls.removeAt(imageIndex);
    
    // Clean up upload state
    const stateKey = `${this.activeLanguage}-${newsItemIndex}-${imageIndex}`;
    this.imageUploadState.delete(stateKey);
    
    // Reindex remaining states
    this.reindexImageStates(newsItemIndex, imageIndex);
  }

  private reindexImageStates(newsItemIndex: number, removedIndex: number): void {
    const baseKey = `${this.activeLanguage}-${newsItemIndex}-`;
    const statesToReindex: Array<{oldKey: string, state: any}> = [];
    
    for (const [key, state] of this.imageUploadState.entries()) {
      if (key.startsWith(baseKey)) {
        const imageIndex = parseInt(key.split('-').pop() || '0');
        if (imageIndex > removedIndex) {
          statesToReindex.push({oldKey: key, state});
        }
      }
    }
    
    // Delete old keys and add with new indices
    statesToReindex.forEach(({oldKey, state}) => {
      this.imageUploadState.delete(oldKey);
      const newIndex = parseInt(oldKey.split('-').pop() || '0') - 1;
      const newKey = `${baseKey}${newIndex}`;
      this.imageUploadState.set(newKey, state);
    });
  }

  onImageSelected(event: Event, newsItemIndex: number, imageIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Clear previous errors
      this.errorMessage = '';
      
      // Get starting index
      const imageUrls = this.getNewsItemImages(newsItemIndex);
      let startIndex = imageIndex !== undefined ? imageIndex : imageUrls.length;
      
      // Pre-create all needed image slots for new images
      if (imageIndex === undefined) {
        // Adding new images - ensure we have enough slots
        const neededSlots = files.length;
        const currentLength = imageUrls.length;
        for (let i = 0; i < neededSlots; i++) {
          if (currentLength + i >= imageUrls.length) {
            this.addImageUrl(newsItemIndex, '');
          }
        }
      }
      
      files.forEach((file, fileIndex) => {
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
        
        // Determine image index
        let imgIndex: number;
        if (imageIndex !== undefined && fileIndex === 0) {
          // Replacing existing image
          imgIndex = imageIndex;
        } else {
          // Adding new image(s)
          imgIndex = startIndex + fileIndex;
        }
        
        const stateKey = `${this.activeLanguage}-${newsItemIndex}-${imgIndex}`;
        
        // Update state
        this.imageUploadState.set(stateKey, {
          file: file,
          preview: undefined,
          isUploading: false,
          uploadProgress: 0
        });
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const state = this.imageUploadState.get(stateKey);
          if (state) {
            state.preview = e.target.result;
            this.imageUploadState.set(stateKey, state);
          }
        };
        reader.readAsDataURL(file);
        
        // Upload file
        this.uploadImage(file, newsItemIndex, imgIndex);
      });
      
      // Reset file input
      input.value = '';
    }
  }

  uploadImage(file: File, newsItemIndex: number, imageIndex: number): void {
    const stateKey = `${this.activeLanguage}-${newsItemIndex}-${imageIndex}`;
    const state = this.imageUploadState.get(stateKey);
    if (!state) return;
    
    state.isUploading = true;
    state.uploadProgress = 0;
    this.imageUploadState.set(stateKey, state);
    this.errorMessage = '';
    
    this.articleService.uploadImage(file).subscribe({
      next: (response) => {
        const imageUrls = this.getNewsItemImages(newsItemIndex);
        
        // Ensure the control exists at this index
        while (imageUrls.length <= imageIndex) {
          imageUrls.push(this.fb.control(''));
        }
        
        // Set the URL value and mark as dirty/touched
        const control = imageUrls.at(imageIndex);
        if (control) {
          control.setValue(response.url, { emitEvent: true });
          control.markAsDirty();
          control.markAsTouched();
          control.updateValueAndValidity({ emitEvent: true });
          
          // Also update the FormArray to ensure changes are detected
          imageUrls.updateValueAndValidity({ emitEvent: true });
          
          console.log(`Image uploaded and saved to form at index ${imageIndex}:`, response.url);
          console.log(`FormArray length: ${imageUrls.length}, Value:`, imageUrls.value);
        } else {
          console.error(`Failed to set image URL at index ${imageIndex}`);
        }
        
        state.isUploading = false;
        state.uploadProgress = 100;
        state.file = undefined; // Clear file after successful upload
        this.imageUploadState.set(stateKey, state);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Upload error:', error);
        state.isUploading = false;
        state.uploadProgress = 0;
        this.imageUploadState.set(stateKey, state);
        this.errorMessage = error.error?.error || 'Erreur lors du téléchargement de l\'image';
      }
    });
  }

  removeImage(newsItemIndex: number, imageIndex: number): void {
    this.removeImageUrl(newsItemIndex, imageIndex);
  }

  getNewsItemImageUrl(newsItemIndex: number, imageIndex: number): string | null {
    const imageUrls = this.getNewsItemImages(newsItemIndex);
    return imageUrls.at(imageIndex)?.value || null;
  }

  // Document handling methods
  getNewsItemDocuments(newsItemIndex: number): FormArray {
    const newsItemGroup = this.newsItems.at(newsItemIndex) as FormGroup;
    return newsItemGroup.get('documentUrls') as FormArray;
  }

  addDocumentUrl(newsItemIndex: number, url: string = ''): void {
    const documentUrls = this.getNewsItemDocuments(newsItemIndex);
    documentUrls.push(this.fb.control(url));
  }

  removeDocumentUrl(newsItemIndex: number, documentIndex: number): void {
    const documentUrls = this.getNewsItemDocuments(newsItemIndex);
    documentUrls.removeAt(documentIndex);
    
    // Clean up upload state
    const stateKey = `${this.activeLanguage}-${newsItemIndex}-${documentIndex}`;
    this.documentUploadState.delete(stateKey);
    
    // Reindex remaining states
    this.reindexDocumentStates(newsItemIndex, documentIndex);
  }

  reindexDocumentStates(newsItemIndex: number, removedIndex: number): void {
    const baseKey = `${this.activeLanguage}-${newsItemIndex}-`;
    const newStates = new Map<string, any>();
    
    for (const [key, value] of this.documentUploadState.entries()) {
      if (key.startsWith(baseKey)) {
        const parts = key.split('-');
        const oldIndex = parseInt(parts[parts.length - 1]);
        if (oldIndex > removedIndex) {
          const newIndex = oldIndex - 1;
          const newKey = `${baseKey}${newIndex}`;
          newStates.set(newKey, value);
        } else if (oldIndex < removedIndex) {
          newStates.set(key, value);
        }
        // Skip the removed index
      } else {
        newStates.set(key, value);
      }
    }
    
    this.documentUploadState = newStates;
  }

  getDocumentUploadState(newsItemIndex: number, documentIndex: number): {
    file?: File;
    isUploading?: boolean;
    uploadProgress?: number;
  } {
    const stateKey = `${this.activeLanguage}-${newsItemIndex}-${documentIndex}`;
    return this.documentUploadState.get(stateKey) || {};
  }

  getNewsItemDocumentUrl(newsItemIndex: number, documentIndex: number): string | null {
    const documentUrls = this.getNewsItemDocuments(newsItemIndex);
    return documentUrls.at(documentIndex)?.value || null;
  }

  onDocumentSelected(event: Event, newsItemIndex: number, documentIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const files = Array.from(input.files);
    const documentUrls = this.getNewsItemDocuments(newsItemIndex);
    const startIndex = documentUrls.length;
    
    files.forEach((file, fileIndex) => {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|xls|xlsx)$/i)) {
        this.errorMessage = `Type de fichier non supporté: ${file.name}. Formats acceptés: PDF, DOC, DOCX, XLS, XLSX`;
        return;
      }
      
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        this.errorMessage = `Fichier trop volumineux: ${file.name}. Taille maximale: 50MB`;
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
      
      const stateKey = `${this.activeLanguage}-${newsItemIndex}-${docIndex}`;
      
      // Update state
      this.documentUploadState.set(stateKey, {
        file: file,
        isUploading: false,
        uploadProgress: 0
      });
      
      // Upload file
      this.uploadDocument(file, newsItemIndex, docIndex);
    });
    
    // Reset file input
    input.value = '';
  }

  uploadDocument(file: File, newsItemIndex: number, documentIndex: number): void {
    const stateKey = `${this.activeLanguage}-${newsItemIndex}-${documentIndex}`;
    const state = this.documentUploadState.get(stateKey);
    if (!state) return;
    
    state.isUploading = true;
    state.uploadProgress = 0;
    this.documentUploadState.set(stateKey, state);
    this.errorMessage = '';
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (state.uploadProgress! < 90) {
        state.uploadProgress = (state.uploadProgress || 0) + 10;
        this.documentUploadState.set(stateKey, state);
      }
    }, 200);
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        const documentUrls = this.getNewsItemDocuments(newsItemIndex);
        
        // Ensure the control exists at this index
        while (documentUrls.length <= documentIndex) {
          documentUrls.push(this.fb.control(''));
        }
        
        // Set the URL value and mark as dirty/touched
        const control = documentUrls.at(documentIndex);
        if (control) {
          control.setValue(response.url, { emitEvent: true });
          control.markAsDirty();
          control.markAsTouched();
          control.updateValueAndValidity({ emitEvent: true });
          
          // Also update the FormArray to ensure changes are detected
          documentUrls.updateValueAndValidity({ emitEvent: true });
          
          console.log(`Document uploaded and saved to form at index ${documentIndex}:`, response.url);
        }
        
        state.isUploading = false;
        state.uploadProgress = 100;
        state.file = undefined; // Clear file after successful upload
        this.documentUploadState.set(stateKey, state);
        this.errorMessage = '';
      },
      error: (error) => {
        clearInterval(progressInterval);
        console.error('Document upload error:', error);
        state.isUploading = false;
        state.uploadProgress = 0;
        this.documentUploadState.set(stateKey, state);
        this.errorMessage = error.error?.error || 'Erreur lors du téléchargement du document';
      }
    });
  }

  removeDocument(newsItemIndex: number, documentIndex: number): void {
    this.removeDocumentUrl(newsItemIndex, documentIndex);
  }

  getDocumentFileName(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  getImageUrlControl(newsItemIndex: number, imageIndex: number): any {
    const imageUrls = this.getNewsItemImages(newsItemIndex);
    return imageUrls.at(imageIndex);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('ai4agri').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        
        // First, try to get from page.translations (new system) - matches how page component reads
        if (page.translations && Object.keys(page.translations).length > 0) {
          try {
            const content: Ai4agriContent = {
              translations: {
                fr: this.getEmptyLanguageContent(),
                ar: this.getEmptyLanguageContent(),
                en: this.getEmptyLanguageContent()
              }
            };
            
            // Extract content from each translation
            ['fr', 'ar', 'en'].forEach(lang => {
              const translation = page.translations?.[lang];
              if (translation && translation.content) {
                try {
                  const parsedContent = JSON.parse(translation.content);
                  content.translations[lang as 'fr' | 'ar' | 'en'] = parsedContent;
                } catch (e) {
                  console.error(`Error parsing ${lang} translation content:`, e);
                }
              }
            });
            
            this.populateForm(content);
            // Check if Arabic data is empty and load defaults
            const arGroup = this.getLanguageFormGroup('ar');
            const arHeroTitle = arGroup.get('heroTitle')?.value;
            const arNewsItems = arGroup.get('newsItems') as FormArray;
            if ((!arHeroTitle || arHeroTitle.trim() === '') && arNewsItems.length === 0) {
              this.loadDefaultArabicData();
            }
            // Check if English data is empty and load defaults
            const enGroup = this.getLanguageFormGroup('en');
            const enHeroTitle = enGroup.get('heroTitle')?.value;
            const enNewsItems = enGroup.get('newsItems') as FormArray;
            if ((!enHeroTitle || enHeroTitle.trim() === '') && enNewsItems.length === 0) {
              this.loadDefaultEnglishData();
            }
          } catch (e) {
            console.error('Error processing translations:', e);
            // Fall through to page.content check
          }
        }
        
        // Fallback: Try to get from page.content (old system or backup)
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: Ai4agriContent = parsedContent;
              this.populateForm(content);
              // Check if Arabic data is empty and load defaults
              const arGroup = this.getLanguageFormGroup('ar');
              const arHeroTitle = arGroup.get('heroTitle')?.value;
              const arNewsItems = arGroup.get('newsItems') as FormArray;
              if ((!arHeroTitle || arHeroTitle.trim() === '') && arNewsItems.length === 0) {
                this.loadDefaultArabicData();
              }
              // Check if English data is empty and load defaults
              const enGroup = this.getLanguageFormGroup('en');
              const enHeroTitle = enGroup.get('heroTitle')?.value;
              const enNewsItems = enGroup.get('newsItems') as FormArray;
              if ((!enHeroTitle || enHeroTitle.trim() === '') && enNewsItems.length === 0) {
                this.loadDefaultEnglishData();
              }
            } else {
              // Old format - migrate to new format
              const oldContent: Ai4agriLanguageContent = parsedContent;
              const content: Ai4agriContent = {
                translations: {
                  fr: oldContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
              this.populateForm(content);
              // Load default Arabic and English data for old format
              this.loadDefaultArabicData();
              this.loadDefaultEnglishData();
            }
          } catch (e) {
            console.error('Error parsing content:', e);
            this.loadDefaultData();
          }
        } else if (!page.translations || Object.keys(page.translations).length === 0) {
          // No translations and no content, load defaults
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

  private getEmptyLanguageContent(): Ai4agriLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      newsItems: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'AI 4 AGRI',
      heroSubtitle: ''
    });

    // Add default news items for French
    this.addNewsItem({
      title: 'Ouverture de l\'atelier international sur les applications de l\'IA dans l\'agriculture',
      description: 'Atelier International sur "L\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire"',
      date: '13 February 2024',
      url: '#'
    }, 'fr');
    this.addNewsItem({
      title: 'Program of the AI 4 AGRI 13 to 15 Feb 2024',
      description: 'Samples of the Presentations',
      date: '10 February 2024',
      url: '#'
    }, 'fr');
    this.addNewsItem({
      title: 'Atelier International sur "L\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire »',
      date: '8 February 2024',
      url: '#'
    }, 'fr');
    this.addNewsItem({
      title: 'AI 4 Agri',
      date: '7 February 2024',
      url: '#'
    }, 'fr');

    // Load default Arabic and English data
    this.loadDefaultArabicData();
    this.loadDefaultEnglishData();
  }

  private loadDefaultArabicData(): void {
    // Check if Arabic data already exists to avoid duplicates
    const arGroup = this.getLanguageFormGroup('ar');
    const heroTitle = arGroup.get('heroTitle')?.value;
    const existingNewsItems = arGroup.get('newsItems') as FormArray;

    // Only load if Arabic data is empty (no hero title and no news items)
    if ((!heroTitle || heroTitle.trim() === '') && existingNewsItems.length === 0) {
      arGroup.patchValue({
        heroTitle: 'الذكاء الاصطناعي للزراعة',
        heroSubtitle: ''
      });

      // Add default news items for Arabic
      this.addNewsItem({
        title: 'افتتاح ورشة العمل الدولية حول تطبيقات الذكاء الاصطناعي في الزراعة',
        description: 'ورشة عمل دولية حول "تطبيقات الذكاء الاصطناعي في الزراعة الدقيقة لضمان الأمن الغذائي"',
        date: '13 فبراير 2024',
        url: '#'
      }, 'ar');
    }
  }

  private loadDefaultEnglishData(): void {
    // Check if English data already exists to avoid duplicates
    const enGroup = this.getLanguageFormGroup('en');
    const heroTitle = enGroup.get('heroTitle')?.value;
    const existingNewsItems = enGroup.get('newsItems') as FormArray;

    // Only load if English data is empty (no hero title and no news items)
    if ((!heroTitle || heroTitle.trim() === '') && existingNewsItems.length === 0) {
      enGroup.patchValue({
        heroTitle: 'AI 4 AGRI',
        heroSubtitle: ''
      });

      // Add default news items for English
      this.addNewsItem({
        title: 'Opening of the International Workshop on AI Applications in Agriculture',
        description: 'International Workshop on "Application of Artificial Intelligence in Precision Agriculture for Food Security"',
        date: '13 February 2024',
        url: '#'
      }, 'en');
    }
  }

  populateForm(content: Ai4agriContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || ''
        });

        // Clear existing arrays
        const newsItems = langGroup.get('newsItems') as FormArray;
        while (newsItems.length) newsItems.removeAt(0);

        // Populate arrays
        langContent.newsItems?.forEach(item => this.addNewsItem(item, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    // Use getRawValue() for each language group separately to ensure FormArrays are properly captured
    // This is the same approach used in agence-medias form
    const translationsData: any = {};
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      const langValue = langGroup.getRawValue();
      translationsData[lang] = langValue;
      
      // Debug: Log imageUrls FormArrays directly
      const newsItems = langGroup.get('newsItems') as FormArray;
      console.log(`Language ${lang} - NewsItems count:`, newsItems.length);
      newsItems.controls.forEach((item: any, i: number) => {
        const imageUrls = item.get('imageUrls') as FormArray;
        if (imageUrls) {
          const imageUrlsValue = imageUrls.getRawValue();
          console.log(`  NewsItem ${i} (${item.get('title')?.value}):`, {
            imageUrls_length: imageUrls.length,
            imageUrls_value: imageUrlsValue,
            imageUrls_type: typeof imageUrlsValue,
            isArray: Array.isArray(imageUrlsValue),
            rawValue: imageUrlsValue
          });
        } else {
          console.log(`  NewsItem ${i} (${item.get('title')?.value}): No imageUrls FormArray found`);
        }
      });
    });
    
    // Debug: Log translations data
    console.log('Translations data (getRawValue per language):', JSON.stringify(translationsData, null, 2));
    
    // Build content with translations (will save empty strings for incomplete languages)
    const content: Ai4agriContent = {
      translations: {
        fr: this.buildLanguageContent(translationsData.fr),
        ar: this.buildLanguageContent(translationsData.ar),
        en: this.buildLanguageContent(translationsData.en)
      }
    };
    
    // Debug: Log built content to verify imageUrls are included
    console.log('Built content with imageUrls:', JSON.stringify(content, null, 2));

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'AI 4 AGRI';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    // Final verification: Check that imageUrls are present in the content
    const frNewsItems = content.translations.fr.newsItems || [];
    console.log('Final verification - French newsItems:', frNewsItems.length);
    frNewsItems.forEach((item: any, index: number) => {
      console.log(`  NewsItem ${index} (${item.title}):`, {
        hasImageUrls: !!item.imageUrls,
        imageUrls_count: item.imageUrls?.length || 0,
        imageUrls: item.imageUrls
      });
    });
    
    // Build translations for the new structure
    const translations: { [key: string]: any } = {};
    
    (['fr', 'ar', 'en'] as const).forEach(lang => {
      const langContent = content.translations?.[lang];
      if (langContent) {
        const langContentJson = JSON.stringify(langContent);
        translations[lang] = {
          title: langContent.heroTitle || 'AI 4 AGRI',
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: (langContent as any).introText || '',
          content: langContentJson, // Store the language-specific content in content field
          extra: langContentJson // Also store in extra for backward compatibility
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
        slug: 'ai4agri',
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

  private buildLanguageContent(langData: any): Ai4agriLanguageContent {
    const result = {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      newsItems: (langData.newsItems || []).map((item: any, index: number) => {
        // Extract imageUrls from FormArray - it should be an array of strings
        let imageUrls: string[] = [];
        
        console.log(`Building newsItem ${index}:`, {
          title: item.title,
          imageUrls_raw: item.imageUrls,
          imageUrls_type: typeof item.imageUrls,
          isArray: Array.isArray(item.imageUrls),
          imageUrl: item.imageUrl
        });
        
        if (item.imageUrls && Array.isArray(item.imageUrls)) {
          // Filter out empty/null values and ensure they're strings
          imageUrls = item.imageUrls
            .filter((url: any) => url && typeof url === 'string' && url.trim().length > 0)
            .map((url: string) => url.trim());
          console.log(`  -> Filtered imageUrls for item ${index}:`, imageUrls);
        } else if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim().length > 0) {
          // Support old format (single imageUrl string)
          imageUrls = [item.imageUrl.trim()];
          console.log(`  -> Using old format imageUrl for item ${index}:`, imageUrls);
        } else {
          console.log(`  -> No images found for item ${index}`);
        }
        
        // Extract documentUrls from FormArray - it should be an array of strings
        let documentUrls: string[] = [];
        
        if (item.documentUrls && Array.isArray(item.documentUrls)) {
          // Filter out empty/null values and ensure they're strings
          documentUrls = item.documentUrls
            .filter((url: any) => url && typeof url === 'string' && url.trim().length > 0)
            .map((url: string) => url.trim());
        } else if (item.documentUrl && typeof item.documentUrl === 'string' && item.documentUrl.trim().length > 0) {
          // Support old format (single documentUrl string)
          documentUrls = [item.documentUrl.trim()];
        }
        
        return {
          title: item.title || '',
          imageUrls: imageUrls,
          documentUrls: documentUrls,
          description: item.description || '',
          date: item.date || '',
          url: item.url || ''
        };
      })
    };
    
    console.log('Built language content:', JSON.stringify(result, null, 2));
    return result;
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}



