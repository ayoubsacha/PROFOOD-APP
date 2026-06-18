import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { AuthService } from './auth.service';

const ASSISTANT_API_URL = `${API_BASE_URL}/assistant`;

export interface AssistantSourceChunk {
  source?: string | null;
  page?: number | null;
  doc_type?: string | null;
  preview: string;
  metadata: Record<string, unknown>;
}

export interface AssistantAskRequest {
  question: string;
  session_id?: string | null;
  specialist?: string;
  k?: number | null;
  filters?: Record<string, unknown> | null;
}

export interface AssistantAskResponse {
  answer: string;
  sources: AssistantSourceChunk[];
  session_id: string | null;
}

export interface AssistantImageAskResponse extends AssistantAskResponse {
  image_description: string;
}

export interface AssistantVoiceTranscribeResponse {
  transcript: string;
}

export interface AssistantTtsSpeakResponse {
  audio_url: string;
}

export interface AssistantAskStreamRequest extends AssistantAskRequest {
  voice_mode?: boolean;
}

export interface AssistantAskStreamHandlers {
  session?: (sessionId: string) => void;
  chunk?: (text: string) => void;
  sources?: (sources: AssistantSourceChunk[]) => void;
  done?: (sessionId?: string) => void;
}

export interface AssistantChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources: AssistantSourceChunk[];
  created_at: string;
  specialist?: string | null;
}

export interface AssistantChatSessionSummary {
  id: string;
  title: string;
  user_id: string;
  specialist?: string | null;
  message_count: number;
  last_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssistantChatSession extends AssistantChatSessionSummary {
  messages: AssistantChatMessage[];
}

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  ask(payload: AssistantAskRequest): Observable<AssistantAskResponse> {
    return this.http.post<AssistantAskResponse>(`${ASSISTANT_API_URL}/ask`, {
      question: payload.question,
      k: payload.k ?? 4,
      filters: payload.filters ?? null,
      session_id: payload.session_id || null,
      specialist: payload.specialist || 'general',
    });
  }

  askImage(
    imageFile: File,
    question: string,
    optionsOrSessionId: Omit<AssistantAskRequest, 'question' | 'filters'> | string | null = {},
    specialist = 'general',
  ): Observable<AssistantImageAskResponse> {
    const options =
      typeof optionsOrSessionId === 'string' || optionsOrSessionId === null
        ? { session_id: optionsOrSessionId, specialist }
        : optionsOrSessionId;
    const formData = new FormData();

    formData.append('file', imageFile, imageFile.name);
    formData.append('question', question);
    formData.append('k', String(options.k ?? 4));
    formData.append('specialist', options.specialist || 'general');

    if (options.session_id) {
      formData.append('session_id', options.session_id);
    }

    return this.http.post<AssistantImageAskResponse>(`${ASSISTANT_API_URL}/image/ask`, formData);
  }

  transcribeVoice(audioBlob: Blob, _token?: string): Observable<AssistantVoiceTranscribeResponse> {
    const formData = new FormData();
    const extension = this.getAudioExtension(audioBlob.type);

    formData.append('file', audioBlob, `voice-question.${extension}`);

    return this.http.post<AssistantVoiceTranscribeResponse>(
      `${ASSISTANT_API_URL}/voice/transcribe`,
      formData,
    );
  }

  speakText(text: string): Observable<AssistantTtsSpeakResponse> {
    return this.http.post<AssistantTtsSpeakResponse>(`${ASSISTANT_API_URL}/tts/speak`, { text });
  }

  createSession(title?: string, specialist = 'general'): Observable<AssistantChatSession> {
    return this.http.post<AssistantChatSession>(`${ASSISTANT_API_URL}/sessions`, {
      title: title || null,
      specialist,
    });
  }

  getSessions(): Observable<AssistantChatSessionSummary[]> {
    return this.http.get<AssistantChatSessionSummary[]>(`${ASSISTANT_API_URL}/sessions`);
  }

  getSession(sessionId: string): Observable<AssistantChatSession> {
    return this.http.get<AssistantChatSession>(`${ASSISTANT_API_URL}/sessions/${sessionId}`);
  }

  deleteSession(sessionId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${ASSISTANT_API_URL}/sessions/${sessionId}`);
  }

  getGatewayAudioUrl(audioUrl?: string | null): string | null {
    if (!audioUrl) {
      return null;
    }

    if (audioUrl.startsWith('/static/')) {
      return `${ASSISTANT_API_URL}${audioUrl}`;
    }

    return audioUrl;
  }

  getAbsoluteAudioUrl(audioUrl?: string | null): string | null {
    return this.getGatewayAudioUrl(audioUrl);
  }

  async streamAsk(
    payload: AssistantAskStreamRequest,
    handlers: AssistantAskStreamHandlers,
    signal?: AbortSignal,
  ): Promise<void> {
    const token = this.authService.token();

    if (!token) {
      throw new Error('Missing authentication token.');
    }

    const response = await fetch(`${ASSISTANT_API_URL}/ask/stream`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: payload.question,
        k: payload.k ?? 4,
        filters: payload.filters ?? null,
        session_id: payload.session_id || null,
        specialist: payload.specialist || 'general',
        voice_mode: payload.voice_mode === true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    if (!response.body) {
      throw new Error('Streaming is not supported by this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
      buffer = this.processSseBuffer(buffer, handlers);
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      this.processSseBuffer(`${buffer}\n\n`, handlers);
    }
  }

  private processSseBuffer(buffer: string, handlers: AssistantAskStreamHandlers): string {
    const events = buffer.split('\n\n');
    const remainder = events.pop() || '';

    for (const rawEvent of events) {
      this.handleSseEvent(rawEvent, handlers);
    }

    return remainder;
  }

  private handleSseEvent(rawEvent: string, handlers: AssistantAskStreamHandlers): void {
    const lines = rawEvent.split('\n');
    let eventType = 'message';
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    const dataText = dataLines.join('\n');
    const data = dataText ? JSON.parse(dataText) : {};

    switch (eventType) {
      case 'session':
        handlers.session?.(data.session_id);
        return;
      case 'chunk':
        handlers.chunk?.(data.text || '');
        return;
      case 'sources':
        handlers.sources?.(data.sources || []);
        return;
      case 'done':
        handlers.done?.(data.session_id);
        return;
      case 'error':
        throw new Error(data.message || 'Streaming failed.');
      default:
        return;
    }
  }

  private getAudioExtension(contentType: string): string {
    if (contentType.includes('ogg')) return 'ogg';
    if (contentType.includes('mp4')) return 'mp4';
    if (contentType.includes('mpeg') || contentType.includes('mp3')) return 'mp3';
    if (contentType.includes('wav')) return 'wav';

    return 'webm';
  }
}
