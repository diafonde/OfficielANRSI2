import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = '/api/pages';

  constructor(private http: HttpClient) {}

  getPageBySlug(slug: string): Observable<PageDTO> {
    return this.http.get<PageDTO>(`${this.apiUrl}/${slug}`);
  }

  getAllPublishedPages(): Observable<PageDTO[]> {
    return this.http.get<PageDTO[]>(this.apiUrl);
  }
}



