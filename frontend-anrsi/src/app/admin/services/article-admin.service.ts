import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map, catchError, throwError, switchMap } from 'rxjs';
import { Article } from '../../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleAdminService {
  private readonly apiUrl = '/api/articles';
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
    
    console.log('Uploading image to:', `/api/upload/image`);
    console.log('Has token:', !!token);
    
    return this.http.post<{ url: string; filename: string }>(`/api/upload/image`, formData, { 
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
    // Backend expects: { title, content, excerpt, author, publishDate, imageUrl, category, tags, featured, published }
    // Frontend sends: { author, category, translations: { fr: {...}, ar: {...}, en: {...} }, ... }
    
    // Use first available translation for main fields (prefer fr, then ar, then en)
    const translations = articleData.translations || {};
    const firstTranslation = translations.fr || translations.ar || translations.en || {};
    
    // Prepare data for backend
    const backendData = {
      title: firstTranslation.title || '',
      content: firstTranslation.content || '',
      excerpt: firstTranslation.excerpt || '',
      author: articleData.author,
      publishDate: articleData.publishDate,
      imageUrl: articleData.imageUrl,
      category: articleData.category,
      tags: articleData.tags || [],
      featured: articleData.featured || false,
      published: articleData.published !== false
    };
    
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
    const firstTranslation = translations.fr || translations.ar || translations.en || {};
    
    // Prepare data for backend
    const backendData = {
      title: firstTranslation.title || '',
      content: firstTranslation.content || '',
      excerpt: firstTranslation.excerpt || '',
      author: articleData.author,
      publishDate: articleData.publishDate,
      imageUrl: articleData.imageUrl,
      category: articleData.category,
      tags: articleData.tags || [],
      featured: articleData.featured || false,
      published: articleData.published !== false
    };
    
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
