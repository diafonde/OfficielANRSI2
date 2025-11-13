import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface PageDTO {
  id?: number;
  slug: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  content?: string;
  pageType: 'SIMPLE' | 'LIST' | 'STRUCTURED' | 'FAQ';
  metadata?: string;
  isPublished?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PageCreateDTO {
  slug: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  content?: string;
  pageType: 'SIMPLE' | 'LIST' | 'STRUCTURED' | 'FAQ';
  metadata?: string;
  isPublished?: boolean;
  isActive?: boolean;
}

export interface PageUpdateDTO {
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  content?: string;
  pageType?: 'SIMPLE' | 'LIST' | 'STRUCTURED' | 'FAQ';
  metadata?: string;
  isPublished?: boolean;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PageAdminService {
  private apiUrl = '/api/pages';

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

