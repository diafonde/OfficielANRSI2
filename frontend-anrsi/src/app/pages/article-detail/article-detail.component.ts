import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Article, ArticleTranslation } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: Article | undefined;
  articleParagraphs: string[] = [];
  relatedArticles: Article[] = [];
  articleNotFound = false;
  loading = true;
  currentLang = 'fr';
  private langSubscription?: Subscription;

  // Translated content
  displayTitle = '';
  displayContent = '';
  displayExcerpt = '';
  safeContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updateTranslatedContent();
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Article ID:', id); // Debug log
      
      if (id) {
        this.loading = true;
        this.articleNotFound = false;
        
        this.articleService.getArticleById(+id).subscribe({
          next: (article) => {
            console.log('Article found:', article); // Debug log
            this.article = article;
            this.loading = false;
            
            if (this.article) {
              this.updateTranslatedContent();
              
              // Find related articles
              this.articleService.getAllArticles().subscribe((articles: Article[]) => {
                this.relatedArticles = articles
                  .filter((a: Article) => a.id !== this.article?.id)
                  .filter((a: Article) => 
                    a.category === this.article?.category || 
                    a.tags.some((tag: string) => this.article?.tags.includes(tag))
                  )
                  .slice(0, 3);
              });
            } else {
              this.articleNotFound = true;
            }
          },
          error: (error) => {
            console.error('Error loading article:', error); // Debug log
            this.loading = false;
            this.articleNotFound = true;
          }
        });
      } else {
        this.loading = false;
        this.articleNotFound = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  /**
   * Get translated content for the current language, with fallback to default
   */
  private updateTranslatedContent(): void {
    if (!this.article) return;

    const translation = this.getTranslation(this.article, this.currentLang);
    
    this.displayTitle = translation.title;
    this.displayContent = translation.content;
    this.displayExcerpt = translation.excerpt;
    
    // Sanitize and format content for safe HTML rendering
    // Convert line breaks to <br> tags and preserve paragraphs
    const formattedContent = this.formatContent(this.displayContent);
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(formattedContent);
    
    // Create paragraphs from content (for backward compatibility if needed)
    this.articleParagraphs = this.displayContent.split('\n\n').filter(p => p.trim() !== '');
  }

  /**
   * Format content by converting line breaks to HTML
   */
  private formatContent(content: string): string {
    if (!content) return '';
    
    // First, replace double line breaks with paragraph separators
    let formatted = content.replace(/\n\n+/g, '|||PARAGRAPH|||');
    
    // Then replace single line breaks with <br> tags
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Split by paragraph markers and wrap each in <p> tags
    const paragraphs = formatted.split('|||PARAGRAPH|||')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p>${p}</p>`);
    
    // If no paragraphs were created, wrap the whole content
    if (paragraphs.length === 0) {
      return `<p>${formatted}</p>`;
    }
    
    return paragraphs.join('');
  }

  /**
   * Get translation for a specific language, with fallback to default article fields
   */
  private getTranslation(article: Article, lang: string): ArticleTranslation {
    // Try to get translation for the requested language
    if (article.translations && article.translations[lang as 'fr' | 'ar' | 'en']) {
      return article.translations[lang as 'fr' | 'ar' | 'en']!;
    }
    
    // Fallback to default article fields
    return {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt
    };
  }

  /**
   * Get translated title for an article (used for related articles)
   */
  getTranslatedTitle(article: Article): string {
    const translation = this.getTranslation(article, this.currentLang);
    return translation.title;
  }

  onImageError(event: any) {
    // Fallback to a default image if the original fails to load
    event.target.src = 'assets/images/article1.jpeg';
  }

  /**
   * Get file name from URL
   */
  getFileNameFromUrl(url: string | null | undefined): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1] || url;
  }

  /**
   * Get file type icon class based on file extension
   */
  getFileIconClass(url: string | null | undefined): string {
    if (!url) return 'fa-file';
    const fileName = this.getFileNameFromUrl(url).toLowerCase();
    if (fileName.endsWith('.pdf')) return 'fa-file-pdf';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'fa-file-word';
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return 'fa-file-excel';
    if (fileName.endsWith('.txt')) return 'fa-file-alt';
    return 'fa-file';
  }

  /**
   * Get all images for the article (combines imageUrl and images array)
   */
  getAllImages(): string[] {
    if (!this.article) return [];
    
    const images: string[] = [];
    
    // Add the main imageUrl if it exists
    if (this.article.imageUrl) {
      images.push(this.article.imageUrl);
    }
    
    // Add all images from the images array, avoiding duplicates
    if (this.article.images && this.article.images.length > 0) {
      this.article.images.forEach(img => {
        const normalizedImg = this.normalizeImageUrl(img);
        // Only add if it's not already in the array (avoid duplicates)
        if (!images.includes(normalizedImg)) {
          images.push(normalizedImg);
        }
      });
    }
    
    return images;
  }

  /**
   * Normalize image URL to handle different formats
   */
  private normalizeImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return 'assets/images/article1.jpeg';
    }

    // If it's already a full URL (http/https), use it as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it starts with /uploads/, it's already a valid backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return imageUrl;
    }
    // If it starts with uploads/ (no leading slash), add the slash
    if (imageUrl.startsWith('uploads/')) {
      return '/' + imageUrl;
    }
    // If it's an assets path, keep it as-is
    if (imageUrl.startsWith('assets/')) {
      return imageUrl;
    }
    // For any other relative path, ensure it starts with /
    if (!imageUrl.startsWith('/')) {
      return '/' + imageUrl;
    }
    
    return imageUrl;
  }
}