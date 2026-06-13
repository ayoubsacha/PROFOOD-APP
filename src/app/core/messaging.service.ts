import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, Conversation, Message } from './api.models';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly http = inject(HttpClient);

  listConversations(): Observable<Conversation[]> {
    return this.http
      .get<ApiResponse<Conversation[]>>(`${API_BASE_URL}/messages/conversations`)
      .pipe(map((response) => response.data));
  }

  listMessages(conversationId: string): Observable<Message[]> {
    return this.http
      .get<ApiResponse<Message[]>>(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`)
      .pipe(map((response) => response.data));
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    return this.http
      .post<ApiResponse<Message>>(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`, {
        content,
      })
      .pipe(map((response) => response.data));
  }
}
