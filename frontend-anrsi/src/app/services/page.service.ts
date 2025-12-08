import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PageTranslationDTO {
  id?: number;
  language: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  content?: string;
}

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
  translations?: { [key: string]: PageTranslationDTO };
}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(private http: HttpClient) {}

  getPageBySlug(slug: string): Observable<PageDTO> {
    return this.http.get<PageDTO>(`${this.apiUrl}/${slug}`);
  }

  getAllPublishedPages(): Observable<PageDTO[]> {
    return this.http.get<PageDTO[]>(this.apiUrl);
  }
}



