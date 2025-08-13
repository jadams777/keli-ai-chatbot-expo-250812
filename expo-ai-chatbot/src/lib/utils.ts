import { clsx, type ClassValue } from "clsx";
import { Platform } from "react-native";
import { twMerge } from "tailwind-merge";
import type {
  CoreAssistantMessage,
  ModelMessage,
  CoreToolMessage,
  UIMessage,
} from "ai";

// Define ToolInvocation type for AI SDK v5 compatibility
interface ToolInvocation {
  state: 'call' | 'result';
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
}
import type { Message as DBMessage, Document } from "@/lib/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidYoutubeUrl(url: string) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}

export function isWeb() {
  return Platform.OS === "web";
}
export function isNative() {
  return Platform.OS === "ios" || Platform.OS === "android";
}
export function isIOS() {
  return Platform.OS === "ios";
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<UIMessage>;
}): Array<UIMessage> {
  return messages.map((message) => {
    const messageWithTools = message as UIMessage & { toolInvocations?: Array<ToolInvocation> };
    if (messageWithTools.toolInvocations) {
      return {
        ...message,
        toolInvocations: messageWithTools.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: (toolResult as any).result || toolResult,
            };
          }

          return toolInvocation;
        }),
      } as UIMessage;
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<DBMessage>,
): Array<UIMessage> {
  return messages.reduce((chatMessages: Array<UIMessage>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    const uiMessage: any = {
      id: message.id,
      role: message.role as UIMessage["role"],
      content: textContent,
      parts: [{ type: "text", text: textContent }],
      ...(toolInvocations.length > 0 && { toolInvocations }),
    };
    chatMessages.push(uiMessage as UIMessage);

    return chatMessages;
  }, []);
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function sanitizeUIMessages(messages: Array<UIMessage>): Array<UIMessage> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    const messageWithTools = message as UIMessage & { toolInvocations?: Array<ToolInvocation> };
    if (!messageWithTools.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of messageWithTools.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = messageWithTools.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    } as UIMessage;
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) => {
      const messageWithTools = message as UIMessage & { toolInvocations?: Array<ToolInvocation>; content?: string };
      return (
        (messageWithTools.content && messageWithTools.content.length > 0) ||
        (messageWithTools.toolInvocations && messageWithTools.toolInvocations.length > 0)
      );
    }
  );
}

export function getMostRecentUserMessage(messages: Array<ModelMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getMessageIdFromAnnotations(message: UIMessage) {
  const messageWithAnnotations = message as UIMessage & { annotations?: Array<any> };
  if (!messageWithAnnotations.annotations) return message.id;

  const [annotation] = messageWithAnnotations.annotations;
  if (!annotation) return message.id;

  return annotation.messageIdFromServer || message.id;
}
