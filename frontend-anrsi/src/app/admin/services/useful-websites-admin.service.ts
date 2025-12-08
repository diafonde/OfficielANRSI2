import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface UsefulWebsite {
  id?: number;
  name: string;
  url: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UsefulWebsitesAdminService {
  private readonly apiUrl = `${environment.apiUrl}/useful-websites`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAll(): Observable<UsefulWebsite[]> {
    return this.http.get<UsefulWebsite[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<UsefulWebsite> {
    return this.http.get<UsefulWebsite>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(website: Omit<UsefulWebsite, 'id' | 'createdAt' | 'updatedAt'>): Observable<UsefulWebsite> {
    return this.http.post<UsefulWebsite>(this.apiUrl, website, {
      headers: this.getHeaders()
    });
  }

  update(id: number, website: Partial<UsefulWebsite>): Observable<UsefulWebsite> {
    return this.http.put<UsefulWebsite>(`${this.apiUrl}/${id}`, website, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  reorder(websites: { id: number; order: number }[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reorder`, { websites }, {
      headers: this.getHeaders()
    });
  }
}


