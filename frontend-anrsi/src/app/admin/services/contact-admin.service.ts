import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessageResponse } from '../../services/contact.service';

@Injectable({
  providedIn: 'root'
})
export class ContactAdminService {
  private readonly apiUrl = '/api/contact';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllMessages(): Observable<ContactMessageResponse[]> {
    return this.http.get<ContactMessageResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getUnreadMessages(): Observable<ContactMessageResponse[]> {
    return this.http.get<ContactMessageResponse[]>(`${this.apiUrl}/unread`, {
      headers: this.getAuthHeaders()
    });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/count`, {
      headers: this.getAuthHeaders()
    });
  }

  getMessageById(id: number): Observable<ContactMessageResponse> {
    return this.http.get<ContactMessageResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  markAsRead(id: number): Observable<ContactMessageResponse> {
    return this.http.put<ContactMessageResponse>(`${this.apiUrl}/${id}/read`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}

