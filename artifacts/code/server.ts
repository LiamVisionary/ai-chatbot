import { CreateDocumentCallbackProps, UpdateDocumentCallbackProps, createDocumentHandler } from '@/lib/artifacts/server';

/**
 * Code document handler for the chatbot
 */
export const codeDocumentHandler = createDocumentHandler({
  kind: 'code',
  onCreateDocument: async ({ id, title, dataStream }: CreateDocumentCallbackProps) => {
    dataStream.writeData({
      type: 'tool-call',
      toolCall: {
        id,
        type: 'create-document',
        status: 'running',
        name: 'Code Document',
      },
    });

    // Return some placeholder code content
    return '// Add your code here';
  },
  onUpdateDocument: async ({ document, description, dataStream }: UpdateDocumentCallbackProps) => {
    dataStream.writeData({
      type: 'tool-call',
      toolCall: {
        id: document.id,
        type: 'update-document',
        status: 'running',
        name: 'Code Document',
      },
    });

    // In a real implementation, this would modify the code based on the description
    return document.content || '// Updated code';
  },
});
