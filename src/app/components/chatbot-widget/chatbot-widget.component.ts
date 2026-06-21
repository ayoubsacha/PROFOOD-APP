import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap, timeout } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import {
  AssistantChatSession as ChatSession,
  AssistantChatSessionSummary as ChatSessionSummary,
  AssistantService as ChatbotService,
  AssistantSourceChunk as SourceChunk,
  AssistantVoiceTranscribeResponse as VoiceTranscribeResponse
} from '../../core/assistant.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  sources?: SourceChunk[];
  specialist?: string | null;
  imagePreview?: string;
  imageDescription?: string;
  showImageDescription?: boolean;
}

interface ChatSpecialist {
  id: string;
  name: string;
  shortName: string;
  icon: string;
}

type VoiceRecordingMode = 'dictate' | 'voice-chat';

type VoicePlaybackItem =
  | { type: 'audio'; url: string; text: string }
  | { type: 'speech'; text: string };

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.scss'
})
export class ChatbotWidgetComponent implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  isOpen = false;
  loading = false;
  dictationLoading = false;
  voiceChatLoading = false;
  sessionsLoading = false;
  question = '';
  selectedImageFile: File | null = null;
  selectedImagePreview: string | null = null;
  statusMessage = '';
  recordingMode: VoiceRecordingMode | null = null;
  voiceConversationActive = false;
  assistantSpeaking = false;
  isSpecialistMenuOpen = false;

  currentSessionId: string | null = null;
  sessions: ChatSessionSummary[] = [];
  messages: ChatMessage[] = [];
  selectedSpecialist = 'general';
  readonly specialists: ChatSpecialist[] = [
    { id: 'general', name: 'Assistant Général ProFood', shortName: 'Général', icon: '🤖' },
    { id: 'food', name: 'Produits Alimentaires', shortName: 'Produits', icon: '🥫' },
    { id: 'equipment', name: 'Équipements Professionnels', shortName: 'Équipements', icon: '⚙️' },
    { id: 'supplier', name: 'Fournisseurs', shortName: 'Fournisseurs', icon: '🤝' },
    { id: 'services', name: 'Services', shortName: 'Services', icon: '🛠️' },
    { id: 'forum', name: 'Forum ProFood', shortName: 'Forum', icon: '💬' }
  ];
  private readonly allowedImageTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
  private readonly maxImageBytes = 5 * 1024 * 1024;
  private readonly silenceThreshold = 0.04;
  private readonly silenceDelayMs = 550;
  private readonly maxIdleRecordingMs = 2500;
  private readonly maxRecordingMs = 10000;
  private audioStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private assistantAudio: HTMLAudioElement | null = null;
  private assistantUtterance: SpeechSynthesisUtterance | null = null;
  private streamAbortController: AbortController | null = null;
  private textStreamAbortController: AbortController | null = null;
  private voiceRestartTimerId: number | null = null;
  private silenceFrameId: number | null = null;
  private speechDetected = false;
  private silenceStartedAt: number | null = null;
  private recordingStartedAt = 0;
  private shouldProcessRecording = true;
  private voiceLoopId = 0;
  private recordedChunks: Blob[] = [];
  private audioQueue: VoicePlaybackItem[] = [];
  private pendingSpeechText = '';
  private pendingTtsRequests = 0;
  private voiceStreamCompleted = false;
  private sessionsLoadedForToken: string | null = null;
  private readonly sessionCache = new Map<string, ChatSession>();

  constructor(
    private readonly authService: AuthService,
    private readonly chatbotService: ChatbotService,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    effect(() => {
      const token = this.authService.token();

      if (!token) {
        this.resetForLoggedOutUser();
        return;
      }

      if (this.sessionsLoadedForToken !== token) {
        this.sessionsLoadedForToken = token;
        this.loadSessions(true);
      }
    });
  }

  ngOnInit(): void {}

  get currentSessionTitle(): string {
    const session = this.sessions.find((item) => item.id === this.currentSessionId);
    return session?.title || 'New conversation';
  }

  get isBusy(): boolean {
    return this.loading || this.dictationLoading || this.voiceChatLoading;
  }

  get isAuthenticated(): boolean {
    return Boolean(this.authService.token());
  }

  get isVoiceActive(): boolean {
    return this.voiceConversationActive || this.recordingMode === 'voice-chat' || this.voiceChatLoading || this.assistantSpeaking;
  }

  get voiceStateLabel(): string {
    if (this.recordingMode === 'voice-chat') return 'A l ecoute';
    if (this.voiceChatLoading) return 'Traitement';
    if (this.assistantSpeaking) return 'Reponse vocale';
    if (this.voiceConversationActive) return 'Pret';

    return 'Mode vocal';
  }

  get displayName(): string {
    const user = this.authService.currentUser();
    const name = user?.name || user?.email?.split('@')[0] || 'user';

    return name.trim() || 'user';
  }

  get userInitial(): string {
    return this.displayName.charAt(0).toUpperCase();
  }

  get userProfileImage(): string | null {
    const image = this.authService.currentUser()?.profileImage?.trim();

    return image || null;
  }

  get showWelcomeState(): boolean {
    return this.messages.length === 0;
  }

  get selectedSpecialistName(): string {
    return this.getSpecialistLabel(this.selectedSpecialist);
  }

  getSpecialistLabel(specialistId?: string | null): string {
    const normalizedSpecialistId = this.normalizeSpecialistId(specialistId);
    const specialist = this.specialists.find((item) => item.id === normalizedSpecialistId) || this.specialists[0];

    return `${specialist.icon} ${specialist.shortName}`;
  }

  choosePrompt(prompt: string, specialist: string): void {
    this.selectedSpecialist = this.normalizeSpecialistId(specialist);
    this.isSpecialistMenuOpen = false;
    this.question = prompt;
  }

  toggleSpecialistMenu(): void {
    if (this.isBusy) return;

    this.isSpecialistMenuOpen = !this.isSpecialistMenuOpen;
  }

  selectSpecialist(specialistId: string): void {
    this.selectedSpecialist = this.normalizeSpecialistId(specialistId);
    this.isSpecialistMenuOpen = false;
  }

  toggleChat(): void {
    if (!this.isAuthenticated) return;

    this.isOpen = !this.isOpen;

    if (!this.isOpen) {
      this.abortTextStream();
      this.stopVoiceConversation();
      this.clearSelectedImage();

      if (this.recordingMode === 'dictate') {
        this.stopRecording(false);
      }
    }

    if (this.isOpen) {
      this.loadSessions(!this.currentSessionId);
      this.scrollToBottom();
    }
  }

  startNewSession(): void {
    if (this.loading) return;

    this.abortTextStream();
    this.stopVoiceConversation();
    this.clearSelectedImage();
    this.currentSessionId = null;
    this.messages = [];
    this.question = '';
    this.statusMessage = 'New session ready.';
    this.refreshMessagesView();
  }

  selectSession(sessionId: string): void {
    if (this.currentSessionId === sessionId || this.sessionsLoading) return;

    this.abortTextStream();
    this.stopVoiceConversation();
    this.clearSelectedImage();

    const cachedSession = this.sessionCache.get(sessionId);

    if (cachedSession) {
      this.applySession(cachedSession);
      return;
    }

    this.currentSessionId = sessionId;
    this.messages = [];
    this.statusMessage = 'Loading conversation...';
    this.sessionsLoading = true;

    this.chatbotService.getSession(sessionId).subscribe({
      next: (session) => this.applySession(session),
      error: (error: unknown) => this.handleSessionError(error),
      complete: () => (this.sessionsLoading = false)
    });
  }

  deleteCurrentSession(): void {
    if (!this.currentSessionId || this.sessionsLoading) return;

    this.abortTextStream();
    this.stopVoiceConversation();
    this.clearSelectedImage();
    const sessionId = this.currentSessionId;
    const previousSessions = [...this.sessions];
    const previousMessages = [...this.messages];
    const previousSession = this.sessionCache.get(sessionId);

    this.sessions = this.sessions.filter((session) => session.id !== sessionId);
    this.sessionCache.delete(sessionId);
    this.currentSessionId = null;
    this.messages = [];
    this.statusMessage = 'Session deleted.';
    this.refreshMessagesView();

    this.chatbotService.deleteSession(sessionId).subscribe({
      error: (error: unknown) => {
        if (previousSession) {
          this.sessionCache.set(sessionId, previousSession);
        }

        this.sessions = previousSessions;
        this.currentSessionId = sessionId;
        this.messages = previousMessages;
        this.handleSessionError(error);
      },
    });
  }

  submitChat(): void {
    this.isSpecialistMenuOpen = false;

    if (this.selectedImageFile) {
      this.sendImageMessage();
      return;
    }

    this.sendMessage();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const imageFile = input.files?.[0] || null;

    input.value = '';

    if (!imageFile) return;

    if (!this.allowedImageTypes.has(imageFile.type)) {
      this.statusMessage = 'Formats acceptes: PNG, JPG, JPEG ou WEBP.';
      this.clearSelectedImage();
      return;
    }

    if (imageFile.size > this.maxImageBytes) {
      this.statusMessage = 'Image trop grande. Taille maximale: 5MB.';
      this.clearSelectedImage();
      return;
    }

    this.clearSelectedImage();
    this.selectedImageFile = imageFile;
    this.selectedImagePreview = URL.createObjectURL(imageFile);
    this.statusMessage = '';
    this.changeDetector.detectChanges();
  }

  clearSelectedImage(revokePreview = true): void {
    if (revokePreview && this.selectedImagePreview) {
      URL.revokeObjectURL(this.selectedImagePreview);
    }

    this.selectedImageFile = null;
    this.selectedImagePreview = null;
    this.changeDetector.detectChanges();
  }

  sendMessage(): void {
    const cleanQuestion = this.question.trim();

    if (!cleanQuestion || this.isBusy || this.recordingMode || this.voiceConversationActive) return;

    if (!this.authService.token()) {
      this.messages.push({
        role: 'assistant',
        text: 'Vous devez vous connecter pour utiliser le chatbot ProFood.'
      });
      this.refreshMessagesView();

      return;
    }

    this.messages.push({
      role: 'user',
      text: cleanQuestion,
      specialist: this.selectedSpecialist
    });

    this.question = '';
    this.loading = true;
    this.statusMessage = '';

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      text: '',
      sources: [],
      specialist: this.selectedSpecialist
    };
    const abortController = new AbortController();

    this.messages.push(assistantMessage);
    this.textStreamAbortController = abortController;
    this.refreshMessagesView();

    void this.chatbotService.streamAsk(
      {
        question: cleanQuestion,
        k: 4,
        filters: null,
        session_id: this.currentSessionId,
        specialist: this.selectedSpecialist,
        voice_mode: false
      },
      {
        session: (sessionId) => {
          this.currentSessionId = sessionId;
          this.refreshStreamingView();
        },
        chunk: (text) => {
          if (!text) return;

          assistantMessage.text += text;
          this.refreshMessagesView();
        },
        sources: (sources) => {
          assistantMessage.sources = sources || [];
          this.refreshMessagesView();
        },
        done: (sessionId) => {
          if (sessionId) {
            this.currentSessionId = sessionId;
          }

          this.loading = false;
          this.loadSessions();
          this.refreshMessagesView();
        }
      },
      abortController.signal
    )
      .catch((error: unknown) => {
        if (this.isAbortError(error)) return;

        console.error(error);

        assistantMessage.text = assistantMessage.text ||
          'Desole, une erreur est survenue. Verifiez que le backend Express et le service RAG sont lances.';
        this.loading = false;
        this.refreshMessagesView();
      })
      .finally(() => {
        if (this.textStreamAbortController === abortController) {
          this.textStreamAbortController = null;
        }
      });
  }

  sendImageMessage(): void {
    const imageFile = this.selectedImageFile;

    if (!imageFile) {
      this.sendMessage();
      return;
    }

    if (this.isBusy || this.recordingMode || this.voiceConversationActive) return;

    if (!this.allowedImageTypes.has(imageFile.type) || imageFile.size > this.maxImageBytes) {
      this.statusMessage = 'Image invalide. Utilisez PNG, JPG, JPEG ou WEBP jusqu a 5MB.';
      return;
    }

    if (!this.authService.token()) {
      this.messages.push({
        role: 'assistant',
        text: 'Vous devez vous connecter pour utiliser le chatbot ProFood.'
      });
      this.refreshMessagesView();

      return;
    }

    const cleanQuestion = this.question.trim() || 'Analyse cette image dans le contexte de ProFood.';
    const previewUrl = this.selectedImagePreview || undefined;

    this.messages.push({
      role: 'user',
      text: cleanQuestion,
      specialist: this.selectedSpecialist,
      imagePreview: previewUrl
    });

    this.question = '';
    this.selectedImageFile = null;
    this.selectedImagePreview = null;
    this.loading = true;
    this.statusMessage = 'Analyse de l image...';

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      text: '',
      sources: [],
      specialist: this.selectedSpecialist,
      showImageDescription: false
    };

    this.messages.push(assistantMessage);
    this.refreshMessagesView();

    this.chatbotService.askImage(imageFile, cleanQuestion, this.currentSessionId, this.selectedSpecialist).subscribe({
      next: (response) => {
        if (response.session_id) {
          this.currentSessionId = response.session_id;
        }

        assistantMessage.text = response.answer;
        assistantMessage.sources = response.sources || [];
        assistantMessage.imageDescription = response.image_description;
        this.statusMessage = '';
        this.refreshMessagesView();
      },
      error: (error: unknown) => {
        console.error(error);
        assistantMessage.text =
          'Desole, l analyse de l image a echoue. Verifiez que FastAPI est lance et que llava:7b est installe dans Ollama.';
        this.loading = false;
        this.statusMessage = '';
        this.refreshMessagesView();
      },
      complete: () => {
        this.loading = false;
        this.loadSessions();
        this.refreshMessagesView();
      }
    });
  }

  toggleDictation(): void {
    if (this.recordingMode === 'dictate') {
      this.stopRecording(true);
      return;
    }

    this.startRecording('dictate');
  }

  toggleVoiceChat(): void {
    if (this.voiceConversationActive || this.recordingMode === 'voice-chat' || this.voiceChatLoading || this.assistantSpeaking) {
      this.stopVoiceConversation();
      return;
    }

    this.startVoiceConversation();
  }

  stopVoiceConversation(): void {
    if (!this.voiceConversationActive && this.recordingMode !== 'voice-chat' && !this.voiceChatLoading && !this.assistantSpeaking) {
      return;
    }

    this.voiceConversationActive = false;
    this.voiceLoopId += 1;
    this.abortCurrentStream();
    this.clearVoiceRestartTimer();
    this.clearAssistantAudioQueue();
    this.loading = false;
    this.voiceChatLoading = false;

    if (this.recordingMode === 'voice-chat') {
      this.stopRecording(false);
    }

    this.statusMessage = '';
    this.refreshStreamingView();
  }

  private loadSessions(importLatestSession = false): void {
    if (!this.authService.token()) {
      this.resetForLoggedOutUser();
      return;
    }

    this.sessionsLoading = true;

    this.chatbotService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;

        if (importLatestSession && sessions.length > 0 && !this.currentSessionId) {
          this.loadSessionMessages(sessions[0].id);
        }
      },
      error: (error: unknown) => this.handleSessionError(error),
      complete: () => (this.sessionsLoading = false)
    });
  }

  private loadSessionMessages(sessionId: string): void {
    const cachedSession = this.sessionCache.get(sessionId);

    if (cachedSession) {
      this.applySession(cachedSession);
      return;
    }

    this.chatbotService.getSession(sessionId).subscribe({
      next: (session) => this.applySession(session),
      error: (error: unknown) => this.handleSessionError(error)
    });
  }

  private applySession(session: ChatSession): void {
    this.sessionCache.set(session.id, session);
    this.currentSessionId = session.id;
    this.statusMessage = '';
    this.selectedSpecialist = this.normalizeSpecialistId(session.specialist || this.selectedSpecialist);

    this.messages = session.messages.length
      ? session.messages.map((message) => ({
          role: message.role,
          text: message.content,
          sources: message.sources || [],
          specialist: this.normalizeSpecialistId(message.specialist || session.specialist || null)
        }))
      : [];
    this.refreshMessagesView();
  }

  private normalizeSpecialistId(specialistId?: string | null): string {
    if (specialistId === 'taxonomy') return 'forum';

    return specialistId || 'general';
  }

  private handleSessionError(error: unknown): void {
    console.error(error);
    this.statusMessage = 'Unable to load chat sessions.';
  }

  private resetForLoggedOutUser(): void {
    this.streamAbortController?.abort();
    this.textStreamAbortController?.abort();
    this.streamAbortController = null;
    this.textStreamAbortController = null;
    this.clearVoiceRestartTimer();
    this.stopSilenceDetection();
    this.stopMicrophoneTracks();
    this.stopAssistantAudio();

    if (this.selectedImagePreview) {
      URL.revokeObjectURL(this.selectedImagePreview);
    }

    void this.audioContext?.close();
    this.audioContext = null;
    this.audioSource = null;
    this.audioStream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.revokeQueuedAudioUrls();
    this.pendingSpeechText = '';
    this.pendingTtsRequests = 0;
    this.voiceStreamCompleted = false;
    this.sessionsLoadedForToken = null;
    this.sessionCache.clear();
    this.isOpen = false;
    this.loading = false;
    this.dictationLoading = false;
    this.voiceChatLoading = false;
    this.sessionsLoading = false;
    this.question = '';
    this.selectedImageFile = null;
    this.selectedImagePreview = null;
    this.statusMessage = '';
    this.recordingMode = null;
    this.voiceConversationActive = false;
    this.assistantSpeaking = false;
    this.isSpecialistMenuOpen = false;
    this.currentSessionId = null;
    this.sessions = [];
    this.messages = [];
    this.selectedSpecialist = 'general';
  }

  private startVoiceConversation(): void {
    if (this.isBusy || this.recordingMode) return;

    this.voiceConversationActive = true;
    this.voiceLoopId += 1;
    this.statusMessage = 'Mode vocal actif.';
    this.startRecording('voice-chat');
  }

  private async startRecording(mode: VoiceRecordingMode): Promise<void> {
    if (this.recordingMode) return;
    if (mode === 'dictate' && (this.isBusy || this.voiceConversationActive)) return;
    if (mode === 'voice-chat' && (this.loading || this.voiceChatLoading || this.dictationLoading)) return;

    const token = this.authService.token();

    if (!token) {
      if (mode === 'voice-chat') {
        this.voiceConversationActive = false;
      }

      this.messages.push({
        role: 'assistant',
        text: 'Vous devez vous connecter pour utiliser le chatbot ProFood.'
      });
      this.refreshMessagesView();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      if (mode === 'voice-chat') {
        this.voiceConversationActive = false;
      }

      this.statusMessage = 'Voice recording is not supported in this browser.';
      return;
    }

    try {
      this.stopAssistantAudio();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      const mimeType = this.getSupportedAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      this.audioStream = stream;
      this.mediaRecorder = recorder;
      this.recordedChunks = [];
      this.recordingMode = mode;
      this.recordingStartedAt = performance.now();
      this.speechDetected = false;
      this.silenceStartedAt = null;
      this.shouldProcessRecording = true;
      this.statusMessage = mode === 'dictate'
        ? 'Dictee en cours...'
        : 'Je vous ecoute...';
      this.refreshStreamingView();

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      recorder.onerror = () => {
        this.statusMessage = 'Recording failed. Please try again.';
        if (mode === 'voice-chat') {
          this.voiceConversationActive = false;
        }

        this.cleanupRecording();
        this.refreshStreamingView();
      };

      recorder.onstop = () => {
        const chunks = [...this.recordedChunks];
        const recordingMimeType = recorder.mimeType || mimeType || 'audio/webm';
        const shouldProcess = this.shouldProcessRecording;

        this.cleanupRecording();

        if (!shouldProcess) {
          if (mode === 'voice-chat' && this.voiceConversationActive) {
            this.scheduleNextVoiceListening(250);
          }

          return;
        }

        this.handleRecordedAudio(mode, chunks, recordingMimeType);
        this.refreshStreamingView();
      };

      recorder.start(250);
      this.startSilenceDetection(stream);
    } catch (error) {
      console.error(error);
      if (mode === 'voice-chat') {
        this.voiceConversationActive = false;
      }

      this.cleanupRecording();
      this.statusMessage = 'Microphone permission was denied or unavailable.';
      this.refreshStreamingView();
    }
  }

  private stopRecording(processAudio = true): void {
    const recorder = this.mediaRecorder;

    this.shouldProcessRecording = processAudio;
    this.statusMessage = processAudio ? 'Traitement audio...' : '';
    this.recordingMode = null;
    this.refreshStreamingView();

    if (!recorder || recorder.state === 'inactive') {
      this.cleanupRecording();
      this.refreshStreamingView();
      return;
    }

    this.stopSilenceDetection();
    this.flushRecorderData(recorder);
    recorder.stop();
    this.stopMicrophoneTracks();
  }

  private flushRecorderData(recorder: MediaRecorder): void {
    if (recorder.state !== 'recording') return;

    try {
      recorder.requestData();
    } catch (error) {
      console.warn('Unable to flush recorder data before stopping.', error);
    }
  }

  private handleRecordedAudio(mode: VoiceRecordingMode, chunks: Blob[], mimeType: string): void {
    const token = this.authService.token();

    if (!token) {
      this.statusMessage = '';
      this.refreshStreamingView();
      return;
    }

    if (!chunks.length) {
      this.statusMessage = 'No audio was captured.';
      this.refreshStreamingView();
      return;
    }

    const audioBlob = new Blob(chunks, { type: mimeType });

    if (mode === 'dictate') {
      this.transcribeDictation(audioBlob, token);
      return;
    }

    if (!this.voiceConversationActive) return;

    this.askWithTranscribedVoice(audioBlob, token);
  }

  private transcribeDictation(audioBlob: Blob, token: string): void {
    this.dictationLoading = true;
    this.statusMessage = 'Transcribing voice input...';
    this.refreshStreamingView();

    this.chatbotService.transcribeVoice(audioBlob, token).subscribe({
      next: (response: VoiceTranscribeResponse) => {
        this.question = response.transcript || '';
        this.statusMessage = response.transcript
          ? 'Transcript ready. Review it, then send when ready.'
          : 'No speech was detected.';
        this.refreshStreamingView();
      },
      error: (error: unknown) => {
        console.error(error);
        this.statusMessage = 'Voice transcription failed.';
        this.refreshStreamingView();
      },
      complete: () => {
        this.dictationLoading = false;
        this.refreshStreamingView();
      }
    });
  }

  private askWithTranscribedVoice(audioBlob: Blob, token: string): void {
    const activeVoiceLoopId = this.voiceLoopId;

    this.loading = true;
    this.voiceChatLoading = true;
    this.statusMessage = 'Transcription de votre question...';
    this.refreshStreamingView();

    this.chatbotService.transcribeVoice(audioBlob, token).subscribe({
      next: (response: VoiceTranscribeResponse) => {
        if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

        const transcript = (response.transcript || '').trim();

        if (!transcript) {
          this.loading = false;
          this.voiceChatLoading = false;
          this.statusMessage = 'No speech was detected.';
          this.scheduleNextVoiceListening(350);
          this.refreshStreamingView();
          return;
        }

        this.messages.push({
          role: 'user',
          text: transcript,
          specialist: this.selectedSpecialist
        });
        this.refreshMessagesView();

        this.askTextFromVoiceTranscript(transcript, activeVoiceLoopId);
      },
      error: (error: unknown) => {
        if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

        console.error(error);
        this.loading = false;
        this.voiceChatLoading = false;
        this.voiceConversationActive = false;

        this.messages.push({
          role: 'assistant',
          text: 'Desole, la transcription vocale a echoue. Verifiez que le backend Express et le service RAG sont lances.'
        });
        this.refreshMessagesView();
      }
    });
  }

  private askTextFromVoiceTranscript(transcript: string, activeVoiceLoopId: number): void {
    this.statusMessage = 'Preparation de la reponse...';
    this.pendingSpeechText = '';
    this.pendingTtsRequests = 0;
    this.revokeQueuedAudioUrls();
    this.voiceStreamCompleted = false;

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      text: '',
      sources: [],
      specialist: this.selectedSpecialist
    };

    this.messages.push(assistantMessage);
    this.refreshMessagesView();

    const abortController = new AbortController();
    this.streamAbortController = abortController;

    void this.chatbotService.streamAsk(
      {
        question: transcript,
        k: 4,
        filters: null,
        session_id: this.currentSessionId,
        specialist: this.selectedSpecialist,
        voice_mode: true
      },
      {
        session: (sessionId) => {
          if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;
          this.currentSessionId = sessionId;
          this.refreshStreamingView();
        },
        chunk: (text) => {
          if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;
          if (!text) return;

          assistantMessage.text += text;
          this.pendingSpeechText += text;
          this.queueCompletedSentences(false, activeVoiceLoopId);
          this.statusMessage = 'Reponse en cours...';
          this.refreshMessagesView();
        },
        sources: (sources) => {
          if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;
          assistantMessage.sources = sources || [];
          this.refreshMessagesView();
        },
        done: (sessionId) => {
          if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

          if (sessionId) {
            this.currentSessionId = sessionId;
          }

          this.voiceStreamCompleted = true;
          this.queueCompletedSentences(true, activeVoiceLoopId);
          this.loadSessions();
          this.loading = false;
          this.voiceChatLoading = false;
          this.statusMessage = this.hasPendingVoiceAudio()
            ? 'Generation de la voix...'
            : 'Mode vocal actif.';
          this.maybeFinishVoicePlayback(activeVoiceLoopId);
          this.refreshMessagesView();
        }
      },
      abortController.signal
    )
      .catch((error: unknown) => {
        if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

        if (this.isAbortError(error)) return;

        console.error(error);
        this.loading = false;
        this.voiceChatLoading = false;
        this.voiceConversationActive = false;
        this.clearAssistantAudioQueue();

        assistantMessage.text = assistantMessage.text ||
          'Desole, une erreur est survenue pendant le chat vocal. Verifiez que le backend Express et le service RAG sont lances.';
        this.refreshMessagesView();
      })
      .finally(() => {
        if (this.streamAbortController === abortController) {
          this.streamAbortController = null;
        }
      });
  }

  private queueCompletedSentences(force: boolean, activeVoiceLoopId: number): void {
    const sentences = this.drainCompletedSentences(force);

    for (const sentence of sentences) {
      this.requestSentenceAudio(sentence, activeVoiceLoopId);
    }
  }

  private drainCompletedSentences(force: boolean): string[] {
    const sentences: string[] = [];
    let text = this.pendingSpeechText;
    const sentencePattern = /^([\s\S]*?[.!?])(\s+|$)/;
    let match = sentencePattern.exec(text);

    while (match) {
      const sentence = match[1].trim();

      if (sentence) {
        sentences.push(sentence);
      }

      text = text.slice(match[0].length);
      match = sentencePattern.exec(text);
    }

    if (force && text.trim()) {
      sentences.push(text.trim());
      text = '';
    }

    this.pendingSpeechText = text;

    return sentences;
  }

  private requestSentenceAudio(sentence: string, activeVoiceLoopId: number): void {
    if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

    const text = sentence.trim();

    if (!text) return;

    this.pendingTtsRequests += 1;

    this.chatbotService.speakText(text).pipe(
      timeout({ first: 20000 }),
      switchMap((response) => {
        const absoluteAudioUrl = this.chatbotService.getAbsoluteAudioUrl(response.audio_url);

        if (!absoluteAudioUrl) {
          throw new Error('No audio URL returned by the voice service.');
        }

        return this.chatbotService.getAudioBlob(absoluteAudioUrl).pipe(timeout({ first: 10000 }));
      }),
      finalize(() => {
        if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

        this.pendingTtsRequests = Math.max(0, this.pendingTtsRequests - 1);
        this.maybeFinishVoicePlayback(activeVoiceLoopId);
        this.refreshStreamingView();
      })
    ).subscribe({
      next: (audioBlob) => {
        if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

        this.audioQueue.push({
          type: 'audio',
          url: URL.createObjectURL(audioBlob),
          text
        });
        this.playNextAssistantAudio(activeVoiceLoopId);
      },
      error: (error: unknown) => {
        if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

        console.error(error);
        this.statusMessage = 'La reponse est prete, lecture vocale locale...';
        this.queueBrowserSpeech(text, activeVoiceLoopId);
      }
    });
  }

  private isActiveVoiceLoop(activeVoiceLoopId: number): boolean {
    return this.voiceConversationActive && activeVoiceLoopId === this.voiceLoopId;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messagesContainer?.nativeElement;

      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  }

  private refreshMessagesView(): void {
    this.changeDetector.detectChanges();
    this.scrollToBottom();
  }

  private refreshStreamingView(): void {
    this.changeDetector.detectChanges();
  }

  private playNextAssistantAudio(activeVoiceLoopId: number): void {
    if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;
    if (this.assistantSpeaking || this.assistantAudio || this.assistantUtterance) return;

    const playbackItem = this.audioQueue.shift();

    if (!playbackItem) {
      this.maybeFinishVoicePlayback(activeVoiceLoopId);
      return;
    }

    if (playbackItem.type === 'speech') {
      this.playBrowserSpeech(playbackItem.text, activeVoiceLoopId);
      return;
    }

    const audioUrl = playbackItem.url;
    const audio = new Audio(audioUrl);
    let audioUrlReleased = false;
    let speechFallbackQueued = false;

    const releaseAudioUrl = () => {
      if (audioUrlReleased) return;

      audioUrlReleased = true;
      this.revokeAudioUrl(audioUrl);
    };

    const queueSpeechFallback = () => {
      if (speechFallbackQueued) return;

      speechFallbackQueued = true;
      this.audioQueue.unshift({ type: 'speech', text: playbackItem.text });
    };

    audio.preload = 'auto';
    this.assistantAudio = audio;
    this.assistantSpeaking = true;
    this.statusMessage = 'Reponse vocale...';

    audio.onended = () => {
      releaseAudioUrl();
      this.assistantSpeaking = false;
      this.assistantAudio = null;
      this.playNextAssistantAudio(activeVoiceLoopId);
      this.maybeFinishVoicePlayback(activeVoiceLoopId);
    };

    audio.onerror = () => {
      releaseAudioUrl();
      this.assistantSpeaking = false;
      this.assistantAudio = null;
      queueSpeechFallback();
      this.playNextAssistantAudio(activeVoiceLoopId);
      this.maybeFinishVoicePlayback(activeVoiceLoopId);
    };

    audio.play().catch((error: unknown) => {
      console.error(error);
      releaseAudioUrl();
      this.assistantSpeaking = false;
      this.assistantAudio = null;
      this.statusMessage = 'The voice answer is ready, but playback was blocked by the browser.';
      queueSpeechFallback();
      this.playNextAssistantAudio(activeVoiceLoopId);
      this.maybeFinishVoicePlayback(activeVoiceLoopId);
    });
  }

  private queueBrowserSpeech(text: string, activeVoiceLoopId: number): void {
    if (!this.canUseBrowserSpeech()) {
      this.statusMessage = 'La reponse texte est prete, mais la voix nest pas disponible sur ce navigateur.';
      return;
    }

    this.audioQueue.push({ type: 'speech', text });
    this.playNextAssistantAudio(activeVoiceLoopId);
  }

  private playBrowserSpeech(text: string, activeVoiceLoopId: number): void {
    if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;
    if (!this.canUseBrowserSpeech()) {
      this.maybeFinishVoicePlayback(activeVoiceLoopId);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const speechSynthesis = window.speechSynthesis;
    const preferredVoice = this.getPreferredBrowserVoice();

    utterance.lang = preferredVoice?.lang || 'fr-FR';
    utterance.rate = 1;
    utterance.pitch = 1;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.assistantUtterance = utterance;
    this.assistantSpeaking = true;
    this.statusMessage = 'Reponse vocale...';
    this.refreshStreamingView();

    const finishSpeech = () => {
      if (this.assistantUtterance === utterance) {
        this.assistantUtterance = null;
      }

      this.assistantSpeaking = false;
      this.playNextAssistantAudio(activeVoiceLoopId);
      this.maybeFinishVoicePlayback(activeVoiceLoopId);
      this.refreshStreamingView();
    };

    utterance.onend = finishSpeech;
    utterance.onerror = finishSpeech;

    speechSynthesis.resume();
    speechSynthesis.speak(utterance);
  }

  private getPreferredBrowserVoice(): SpeechSynthesisVoice | null {
    if (!this.canUseBrowserSpeech()) return null;

    const voices = window.speechSynthesis.getVoices();

    return (
      voices.find((voice) => voice.lang.toLowerCase() === 'fr-fr') ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('fr')) ||
      null
    );
  }

  private canUseBrowserSpeech(): boolean {
    return typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined';
  }

  private maybeFinishVoicePlayback(activeVoiceLoopId: number): void {
    if (!this.isActiveVoiceLoop(activeVoiceLoopId)) return;

    if (!this.hasPendingVoiceAudio()) {
      this.statusMessage = 'Mode vocal actif.';
      this.scheduleNextVoiceListening(350);
    }
  }

  private hasPendingVoiceAudio(): boolean {
    return (
      !this.voiceStreamCompleted ||
      this.pendingTtsRequests > 0 ||
      this.assistantSpeaking ||
      Boolean(this.assistantAudio) ||
      Boolean(this.assistantUtterance) ||
      this.audioQueue.length > 0
    );
  }

  private isAbortError(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError';
  }

  private stopSilenceDetection(): void {
    if (this.silenceFrameId !== null) {
      window.cancelAnimationFrame(this.silenceFrameId);
    }

    this.silenceFrameId = null;
  }

  private stopMicrophoneTracks(): void {
    this.audioStream?.getTracks().forEach((track) => track.stop());
  }

  private cleanupRecording(): void {
    this.stopSilenceDetection();
    this.stopMicrophoneTracks();
    void this.audioContext?.close();
    this.audioContext = null;
    this.audioSource = null;
    this.audioStream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordingMode = null;
    this.speechDetected = false;
    this.silenceStartedAt = null;
    this.recordingStartedAt = 0;
    this.shouldProcessRecording = true;
  }

  private stopAssistantAudio(): void {
    this.stopBrowserSpeech();

    if (!this.assistantAudio) {
      this.assistantSpeaking = false;
      return;
    }

    const currentAudioUrl = this.assistantAudio.currentSrc || this.assistantAudio.src;

    this.assistantAudio.onended = null;
    this.assistantAudio.onerror = null;
    this.assistantAudio.pause();
    this.assistantAudio.currentTime = 0;
    this.revokeAudioUrl(currentAudioUrl);
    this.assistantAudio = null;
    this.assistantSpeaking = false;
  }

  private abortCurrentStream(): void {
    if (!this.streamAbortController) return;

    this.streamAbortController.abort();
    this.streamAbortController = null;
  }

  private abortTextStream(): void {
    if (!this.textStreamAbortController) return;

    this.textStreamAbortController.abort();
    this.textStreamAbortController = null;
    this.loading = false;
    this.refreshStreamingView();
  }

  private clearAssistantAudioQueue(): void {
    this.revokeQueuedAudioUrls();
    this.pendingSpeechText = '';
    this.pendingTtsRequests = 0;
    this.voiceStreamCompleted = false;
    this.stopAssistantAudio();
  }

  private revokeQueuedAudioUrls(): void {
    for (const playbackItem of this.audioQueue) {
      if (playbackItem.type === 'audio') {
        this.revokeAudioUrl(playbackItem.url);
      }
    }

    this.audioQueue = [];
  }

  private stopBrowserSpeech(): void {
    if (!this.assistantUtterance) return;

    this.assistantUtterance.onend = null;
    this.assistantUtterance.onerror = null;
    window.speechSynthesis.cancel();
    this.assistantUtterance = null;
  }

  private revokeAudioUrl(audioUrl?: string | null): void {
    if (audioUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
  }

  private clearVoiceRestartTimer(): void {
    if (this.voiceRestartTimerId === null) return;

    window.clearTimeout(this.voiceRestartTimerId);
    this.voiceRestartTimerId = null;
  }

  private scheduleNextVoiceListening(delayMs: number): void {
    this.clearVoiceRestartTimer();

    if (!this.voiceConversationActive) return;

    this.statusMessage = 'Mode vocal actif.';
    this.voiceRestartTimerId = window.setTimeout(() => {
      this.voiceRestartTimerId = null;

      if (!this.voiceConversationActive || this.isBusy || this.recordingMode || this.assistantSpeaking) return;

      this.startRecording('voice-chat');
    }, delayMs);
  }

  private startSilenceDetection(stream: MediaStream): void {
    if (typeof window.AudioContext === 'undefined') return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const samples = new Float32Array(analyser.fftSize);
    const maxRecordingMs = this.maxRecordingMs;

    analyser.fftSize = 2048;
    this.audioContext = audioContext;
    this.audioSource = audioContext.createMediaStreamSource(stream);
    this.audioSource.connect(analyser);

    const checkSilence = () => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;

      analyser.getFloatTimeDomainData(samples);

      let sum = 0;
      for (const sample of samples) {
        sum += sample * sample;
      }

      const rms = Math.sqrt(sum / samples.length);
      const now = performance.now();

      if (rms > this.silenceThreshold) {
        this.speechDetected = true;
        this.silenceStartedAt = null;
      } else if (this.speechDetected) {
        this.silenceStartedAt ??= now;

        if (now - this.silenceStartedAt >= this.silenceDelayMs) {
          this.stopRecording();
          return;
        }
      } else if (now - this.recordingStartedAt >= this.maxIdleRecordingMs) {
        this.stopRecording(false);
        return;
      }

      if (now - this.recordingStartedAt >= maxRecordingMs) {
        this.stopRecording(this.speechDetected);
        return;
      }

      this.silenceFrameId = window.requestAnimationFrame(checkSilence);
    };

    this.silenceFrameId = window.requestAnimationFrame(checkSilence);
  }

  private getSupportedAudioMimeType(): string {
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];

    return mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || '';
  }
}
