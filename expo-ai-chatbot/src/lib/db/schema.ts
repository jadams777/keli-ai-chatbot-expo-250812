// Database schema types for the chat application

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | Array<any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Document {
  id: string;
  title?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Chat {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt?: Date;
}