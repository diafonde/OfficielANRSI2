import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: Article | undefined;
  articleParagraphs: string[] = [];
  relatedArticles: Article[] = [];
  articleNotFound = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
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
              // Create paragraphs from content
              this.articleParagraphs = this.article.content.split('\n\n').filter(p => p.trim() !== '');
              
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

  onImageError(event: any) {
    // Fallback to a default image if the original fails to load
    event.target.src = 'assets/images/article1.jpeg';
  }
}