import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface PageTranslationDTO {
  id?: number;
  language?: string;
  title?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  sectionTitle?: string;
  introText?: string;
  description?: string;
  content?: string;
  extra?: string; // JSONB pour listes complexes
}

export interface PageDTO {
  id?: number;
  slug: string;
  title?: string; // Backward compatibility
  heroTitle?: string; // Backward compatibility
  heroSubtitle?: string; // Backward compatibility
  heroImageUrl?: string;
  content?: string; // Backward compatibility
  pageType: 'SIMPLE' | 'LIST' | 'STRUCTURED' | 'FAQ';
  ordre?: number;
  parentId?: number;
  metadata?: string; // Backward compatibility
  isPublished?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  translations?: { [key: string]: PageTranslationDTO };
}

export interface PageCreateDTO {
  slug: string;
  pageType: 'SIMPLE' | 'LIST' | 'STRUCTURED' | 'FAQ';
  ordre?: number;
  parentId?: number;
  heroImageUrl?: string;
  translations: { [key: string]: PageTranslationDTO }; // key = 'fr', 'ar', 'en'
  isPublished?: boolean;
  isActive?: boolean;
}

export interface PageUpdateDTO {
  slug?: string;
  pageType?: 'SIMPLE' | 'LIST' | 'STRUCTURED' | 'FAQ';
  ordre?: number;
  parentId?: number;
  heroImageUrl?: string;
  translations?: { [key: string]: PageTranslationDTO }; // key = 'fr', 'ar', 'en'
  isPublished?: boolean;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PageAdminService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  getAllPages(): Observable<PageDTO[]> {
    return this.http.get<PageDTO[]>(`${this.apiUrl}/admin/all`, {
      headers: this.getHeaders()
    });
  }

  getPageById(id: number): Observable<PageDTO> {
    return this.http.get<PageDTO>(`${this.apiUrl}/admin/${id}`, {
      headers: this.getHeaders()
    });
  }

  getPageBySlug(slug: string): Observable<PageDTO> {
    return this.http.get<PageDTO>(`${this.apiUrl}/admin/slug/${slug}`, {
      headers: this.getHeaders()
    });
  }

  createPage(pageData: PageCreateDTO): Observable<PageDTO> {
    return this.http.post<PageDTO>(this.apiUrl, pageData, {
      headers: this.getHeaders()
    });
  }

  updatePage(id: number, pageData: PageUpdateDTO): Observable<PageDTO> {
    return this.http.put<PageDTO>(`${this.apiUrl}/${id}`, pageData, {
      headers: this.getHeaders()
    });
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  publishPage(id: number): Observable<PageDTO> {
    return this.http.put<PageDTO>(`${this.apiUrl}/${id}/publish`, {}, {
      headers: this.getHeaders()
    });
  }

  unpublishPage(id: number): Observable<PageDTO> {
    return this.http.put<PageDTO>(`${this.apiUrl}/${id}/unpublish`, {}, {
      headers: this.getHeaders()
    });
  }

  togglePageStatus(id: number): Observable<PageDTO> {
    return this.http.put<PageDTO>(`${this.apiUrl}/${id}/toggle`, {}, {
      headers: this.getHeaders()
    });
  }

  getAllSlugs(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/admin/slugs`, {
      headers: this.getHeaders()
    });
  }

  getAvailablePageTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/admin/types`, {
      headers: this.getHeaders()
    });
  }
}



