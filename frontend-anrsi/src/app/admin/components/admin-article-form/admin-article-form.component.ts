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
  
  // Image upload properties
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  imageUrlFallback = '';
  
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
      imageUrl: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      featured: [false],
      published: [true],
      
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
            category: article.category,
            tags: article.tags?.join(', ') || '',
            featured: article.featured || false,
            published: article.published !== false
          });
          
          // Set image preview if imageUrl exists
          if (article.imageUrl) {
            this.imagePreview = article.imageUrl;
            this.imageUrlFallback = article.imageUrl;
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
      const file = input.files[0];
      
      // Clear previous errors
      this.errorMessage = '';
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 10MB';
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }
      
      this.imageFile = file;
      this.imageUrlFallback = '';
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Upload file
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';
    
    console.log('Starting image upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    // Simulate progress (in real implementation, you'd use HttpEventType.UPLOAD_PROGRESS)
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);
    
    this.articleService.uploadImage(file).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        console.log('Upload successful:', response);
        this.articleForm.patchValue({ imageUrl: response.url });
        setTimeout(() => {
          this.isUploading = false;
          this.uploadProgress = 0;
        }, 500);
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isUploading = false;
        this.uploadProgress = 0;
        
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
        // Don't clear the file and preview on error - let user try again
      }
    });
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
    this.imageUrlFallback = '';
    this.articleForm.patchValue({ imageUrl: '' });
    // Reset file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onUrlInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageUrlFallback = input.value;
  }

  onUrlInput(): void {
    if (this.imageUrlFallback && this.imageUrlFallback.trim()) {
      const trimmedUrl = this.imageUrlFallback.trim();
      this.articleForm.patchValue({ imageUrl: trimmedUrl });
      this.imagePreview = trimmedUrl;
      this.imageFile = null;
      this.imageUrlFallback = trimmedUrl;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

    if (this.articleForm.get('author')?.valid && 
        this.articleForm.get('publishDate')?.valid &&
        this.articleForm.get('imageUrl')?.valid &&
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
      
      // Prepare data for backend
      const articleData: any = {
        author: formValue.author,
        publishDate: publishDate,
        imageUrl: formValue.imageUrl,
        category: formValue.category,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        featured: formValue.featured || false,
        published: formValue.published !== false,
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
