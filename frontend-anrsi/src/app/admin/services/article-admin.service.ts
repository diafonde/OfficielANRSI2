import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map, catchError, throwError, switchMap } from 'rxjs';
import { Article } from '../../models/article.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleAdminService {
  private readonly apiUrl = `${environment.apiUrl}/articles`;
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load articles from backend on initialization
    this.loadArticlesFromBackend();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private loadArticlesFromBackend(): void {
    this.getAllArticles().subscribe({
      next: (articles) => {
        this.articlesSubject.next(articles);
      },
      error: (error) => {
        console.error('Error loading articles from backend:', error);
        // Fallback to empty array on error
        this.articlesSubject.next([]);
      }
    });
  }

  uploadImage(file: File): Observable<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Get auth token if available
    const token = localStorage.getItem('admin_token');
    let headers = new HttpHeaders();
    
    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log('Uploading image to:', `${environment.apiUrl}/upload/image`);
    console.log('Has token:', !!token);
    
    return this.http.post<{ url: string; filename: string }>(`${environment.apiUrl}/upload/image`, formData, { 
      headers,
      reportProgress: false
    });
  }

  uploadDocument(file: File): Observable<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Get auth token if available
    const token = localStorage.getItem('admin_token');
    let headers = new HttpHeaders();
    
    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log('Uploading document to:', `${environment.apiUrl}/upload/document`);
    console.log('Has token:', !!token);
    
    return this.http.post<{ url: string; filename: string }>(`${environment.apiUrl}/upload/document`, formData, { 
      headers,
      reportProgress: false
    });
  }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/admin/all`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((articles) => {
        // Update local cache
        this.articlesSubject.next(articles);
        return articles;
      }),
      catchError((error) => {
        console.error('Error fetching articles:', error);
        return throwError(() => error);
      })
    );
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((article) => article),
      catchError((error) => {
        console.error('Error fetching article:', error);
        return throwError(() => error);
      })
    );
  }

  createArticle(articleData: any): Observable<Article> {
    // Transform translations to backend format
    // Backend now expects: { translations: { "fr": {...}, "ar": {...}, "en": {...} }, author, publishDate, ... }
    // Frontend sends: { author, category, translations: { fr: {...}, ar: {...}, en: {...} }, ... }
    
    const translations = articleData.translations || {};
    
    // Prepare translations map for backend
    const translationsMap: any = {};
    if (translations.fr) {
      translationsMap.fr = {
        language: 'fr',
        title: translations.fr.title || '',
        content: translations.fr.content || '',
        excerpt: translations.fr.excerpt || ''
      };
    }
    if (translations.ar) {
      translationsMap.ar = {
        language: 'ar',
        title: translations.ar.title || '',
        content: translations.ar.content || '',
        excerpt: translations.ar.excerpt || ''
      };
    }
    if (translations.en) {
      translationsMap.en = {
        language: 'en',
        title: translations.en.title || '',
        content: translations.en.content || '',
        excerpt: translations.en.excerpt || ''
      };
    }
    
    // Prepare data for backend
    const backendData: any = {
      author: articleData.author,
      publishDate: articleData.publishDate,
      imageUrl: articleData.imageUrl,
      attachmentUrl: articleData.attachmentUrl || null,
      images: articleData.images || [],
      featured: articleData.featured || false,
      published: articleData.published !== false
    };
    
    // Add translations if available
    if (Object.keys(translationsMap).length > 0) {
      backendData.translations = translationsMap;
    }
    
    console.log('Creating article with data:', backendData);
    
    return this.http.post<Article>(this.apiUrl, backendData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((createdArticle) => {
        // Update local cache
        const currentArticles = this.articlesSubject.value;
        this.articlesSubject.next([...currentArticles, createdArticle]);
        return createdArticle;
      }),
      catchError((error) => {
        console.error('Error creating article:', error);
        return throwError(() => error);
      })
    );
  }

  updateArticle(id: number, articleData: any): Observable<Article> {
    // Transform translations to backend format
    const translations = articleData.translations || {};
    
    // Prepare translations map for backend
    const translationsMap: any = {};
    if (translations.fr) {
      translationsMap.fr = {
        language: 'fr',
        title: translations.fr.title || '',
        content: translations.fr.content || '',
        excerpt: translations.fr.excerpt || ''
      };
    }
    if (translations.ar) {
      translationsMap.ar = {
        language: 'ar',
        title: translations.ar.title || '',
        content: translations.ar.content || '',
        excerpt: translations.ar.excerpt || ''
      };
    }
    if (translations.en) {
      translationsMap.en = {
        language: 'en',
        title: translations.en.title || '',
        content: translations.en.content || '',
        excerpt: translations.en.excerpt || ''
      };
    }
    
    // Prepare data for backend
    const backendData: any = {
      author: articleData.author,
      publishDate: articleData.publishDate,
      imageUrl: articleData.imageUrl,
      attachmentUrl: articleData.attachmentUrl || null,
      images: articleData.images || [],
      featured: articleData.featured || false,
      published: articleData.published !== false
    };
    
    // Add translations if available
    if (Object.keys(translationsMap).length > 0) {
      backendData.translations = translationsMap;
    }
    
    console.log('Updating article with data:', backendData);
    
    return this.http.put<Article>(`${this.apiUrl}/${id}`, backendData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((updatedArticle) => {
        // Update local cache
        const currentArticles = this.articlesSubject.value;
        const index = currentArticles.findIndex(a => a.id === updatedArticle.id);
        if (index !== -1) {
          currentArticles[index] = updatedArticle;
        } else {
          currentArticles.push(updatedArticle);
        }
        this.articlesSubject.next([...currentArticles]);
        return updatedArticle;
      }),
      catchError((error) => {
        console.error('Error updating article:', error);
        return throwError(() => error);
      })
    );
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(() => {
        // Update local cache
        const currentArticles = this.articlesSubject.value;
        const filteredArticles = currentArticles.filter(a => a.id !== id);
        this.articlesSubject.next(filteredArticles);
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting article:', error);
        return throwError(() => error);
      })
    );
  }

  toggleFeatured(id: number, featured: boolean): Observable<Article> {
    // Get the current article first, then update it
    return this.getArticleById(id).pipe(
      switchMap((article) => {
        if (!article) {
          throw new Error('Article not found');
        }
        // Update the article with new featured status
        const updateData = {
          ...article,
          featured: featured
        };
        // Use updateArticle to persist the change
        return this.updateArticle(id, updateData);
      }),
      catchError((error) => {
        console.error('Error toggling featured status:', error);
        return throwError(() => error);
      })
    );
  }
}
