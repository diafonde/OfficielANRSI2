import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = '/api/contact';

  constructor(private http: HttpClient) {}

  submitContactMessage(message: ContactMessage): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(this.apiUrl, message);
  }
}


