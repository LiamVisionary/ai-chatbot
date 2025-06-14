import { CreateDocumentCallbackProps, UpdateDocumentCallbackProps, createDocumentHandler } from '@/lib/artifacts/server';

/**
 * Text document handler for the chatbot
 */
export const textDocumentHandler = createDocumentHandler({
  kind: 'text',
  onCreateDocument: async ({ id, title, dataStream }: CreateDocumentCallbackProps) => {
    dataStream.writeData({
      type: 'tool-call',
      toolCall: {
        id,
        type: 'create-document',
        status: 'running',
        name: 'Text Document',
      },
    });

    // Return empty text content to start with
    return '';
  },
  onUpdateDocument: async ({ document, description, dataStream }: UpdateDocumentCallbackProps) => {
    dataStream.writeData({
      type: 'tool-call',
      toolCall: {
        id: document.id,
        type: 'update-document',
        status: 'running',
        name: 'Text Document',
      },
    });

    // In a real implementation, this would modify the text based on the description
    const existingContent = document.content || '';
    return existingContent + (existingContent ? '\n\n' : '') + description;
  },
});
