import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Article } from '../models/article.model';
import { Observable, map, catchError, throwError, of } from 'rxjs';

interface ArticleTranslationDTO {
  language: string;
  title: string;
  content: string;
  excerpt: string;
}

interface ArticleDTO {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string; // ISO string from backend
  imageUrl: string;
  attachmentUrl?: string;
  images?: string[];
  category: string;
  tags: string[];
  featured?: boolean;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  translations?: {
    fr?: ArticleTranslationDTO;
    ar?: ArticleTranslationDTO;
    en?: ArticleTranslationDTO;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly apiUrl = '/api/articles';

  constructor(private http: HttpClient) {}

  /**
   * Convert backend DTO to frontend Article model
   */
  private mapToArticle(dto: ArticleDTO): Article {
    return {
      id: dto.id,
      title: dto.title,
      content: dto.content,
      excerpt: dto.excerpt,
      author: dto.author,
      publishDate: new Date(dto.publishDate),
      imageUrl: this.normalizeImageUrl(dto.imageUrl),
      attachmentUrl: dto.attachmentUrl ? this.normalizeAttachmentUrl(dto.attachmentUrl) : undefined,
      images: dto.images ? dto.images.map(img => this.normalizeImageUrl(img)) : [],
      category: dto.category || '',
      tags: dto.tags || [],
      featured: dto.featured || false,
      published: dto.published !== false,
      translations: dto.translations || undefined
    };
  }

  /**
   * Normalize image URL to handle different formats from backend
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

  /**
   * Normalize attachment URL to handle different formats from backend
   */
  private normalizeAttachmentUrl(attachmentUrl: string | null | undefined): string | undefined {
    if (!attachmentUrl) {
      return undefined;
    }

    // If it's already a full URL (http/https), use it as-is
    if (attachmentUrl.startsWith('http://') || attachmentUrl.startsWith('https://')) {
      return attachmentUrl;
    }
    // If it starts with /uploads/, it's already a valid backend URL
    if (attachmentUrl.startsWith('/uploads/')) {
      return attachmentUrl;
    }
    // If it starts with uploads/ (no leading slash), add the slash
    if (attachmentUrl.startsWith('uploads/')) {
      return '/' + attachmentUrl;
    }
    // For any other relative path, ensure it starts with /
    if (!attachmentUrl.startsWith('/')) {
      return '/' + attachmentUrl;
    }
    
    return attachmentUrl;
  }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<ArticleDTO[]>(this.apiUrl).pipe(
      map((dtos) => dtos.map(dto => this.mapToArticle(dto))),
      catchError((error) => {
        console.error('Error fetching articles:', error);
        return throwError(() => error);
      })
    );
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.http.get<ArticleDTO[]>(`${this.apiUrl}/featured`).pipe(
      map((dtos) => dtos.map(dto => this.mapToArticle(dto))),
      catchError((error) => {
        console.error('Error fetching featured articles:', error);
        return throwError(() => error);
      })
    );
  }

  getRecentArticles(): Observable<Article[]> {
    return this.http.get<ArticleDTO[]>(`${this.apiUrl}/recent`).pipe(
      map((dtos) => dtos.map(dto => this.mapToArticle(dto))),
      catchError((error) => {
        console.error('Error fetching recent articles:', error);
        return throwError(() => error);
      })
    );
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.http.get<ArticleDTO>(`${this.apiUrl}/${id}`).pipe(
      map((dto) => this.mapToArticle(dto)),
      catchError((error) => {
        if (error.status === 404) {
          // Article not found - return undefined instead of throwing
          return of(undefined);
        }
        console.error(`Error fetching article ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  searchArticles(searchTerm: string): Observable<Article[]> {
    return this.http.get<ArticleDTO[]>(`${this.apiUrl}/search`, {
      params: { q: searchTerm }
    }).pipe(
      map((dtos) => dtos.map(dto => this.mapToArticle(dto))),
      catchError((error) => {
        console.error('Error searching articles:', error);
        return throwError(() => error);
      })
    );
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    return this.http.get<ArticleDTO[]>(`${this.apiUrl}/category/${encodeURIComponent(category)}`).pipe(
      map((dtos) => dtos.map(dto => this.mapToArticle(dto))),
      catchError((error) => {
        console.error(`Error fetching articles by category ${category}:`, error);
        return throwError(() => error);
      })
    );
  }
}