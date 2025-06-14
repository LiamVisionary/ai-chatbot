import type { CoreAssistantMessage, CoreToolMessage, UIMessage } from 'ai';
import type { Document } from '@/lib/db/schema';

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

/**
 * Retrieves the most recent user message from a message array
 * 
 * @param messages - Array of UI messages
 * @returns The most recent user message or undefined
 */
export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

/**
 * Gets the document timestamp by index with safety checks
 * 
 * @param documents - Array of documents
 * @param index - Index of the document to retrieve
 * @returns The document's timestamp or current date if not found
 */
export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index >= documents.length) return new Date();

  return documents[index].createdAt;
}

/**
 * Gets the ID of the most recent message in the conversation
 * 
 * @param messages - Array of messages
 * @returns The ID of the trailing message or null
 */
export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

/**
 * Sanitizes text by removing special markers
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}
