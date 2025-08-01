import type { UIMessage } from 'ai';

export interface ChatApiResponse {
  chat: {
    id: string;
    title: string;
    visibility: 'public' | 'private';
    userId: string;
    createdAt: Date;
  };
  messages: UIMessage[];
  chatModel: string;
  isReadonly: boolean;
  session: {
    user: {
      id: string;
      email?: string;
      name?: string;
    } | null;
  };
}

export interface ChatApiError {
  code: string;
  message: string;
  cause?: string;
} 