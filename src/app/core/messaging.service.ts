import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ApiResponse, Conversation, ConversationThread, Message } from './api.models';

export interface SendMessagePayload {
  productId: string;
  subject: string;
  body: string;
}

export interface ReplyMessagePayload {
  body: string;
}

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private readonly http = inject(HttpClient);

  contactFournisseur(productId: string, subject: string, body: string): Observable<Conversation> {
    return this.http
      .post<ApiResponse<Conversation>>(`${API_BASE_URL}/messages/contact-fournisseur`, {
        productId,
        subject,
        body,
      } satisfies SendMessagePayload)
      .pipe(map((response) => response.data));
  }

  getInbox(): Observable<Conversation[]> {
    return this.http
      .get<ApiResponse<Conversation[]>>(`${API_BASE_URL}/messages/inbox`)
      .pipe(map((response) => response.data));
  }

  listConversations(): Observable<Conversation[]> {
    return this.getInbox();
  }

  getConversation(conversationId: string): Observable<ConversationThread> {
    return this.http
      .get<ApiResponse<ConversationThread>>(`${API_BASE_URL}/messages/conversations/${conversationId}`)
      .pipe(map((response) => response.data));
  }

  listMessages(conversationId: string): Observable<Message[]> {
    return this.http
      .get<ApiResponse<Message[]>>(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`)
      .pipe(map((response) => response.data));
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    return this.replyToConversation(conversationId, content);
  }

  replyToConversation(conversationId: string, body: string): Observable<Message> {
    return this.http
      .post<ApiResponse<Message>>(
        `${API_BASE_URL}/messages/conversations/${conversationId}/reply`,
        { body } satisfies ReplyMessagePayload,
      )
      .pipe(map((response) => response.data));
  }

  markConversationAsRead(conversationId: string): Observable<{ modifiedCount: number }> {
    return this.http
      .patch<ApiResponse<{ modifiedCount: number }>>(
        `${API_BASE_URL}/messages/conversations/${conversationId}/read`,
        {},
      )
      .pipe(map((response) => response.data));
  }
}
