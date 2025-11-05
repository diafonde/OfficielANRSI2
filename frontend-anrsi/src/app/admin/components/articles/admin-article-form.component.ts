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

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      excerpt: ['', [Validators.required, Validators.minLength(20)]],
      author: ['', [Validators.required]],
      publishDate: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tags: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.articleId = +params['id'];
        this.loadArticle();
      }
    });
  }

  private loadArticle(): void {
    if (this.articleId) {
      this.articleService.getArticleById(this.articleId).subscribe(article => {
        if (article) {
          this.articleForm.patchValue({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            author: article.author,
            publishDate: this.formatDateForInput(article.publishDate),
            imageUrl: article.imageUrl,
            category: article.category,
            tags: article.tags.join(', ')
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.articleForm.value;
      const articleData = {
        ...formValue,
        publishDate: new Date(formValue.publishDate),
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
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

  getFieldError(fieldName: string): string {
    const field = this.articleForm.get(fieldName);
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

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getCategories(): string[] {
    return ['Research', 'Environment', 'Development', 'Technology', 'Collaboration'];
  }
}
