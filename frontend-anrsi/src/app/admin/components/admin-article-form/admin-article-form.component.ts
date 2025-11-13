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
      
      // Prepare data for backend
      const articleData: any = {
        author: formValue.author,
        publishDate: new Date(formValue.publishDate),
        imageUrl: formValue.imageUrl,
        category: formValue.category,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        featured: formValue.featured || false,
        published: formValue.published !== false,
        translations: translationsToSave
      };

      const operation = this.isEditMode && this.articleId
        ? this.articleService.updateArticle(this.articleId, articleData)
        : this.articleService.createArticle(articleData);

      operation.subscribe({
        next: (article) => {
          this.isLoading = false;
          this.router.navigate(['/admin/articles']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while saving the article';
          console.error('Error saving article:', error);
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
