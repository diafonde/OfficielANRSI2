import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
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

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private translate: TranslateService
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
    
    // Create paragraphs from content
    this.articleParagraphs = this.displayContent.split('\n\n').filter(p => p.trim() !== '');
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
}