import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';

interface AppelDetail {
  label: string;
  value: string;
}

interface AppelAction {
  text: string;
  url: string;
  type: 'primary' | 'outline';
}

interface AppelItem {
  status: 'active' | 'upcoming' | 'closed';
  title: string;
  description: string;
  imageUrl?: string;
  details: AppelDetail[];
  actions: AppelAction[];
}

interface AppelsCandidaturesLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
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

  languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  // Image upload state tracking
  private imageUploadState = new Map<string, {
    file?: File;
    preview?: string;
    isUploading?: boolean;
    uploadProgress?: number;
  }>();

  // Document upload state tracking
  private documentUploadState = new Map<string, {
    file?: File;
    fileName?: string;
    isUploading?: boolean;
    uploadProgress?: number;
  }>();

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
    const langParam = this.route.snapshot.queryParams['lang'];
    if (langParam && ['fr', 'ar', 'en'].includes(langParam)) {
      this.activeLanguage = langParam as 'fr' | 'ar' | 'en';
    }
    
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
      appels: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    const group = this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
    if (!group) {
      return this.form.get(`translations.fr`) as FormGroup;
    }
    return group;
  }

  getLanguageFormGroup(lang: string): FormGroup {
    return this.form.get(`translations.${lang}`) as FormGroup;
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

  // Appels FormArray methods
  get appels(): FormArray {
    return this.getActiveLanguageFormGroup().get('appels') as FormArray;
  }

  addAppel(item?: AppelItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const appels = langGroup.get('appels') as FormArray;
    const group = this.fb.group({
      status: [item?.status || 'active', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      imageUrl: [item?.imageUrl || ''],
      details: this.fb.array(item?.details?.map(d => this.fb.group({
        label: [d.label, Validators.required],
        value: [d.value, Validators.required]
      })) || []),
      actions: this.fb.array(item?.actions?.map(a => this.fb.group({
        text: [a.text, Validators.required],
        url: [a.url, Validators.required],
        type: [a.type || 'primary', Validators.required]
      })) || [])
    });
    appels.push(group);
  }

  removeAppel(index: number): void {
    this.appels.removeAt(index);
  }

  getAppelDetails(index: number): FormArray {
    return this.appels.at(index).get('details') as FormArray;
  }

  addAppelDetail(appelIndex: number, detail?: AppelDetail): void {
    this.getAppelDetails(appelIndex).push(this.fb.group({
      label: [detail?.label || '', Validators.required],
      value: [detail?.value || '', Validators.required]
    }));
  }

  addDateDetail(appelIndex: number): void {
    this.addAppelDetail(appelIndex, { label: 'Date', value: '' });
  }

  removeAppelDetail(appelIndex: number, detailIndex: number): void {
    this.getAppelDetails(appelIndex).removeAt(detailIndex);
  }

  getAppelActions(index: number): FormArray {
    return this.appels.at(index).get('actions') as FormArray;
  }

  addAppelAction(appelIndex: number, action?: AppelAction): void {
    this.getAppelActions(appelIndex).push(this.fb.group({
      text: [action?.text || 'En savoir plus', Validators.required],
      url: [action?.url || '', Validators.required],
      type: [action?.type || 'primary', Validators.required]
    }));
  }

  removeAppelAction(appelIndex: number, actionIndex: number): void {
    this.getAppelActions(appelIndex).removeAt(actionIndex);
  }

  // Image upload methods
  getImageUploadState(appelIndex: number): {
    file?: File;
    preview?: string;
    isUploading?: boolean;
    uploadProgress?: number;
  } {
    const stateKey = `${this.activeLanguage}-${appelIndex}`;
    return this.imageUploadState.get(stateKey) || {};
  }

  onImageSelected(event: Event, appelIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const stateKey = `${this.activeLanguage}-${appelIndex}`;
      
      this.errorMessage = '';
      
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner uniquement des fichiers image';
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 10MB';
        return;
      }
      
      this.imageUploadState.set(stateKey, {
        file: file,
        preview: undefined,
        isUploading: false,
        uploadProgress: 0
      });
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const state = this.imageUploadState.get(stateKey);
        if (state) {
          state.preview = e.target.result;
          this.imageUploadState.set(stateKey, state);
        }
      };
      reader.readAsDataURL(file);
      
      this.uploadImage(file, appelIndex);
    }
  }

  uploadImage(file: File, appelIndex: number): void {
    const stateKey = `${this.activeLanguage}-${appelIndex}`;
    const state = this.imageUploadState.get(stateKey);
    if (!state) return;
    
    state.isUploading = true;
    state.uploadProgress = 0;
    this.imageUploadState.set(stateKey, state);
    this.errorMessage = '';
    
    this.articleService.uploadImage(file).subscribe({
      next: (response) => {
        const appelGroup = this.appels.at(appelIndex) as FormGroup;
        appelGroup.patchValue({ imageUrl: response.url });
        
        state.isUploading = false;
        state.uploadProgress = 100;
        state.file = undefined;
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

  removeImage(appelIndex: number): void {
    const appelGroup = this.appels.at(appelIndex) as FormGroup;
    appelGroup.patchValue({ imageUrl: '' });
    
    const stateKey = `${this.activeLanguage}-${appelIndex}`;
    this.imageUploadState.delete(stateKey);
  }

  getAppelImageUrl(appelIndex: number): string | null {
    const appelGroup = this.appels.at(appelIndex) as FormGroup;
    return appelGroup.get('imageUrl')?.value || null;
  }

  // Document upload methods
  getDocumentUploadState(appelIndex: number, actionIndex: number): {
    file?: File;
    fileName?: string;
    isUploading?: boolean;
    uploadProgress?: number;
  } {
    const stateKey = `${this.activeLanguage}-${appelIndex}-${actionIndex}`;
    return this.documentUploadState.get(stateKey) || {};
  }

  onDocumentSelected(event: Event, appelIndex: number, actionIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const stateKey = `${this.activeLanguage}-${appelIndex}-${actionIndex}`;
      
      this.errorMessage = '';
      
      // Validate file type - allow PDF and common document types
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
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
      
      // Update state
      this.documentUploadState.set(stateKey, {
        file: file,
        fileName: file.name,
        isUploading: false,
        uploadProgress: 0
      });
      
      // Upload file
      this.uploadDocument(file, appelIndex, actionIndex);
    }
  }

  uploadDocument(file: File, appelIndex: number, actionIndex: number): void {
    const stateKey = `${this.activeLanguage}-${appelIndex}-${actionIndex}`;
    const state = this.documentUploadState.get(stateKey);
    if (!state) return;
    
    state.isUploading = true;
    state.uploadProgress = 0;
    this.documentUploadState.set(stateKey, state);
    this.errorMessage = '';
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        const actionGroup = this.getAppelActions(appelIndex).at(actionIndex) as FormGroup;
        actionGroup.patchValue({ url: response.url });
        
        state.isUploading = false;
        state.uploadProgress = 100;
        state.file = undefined;
        this.documentUploadState.set(stateKey, state);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Document upload error:', error);
        state.isUploading = false;
        state.uploadProgress = 0;
        this.documentUploadState.set(stateKey, state);
        this.errorMessage = error.error?.error || 'Erreur lors du téléchargement du document';
      }
    });
  }

  removeDocument(appelIndex: number, actionIndex: number): void {
    const actionGroup = this.getAppelActions(appelIndex).at(actionIndex) as FormGroup;
    actionGroup.patchValue({ url: '' });
    
    const stateKey = `${this.activeLanguage}-${appelIndex}-${actionIndex}`;
    this.documentUploadState.delete(stateKey);
  }

  getActionUrl(appelIndex: number, actionIndex: number): string | null {
    const actionGroup = this.getAppelActions(appelIndex).at(actionIndex) as FormGroup;
    return actionGroup.get('url')?.value || null;
  }

  // Copy from French helper
  copyFromFrench(): void {
    const frGroup = this.getLanguageFormGroup('fr');
    const activeGroup = this.getActiveLanguageFormGroup();
    
    activeGroup.patchValue({
      heroTitle: frGroup.get('heroTitle')?.value || '',
      heroSubtitle: frGroup.get('heroSubtitle')?.value || '',
      introText: frGroup.get('introText')?.value || ''
    });

    const frAppels = frGroup.get('appels') as FormArray;
    const activeAppels = activeGroup.get('appels') as FormArray;
    
    while (activeAppels.length > 0) {
      activeAppels.removeAt(0);
    }

    for (let i = 0; i < frAppels.length; i++) {
      const frAppel = frAppels.at(i).value;
      this.addAppel({
        status: frAppel.status,
        title: frAppel.title,
        description: frAppel.description,
        imageUrl: frAppel.imageUrl,
        details: frAppel.details || [],
        actions: frAppel.actions || []
      }, this.activeLanguage);
    }

    alert(`Contenu copié depuis le français vers ${this.getActiveLanguageName()}. N'oubliez pas de traduire les textes !`);
  }

  // JSON Import
  async onJsonFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    try {
      const allItems: any[] = [];
      const skippedFiles: string[] = [];
      const errorFiles: string[] = [];

      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
          skippedFiles.push(file.name);
          continue;
        }

        try {
          const text = await file.text();
          if (!text || text.trim().length === 0) {
            errorFiles.push(`${file.name} (fichier vide)`);
            continue;
          }
          
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            allItems.push(...data);
          } else if (typeof data === 'object') {
            allItems.push(data);
          } else {
            errorFiles.push(`${file.name} (format invalide)`);
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
          errorFiles.push(`${file.name} (${errorMsg})`);
          console.error(`Error parsing file ${file.name}:`, error);
        }
      }

      if (allItems.length === 0) {
        let errorMsg = 'Aucune donnée valide trouvée dans les fichiers JSON';
        if (errorFiles.length > 0) {
          errorMsg += `\nFichiers en erreur: ${errorFiles.join(', ')}`;
        }
        this.errorMessage = errorMsg;
        alert(errorMsg);
        return;
      }

      const hasTranslations = allItems.length > 0 && 
        (allItems[0].fr !== undefined || allItems[0].ar !== undefined || allItems[0].en !== undefined);

      this.errorMessage = '';
      const imageCount = allItems.filter(item => {
        if (hasTranslations) {
          return (item.image && item.image.startsWith('http')) || 
                 (item.fr?.image && item.fr.image.startsWith('http')) ||
                 (item.ar?.image && item.ar.image.startsWith('http')) ||
                 (item.en?.image && item.en.image.startsWith('http'));
        }
        return item.image && item.image.startsWith('http');
      }).length;
      
      if (imageCount > 0) {
        this.errorMessage = `Import en cours: téléchargement de ${imageCount} images...`;
      }

      let downloadedCount = 0;
      let failedCount = 0;
      const appelsByLanguage: { [key: string]: AppelItem[] } = {
        fr: [],
        ar: [],
        en: []
      };

      for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        
        if (hasTranslations) {
          let imageUrl = item.image || item.fr?.image || item.ar?.image || item.en?.image || undefined;
          
          if (imageUrl && imageUrl.startsWith('http')) {
            try {
              if (imageCount > 0) {
                this.errorMessage = `Téléchargement de l'image ${downloadedCount + failedCount + 1}/${imageCount}...`;
              }
              const localImageUrl = await this.downloadAndUploadImage(imageUrl);
              if (localImageUrl) {
                imageUrl = localImageUrl;
                downloadedCount++;
              } else {
                failedCount++;
              }
            } catch (error) {
              console.warn(`Failed to download image from ${imageUrl}:`, error);
              failedCount++;
            }
          }

          ['fr', 'ar', 'en'].forEach(lang => {
            const langData = item[lang];
            if (!langData) return;

            const appel: AppelItem = {
              status: 'active',
              title: langData.title || '',
              description: langData.full_text || langData.summary || '',
              imageUrl: imageUrl,
              details: [],
              actions: []
            };

            if (langData.date) {
              appel.details.push({
                label: lang === 'fr' ? 'Date' : (lang === 'ar' ? 'التاريخ' : 'Date'),
                value: langData.date
              });
            }

            const url = item.url || langData.url;
            if (url) {
              const actionText = lang === 'fr' ? 'En savoir plus' : 
                                (lang === 'ar' ? 'المزيد' : 'Learn more');
              appel.actions.push({
                text: actionText,
                url: url,
                type: 'primary'
              });
            }

            appelsByLanguage[lang].push(appel);
          });
        } else {
          let imageUrl = item.image || undefined;
          
          if (imageUrl && imageUrl.startsWith('http')) {
            try {
              if (imageCount > 0) {
                this.errorMessage = `Téléchargement de l'image ${downloadedCount + failedCount + 1}/${imageCount}...`;
              }
              const localImageUrl = await this.downloadAndUploadImage(imageUrl);
              if (localImageUrl) {
                imageUrl = localImageUrl;
                downloadedCount++;
              } else {
                failedCount++;
              }
            } catch (error) {
              console.warn(`Failed to download image from ${imageUrl}, keeping original URL:`, error);
              failedCount++;
            }
          }

          const appel: AppelItem = {
            status: 'active',
            title: item.title || '',
            description: item.full_text || item.summary || '',
            imageUrl: imageUrl,
            details: [],
            actions: []
          };

          if (item.date) {
            appel.details.push({
              label: 'Date',
              value: item.date
            });
          }

          if (item.url) {
            appel.actions.push({
              text: 'En savoir plus',
              url: item.url,
              type: 'primary'
            });
          }

          appelsByLanguage['fr'].push(appel);
        }
      }

      ['fr', 'ar', 'en'].forEach(lang => {
        const langGroup = this.getLanguageFormGroup(lang);
        appelsByLanguage[lang].forEach(appel => {
          this.addAppel(appel, lang);
        });
      });

      const totalAppels = hasTranslations ? allItems.length : appelsByLanguage['fr'].length;
      let successMessage = `Import réussi: ${totalAppels} appels à candidatures ajoutés`;
      if (hasTranslations) {
        successMessage += `\n- Français: ${appelsByLanguage['fr'].length} appels`;
        successMessage += `\n- العربية: ${appelsByLanguage['ar'].length} appels`;
        successMessage += `\n- English: ${appelsByLanguage['en'].length} appels`;
      }
      if (imageCount > 0) {
        successMessage += `\n\nImages téléchargées: ${downloadedCount}/${imageCount}`;
        if (failedCount > 0) {
          successMessage += `\nImages non téléchargées (URLs originales conservées): ${failedCount}`;
        }
      }
      this.errorMessage = '';
      alert(successMessage);
      
      input.value = '';
    } catch (error) {
      console.error('Error importing JSON files:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      this.errorMessage = `Erreur lors de l'importation des fichiers JSON: ${errorMsg}`;
      alert(`Erreur lors de l'importation: ${errorMsg}`);
    } finally {
      input.value = '';
    }
  }

  private async downloadAndUploadImage(imageUrl: string): Promise<string | null> {
    try {
      let response: Response;
      try {
        response = await fetch(imageUrl, {
          mode: 'cors',
          credentials: 'omit',
          referrerPolicy: 'no-referrer'
        });
      } catch (corsError) {
        console.warn(`CORS error for ${imageUrl}, trying alternative method:`, corsError);
        return null;
      }

      if (!response.ok) {
        console.warn(`Failed to fetch image from ${imageUrl}: ${response.status} ${response.statusText}`);
        return null;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.startsWith('image/')) {
        console.warn(`URL ${imageUrl} does not return an image (content-type: ${contentType})`);
        return null;
      }

      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        console.warn(`Blob from ${imageUrl} is not an image (type: ${blob.type})`);
        return null;
      }

      const fileExtension = blob.type.split('/')[1] || 'jpg';
      const filename = `imported-${Date.now()}.${fileExtension}`;
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

      return new Promise((resolve, reject) => {
        this.articleService.uploadImage(file).subscribe({
          next: (response) => {
            resolve(response.url);
          },
          error: (error) => {
            console.error(`Failed to upload image ${filename}:`, error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error(`Error downloading/uploading image from ${imageUrl}:`, error);
      return null;
    }
  }

  // Load and Save
  loadPage(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pageService.getPageBySlug('appels-candidatures').subscribe({
      next: (page: PageDTO) => {
        this.pageId = page.id ?? null;
        try {
          if (page.content) {
            const content: AppelsCandidaturesContent = JSON.parse(page.content);
            this.populateForm(content);
          }
        } catch (error) {
          console.error('Error parsing page content:', error);
          this.errorMessage = 'Erreur lors du chargement du contenu de la page';
        }
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.isLoading = false;
        } else {
          this.errorMessage = 'Erreur lors du chargement de la page';
          this.isLoading = false;
          console.error('Error loading page:', error);
        }
      }
    });
  }

  populateForm(content: AppelsCandidaturesContent): void {
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || ''
        });

        const appels = langGroup.get('appels') as FormArray;
        while (appels.length) appels.removeAt(0);

        langContent.appels?.forEach(item => this.addAppel(item, lang));
      }
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    const content: AppelsCandidaturesContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Appels à Candidatures';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Appels à Candidatures',
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
          this.errorMessage = 'Erreur lors de la sauvegarde';
          console.error('Error saving page:', error);
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'appels-candidatures',
        title: 'Appels à Candidatures',
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
          this.errorMessage = 'Erreur lors de la création';
          console.error('Error creating page:', error);
        }
      });
    }
  }

  private buildLanguageContent(langData: any): AppelsCandidaturesLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      appels: (langData.appels || []).map((item: any) => ({
        status: item.status,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl || undefined,
        details: item.details || [],
        actions: item.actions || []
      }))
    };
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Appels à Candidatures',
        ar: 'تعديل صفحة دعوات التقديم',
        en: 'Edit Calls for Applications Page'
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
      'heroSection': {
        fr: 'Section Hero',
        ar: 'قسم البطل',
        en: 'Hero Section'
      },
      'heroTitle': {
        fr: 'Titre principal',
        ar: 'العنوان الرئيسي',
        en: 'Main Title'
      },
      'appelsSection': {
        fr: 'Appels à Candidatures',
        ar: 'دعوات التقديم',
        en: 'Calls for Applications'
      },
      'title': {
        fr: 'Titre',
        ar: 'العنوان',
        en: 'Title'
      },
      'description': {
        fr: 'Description',
        ar: 'الوصف',
        en: 'Description'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'حذف',
        en: 'Remove'
      },
      'addAppel': {
        fr: 'Ajouter un appel',
        ar: 'إضافة دعوة',
        en: 'Add Call'
      },
      'saveChanges': {
        fr: 'Enregistrer les modifications',
        ar: 'حفظ التغييرات',
        en: 'Save Changes'
      },
      'saving': {
        fr: 'Enregistrement...',
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
      }
    };

    const lang = this.activeLanguage;
    return translations[key]?.[lang] || key;
  }
}
