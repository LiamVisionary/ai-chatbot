import { CreateDocumentCallbackProps, UpdateDocumentCallbackProps, createDocumentHandler } from '@/lib/artifacts/server';

/**
 * Sheet document handler for the chatbot
 */
export const sheetDocumentHandler = createDocumentHandler({
  kind: 'sheet',
  onCreateDocument: async ({ id, title, dataStream }: CreateDocumentCallbackProps) => {
    dataStream.writeData({
      type: 'tool-call',
      toolCall: {
        id,
        type: 'create-document',
        status: 'running',
        name: 'Sheet Document',
      },
    });

    // Return some placeholder sheet content
    return JSON.stringify({
      headers: ['Column A', 'Column B', 'Column C'],
      rows: [
        ['Data 1', 'Data 2', 'Data 3'],
        ['Data 4', 'Data 5', 'Data 6'],
      ]
    });
  },
  onUpdateDocument: async ({ document, description, dataStream }: UpdateDocumentCallbackProps) => {
    dataStream.writeData({
      type: 'tool-call',
      toolCall: {
        id: document.id,
        type: 'update-document',
        status: 'running',
        name: 'Sheet Document',
      },
    });

    // In a real implementation, this would update the sheet based on the description
    return document.content || JSON.stringify({
      headers: ['Column A', 'Column B', 'Column C'],
      rows: [
        ['Updated 1', 'Updated 2', 'Updated 3'],
        ['Updated 4', 'Updated 5', 'Updated 6'],
      ]
    });
  },
});
