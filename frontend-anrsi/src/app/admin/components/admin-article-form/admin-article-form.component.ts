import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleAdminService } from '../../services/article-admin.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-admin-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-article-form.component.html',
  styleUrls: ['./admin-article-form.component.scss']
})
export class AdminArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  isEditMode = false;
  articleId: number | null = null;
  isLoading = false;
  errorMessage = '';
  activeLanguage: 'fr' | 'ar' | 'en' = 'fr';
  
  // Multiple images upload properties
  images: Array<{
    id: string;
    file?: File;
    url: string;
    preview?: string;
    isUploading?: boolean;
    uploadProgress?: number;
    urlFallback?: string;
  }> = [];
  isUploading = false;
  
  // Attachment upload properties
  attachmentFile: File | null = null;
  attachmentUrl: string = '';
  attachmentUrlFallback: string = '';
  isUploadingAttachment = false;
  attachmentUploadProgress = 0;
  attachmentErrorMessage = '';
  
  languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Create form with nested language groups
    this.articleForm = this.fb.group({
      // Shared fields (same for all languages)
      author: ['', [Validators.required]],
      publishDate: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]], // First image will be used as featured image
      images: [[]], // Array of image URLs
      category: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      featured: [false],
      published: [true],
      attachmentUrl: [''], // Optional attachment URL
      
      // Language-specific translations
      translations: this.fb.group({
        fr: this.createLanguageFormGroup('fr'),
        ar: this.createLanguageFormGroup('ar'),
        en: this.createLanguageFormGroup('en')
      })
    });
  }

  private createLanguageFormGroup(lang: string): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      excerpt: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    // Check for language query parameter
    this.route.queryParams.subscribe(params => {
      if (params['lang'] && ['fr', 'ar', 'en'].includes(params['lang'])) {
        this.activeLanguage = params['lang'] as 'fr' | 'ar' | 'en';
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.articleId = +params['id'];
        this.loadArticle();
      }
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
    }
  }

  getTranslationFormGroup(lang: string): FormGroup {
    return this.articleForm.get(`translations.${lang}`) as FormGroup;
  }

  getActiveTranslationFormGroup(): FormGroup {
    return this.getTranslationFormGroup(this.activeLanguage);
  }

  private loadArticle(): void {
    if (this.articleId) {
      this.articleService.getArticleById(this.articleId).subscribe(article => {
        if (article) {
          // Load shared fields
          this.articleForm.patchValue({
            author: article.author,
            publishDate: this.formatDateForInput(article.publishDate),
            imageUrl: article.imageUrl,
            
            featured: article.featured || false,
            published: article.published !== false
          });
          
          // Load images array
          if (article.images && article.images.length > 0) {
            this.images = article.images.map((url, index) => ({
              id: `img-${index}-${Date.now()}`,
              url: url,
              preview: url
            }));
            // Set first image as featured image
            if (article.imageUrl) {
              this.articleForm.patchValue({ imageUrl: article.imageUrl });
            } else if (this.images.length > 0) {
              this.articleForm.patchValue({ imageUrl: this.images[0].url });
            }
          } else if (article.imageUrl) {
            // Fallback to single imageUrl for backward compatibility
            this.images = [{
              id: `img-0-${Date.now()}`,
              url: article.imageUrl,
              preview: article.imageUrl
            }];
            this.articleForm.patchValue({ imageUrl: article.imageUrl });
          }
          this.articleForm.patchValue({ images: this.images.map(img => img.url) });
          
          // Load attachment if exists
          if (article.attachmentUrl) {
            this.attachmentUrl = article.attachmentUrl;
            this.attachmentUrlFallback = article.attachmentUrl;
            this.articleForm.patchValue({ attachmentUrl: article.attachmentUrl });
          }
          
          // Load translations if they exist
          if (article.translations) {
            Object.keys(article.translations).forEach(lang => {
              const translation = article.translations![lang as 'fr' | 'ar' | 'en'];
              if (translation) {
                this.getTranslationFormGroup(lang).patchValue({
                  title: translation.title,
                  content: translation.content,
                  excerpt: translation.excerpt
                });
              }
            });
          } else {
            // If no translations object, try to load from main article fields (backward compatibility)
            const lang = article.language || 'fr';
            this.getTranslationFormGroup(lang).patchValue({
              title: article.title,
              content: article.content,
              excerpt: article.excerpt
            });
          }
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Clear previous errors
      this.errorMessage = '';
      
      // Process each file
      files.forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          this.errorMessage = 'Please select only image files';
          return;
        }
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.errorMessage = 'File size must be less than 10MB';
          return;
        }
        
        // Create image object
        const imageId = `img-${Date.now()}-${Math.random()}`;
        const imageObj = {
          id: imageId,
          file: file,
          url: '',
          preview: '',
          isUploading: false,
          uploadProgress: 0,
          urlFallback: ''
        };
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          imageObj.preview = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Add to images array
        this.images.push(imageObj);
        
        // Upload file
        this.uploadImage(imageObj);
      });
      
      // Reset file input
      input.value = '';
    }
  }

  uploadImage(imageObj: { id: string; file?: File; url: string; isUploading?: boolean; uploadProgress?: number }): void {
    if (!imageObj.file) return;
    
    imageObj.isUploading = true;
    imageObj.uploadProgress = 0;
    this.errorMessage = '';
    
    console.log('Starting image upload:', {
      fileName: imageObj.file.name,
      fileSize: imageObj.file.size,
      fileType: imageObj.file.type
    });
    
    // Simulate progress (in real implementation, you'd use HttpEventType.UPLOAD_PROGRESS)
    const progressInterval = setInterval(() => {
      if (imageObj.uploadProgress !== undefined && imageObj.uploadProgress < 90) {
        imageObj.uploadProgress += 10;
      }
    }, 200);
    
    this.articleService.uploadImage(imageObj.file).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        if (imageObj.uploadProgress !== undefined) {
          imageObj.uploadProgress = 100;
        }
        console.log('Upload successful:', response);
        imageObj.url = response.url;
        imageObj.isUploading = false;
        
        // Update form with all image URLs
        const imageUrls = this.images.map(img => img.url).filter(url => url);
        this.articleForm.patchValue({ images: imageUrls });
        
        // Set first image as featured image if not set
        if (!this.articleForm.get('imageUrl')?.value && imageUrls.length > 0) {
          this.articleForm.patchValue({ imageUrl: imageUrls[0] });
        }
        
        setTimeout(() => {
          if (imageObj.uploadProgress !== undefined) {
            imageObj.uploadProgress = 0;
          }
        }, 500);
      },
      error: (error) => {
        clearInterval(progressInterval);
        imageObj.isUploading = false;
        if (imageObj.uploadProgress !== undefined) {
          imageObj.uploadProgress = 0;
        }
        
        console.error('Upload error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        
        let errorMsg = 'Failed to upload image. ';
        
        if (error.status === 0) {
          errorMsg += 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 401) {
          errorMsg += 'Authentication required. Please log in.';
        } else if (error.status === 403) {
          errorMsg = error.error?.message || error.error?.error || 'Access denied. You need to be logged in with an ADMIN or EDITOR account to upload images.';
        } else if (error.status === 413) {
          errorMsg += 'File is too large. Maximum size is 10MB.';
        } else if (error.status === 400) {
          errorMsg = error.error?.error || error.error?.message || 'Invalid file. Please select a valid image file.';
        } else if (error.status >= 500) {
          errorMsg += 'Server error. Please try again later.';
        } else {
          errorMsg += error.error?.error || error.error?.message || error.message || 'Please try again.';
        }
        
        this.errorMessage = errorMsg;
        // Remove failed image from array
        this.images = this.images.filter(img => img.id !== imageObj.id);
      }
    });
  }

  removeImage(imageId: string): void {
    const imageIndex = this.images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return;
    
    const removedImage = this.images[imageIndex];
    this.images.splice(imageIndex, 1);
    
    // Update form with remaining image URLs
    const imageUrls = this.images.map(img => img.url).filter(url => url);
    this.articleForm.patchValue({ images: imageUrls });
    
    // If removed image was the featured image, set first remaining image as featured
    const currentFeaturedUrl = this.articleForm.get('imageUrl')?.value;
    if (currentFeaturedUrl === removedImage.url) {
      if (imageUrls.length > 0) {
        this.articleForm.patchValue({ imageUrl: imageUrls[0] });
      } else {
        this.articleForm.patchValue({ imageUrl: '' });
      }
    }
  }

  onUrlInputChange(event: Event, imageId?: string): void {
    const input = event.target as HTMLInputElement;
    if (imageId) {
      const imageObj = this.images.find(img => img.id === imageId);
      if (imageObj) {
        imageObj.urlFallback = input.value;
      }
    }
  }

  onUrlInput(imageId?: string): void {
    if (imageId) {
      const imageObj = this.images.find(img => img.id === imageId);
      if (imageObj && imageObj.urlFallback && imageObj.urlFallback.trim()) {
        const trimmedUrl = imageObj.urlFallback.trim();
        imageObj.url = trimmedUrl;
        imageObj.preview = trimmedUrl;
        imageObj.file = undefined;
        imageObj.urlFallback = trimmedUrl;
        
        // Update form with all image URLs
        const imageUrls = this.images.map(img => img.url).filter(url => url);
        this.articleForm.patchValue({ images: imageUrls });
        
        // Set first image as featured if not set
        if (!this.articleForm.get('imageUrl')?.value && imageUrls.length > 0) {
          this.articleForm.patchValue({ imageUrl: imageUrls[0] });
        }
      }
    }
  }

  addImageFromUrl(): void {
    const imageId = `img-url-${Date.now()}-${Math.random()}`;
    const imageObj = {
      id: imageId,
      url: '',
      preview: '',
      urlFallback: ''
    };
    this.images.push(imageObj);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Attachment handling methods
  onAttachmentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      this.attachmentErrorMessage = '';
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      // Also check by extension as fallback
      const fileName = file.name.toLowerCase();
      const isValidByExtension = fileName.endsWith('.pdf') ||
                                 fileName.endsWith('.doc') ||
                                 fileName.endsWith('.docx') ||
                                 fileName.endsWith('.txt') ||
                                 fileName.endsWith('.xls') ||
                                 fileName.endsWith('.xlsx');
      
      if (!allowedTypes.includes(file.type) && !isValidByExtension) {
        this.attachmentErrorMessage = 'Please select a valid file (PDF, DOC, DOCX, TXT, XLS, XLSX)';
        this.attachmentFile = null;
        return;
      }
      
      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        this.attachmentErrorMessage = 'File size must be less than 20MB';
        this.attachmentFile = null;
        return;
      }
      
      this.attachmentFile = file;
      this.attachmentUrlFallback = '';
      
      // Upload file
      this.uploadAttachment(file);
    }
  }

  uploadAttachment(file: File): void {
    this.isUploadingAttachment = true;
    this.attachmentUploadProgress = 0;
    this.attachmentErrorMessage = '';
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (this.attachmentUploadProgress < 90) {
        this.attachmentUploadProgress += 10;
      }
    }, 200);
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.attachmentUploadProgress = 100;
        this.articleForm.patchValue({ attachmentUrl: response.url });
        this.attachmentUrl = response.url;
        setTimeout(() => {
          this.isUploadingAttachment = false;
          this.attachmentUploadProgress = 0;
        }, 500);
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isUploadingAttachment = false;
        this.attachmentUploadProgress = 0;
        
        let errorMsg = 'Failed to upload file. ';
        if (error.status === 0) {
          errorMsg += 'Cannot connect to server.';
        } else if (error.status === 413) {
          errorMsg += 'File is too large. Maximum size is 20MB.';
        } else {
          errorMsg += error.error?.error || error.error?.message || 'Please try again.';
        }
        
        this.attachmentErrorMessage = errorMsg;
      }
    });
  }

  removeAttachment(): void {
    this.attachmentFile = null;
    this.attachmentUrl = '';
    this.attachmentUrlFallback = '';
    this.articleForm.patchValue({ attachmentUrl: '' });
    const fileInput = document.getElementById('attachmentFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onAttachmentUrlInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.attachmentUrlFallback = input.value;
  }

  onAttachmentUrlInput(): void {
    if (this.attachmentUrlFallback && this.attachmentUrlFallback.trim()) {
      const trimmedUrl = this.attachmentUrlFallback.trim();
      this.articleForm.patchValue({ attachmentUrl: trimmedUrl });
      this.attachmentUrl = trimmedUrl;
      this.attachmentFile = null;
      this.attachmentUrlFallback = trimmedUrl;
    }
  }

  isPdfFile(fileName: string | null | undefined): boolean {
    if (!fileName) return false;
    return fileName.toLowerCase().endsWith('.pdf');
  }

  isWordFile(fileName: string | null | undefined): boolean {
    if (!fileName) return false;
    const name = fileName.toLowerCase();
    return name.endsWith('.doc') || name.endsWith('.docx');
  }

  isExcelFile(fileName: string | null | undefined): boolean {
    if (!fileName) return false;
    const name = fileName.toLowerCase();
    return name.endsWith('.xls') || name.endsWith('.xlsx');
  }

  getFileNameFromUrl(url: string | null | undefined): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1] || url;
  }

  onSubmit(): void {
    // Validate all language forms
    const translationsGroup = this.articleForm.get('translations') as FormGroup;
    let hasValidTranslation = false;
    const translationsToSave: any = {};
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = translationsGroup.get(lang) as FormGroup;
      if (langGroup.valid) {
        hasValidTranslation = true;
        translationsToSave[lang] = langGroup.value;
      } else {
        langGroup.markAllAsTouched();
      }
    });

    if (!hasValidTranslation) {
      this.errorMessage = 'At least one language translation is required';
      return;
    }

    // Check if at least one image is provided
    const imageUrls = this.images.map(img => img.url).filter(url => url);
    if (imageUrls.length === 0 && !this.articleForm.get('imageUrl')?.value) {
      this.errorMessage = 'At least one image is required';
      return;
    }
    
    if (this.articleForm.get('author')?.valid && 
        this.articleForm.get('publishDate')?.valid &&
        this.articleForm.get('category')?.valid &&
        this.articleForm.get('tags')?.valid) {
      
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.articleForm.value;
      
      // Format publishDate for backend (LocalDateTime expects format: YYYY-MM-DDTHH:mm:ss)
      // Date input provides YYYY-MM-DD, so we append T00:00:00 for midnight
      let publishDate: string;
      if (formValue.publishDate) {
        // If date string doesn't include time, append midnight time
        if (formValue.publishDate.includes('T')) {
          // Already has time, use as is but remove timezone if present
          publishDate = formValue.publishDate.split('Z')[0].split('+')[0];
        } else {
          // Just date, append midnight time
          publishDate = `${formValue.publishDate}T00:00:00`;
        }
      } else {
        // Default to today at midnight
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        publishDate = `${year}-${month}-${day}T00:00:00`;
      }
      
      // Get all image URLs
      const imageUrls = this.images.map(img => img.url).filter(url => url);
      
      // Prepare data for backend
      const articleData: any = {
        author: formValue.author,
        publishDate: publishDate,
        imageUrl: formValue.imageUrl || (imageUrls.length > 0 ? imageUrls[0] : ''),
        images: imageUrls,
        category: formValue.category,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        featured: formValue.featured || false,
        published: formValue.published !== false,
        attachmentUrl: formValue.attachmentUrl || null,
        translations: translationsToSave
      };

      console.log('Submitting article data:', articleData);

      const operation = this.isEditMode && this.articleId
        ? this.articleService.updateArticle(this.articleId, articleData)
        : this.articleService.createArticle(articleData);

      operation.subscribe({
        next: (article) => {
          this.isLoading = false;
          console.log('Article saved successfully:', article);
          this.router.navigate(['/admin/articles']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving article:', error);
          
          // Provide more specific error messages
          let errorMsg = 'An error occurred while saving the article. ';
          
          if (error.status === 0) {
            errorMsg += 'Cannot connect to server. Please check if the backend is running.';
          } else if (error.status === 401) {
            errorMsg += 'Authentication required. Please log in.';
          } else if (error.status === 403) {
            errorMsg = 'Access denied. You need ADMIN or EDITOR permissions to save articles.';
          } else if (error.status === 400) {
            // Validation errors from backend
            const validationErrors = error.error?.errors || error.error?.message || error.error?.error;
            if (validationErrors) {
              if (Array.isArray(validationErrors)) {
                errorMsg = validationErrors.map((e: any) => e.defaultMessage || e.message).join(', ');
              } else if (typeof validationErrors === 'string') {
                errorMsg = validationErrors;
              } else {
                errorMsg = 'Validation error: ' + JSON.stringify(validationErrors);
              }
            } else {
              errorMsg += 'Invalid data. Please check all fields.';
            }
          } else if (error.status >= 500) {
            errorMsg += 'Server error. Please try again later.';
          } else {
            errorMsg += error.error?.message || error.error?.error || error.message || 'Please try again.';
          }
          
          this.errorMessage = errorMsg;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill all required shared fields';
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/articles']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.articleForm.controls).forEach(key => {
      const control = this.articleForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string, lang?: string): string {
    const formGroup = lang 
      ? this.getTranslationFormGroup(lang)
      : this.articleForm;
    
    const field = formGroup.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  isLanguageFormValid(lang: string): boolean {
    return this.getTranslationFormGroup(lang).valid;
  }

  isLanguageFormTouched(lang: string): boolean {
    const group = this.getTranslationFormGroup(lang);
    return Object.keys(group.controls).some(key => group.get(key)?.touched);
  }

  hasTranslation(lang: string): boolean {
    const group = this.getTranslationFormGroup(lang);
    const title = group.get('title')?.value;
    const content = group.get('content')?.value;
    return !!(title && content);
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getCategories(): string[] {
    return ['Research', 'Environment', 'Development', 'Technology', 'Collaboration'];
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || '';
  }
}
