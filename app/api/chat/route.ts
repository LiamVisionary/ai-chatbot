// This file routes API calls to the chat endpoint from the root path to the features directory

// Import the chat API endpoint from the features directory
import * as chatRoute from '../../features/(chat)/api/chat/route';

// Re-export all exports from the chat route
export const { GET, POST, PUT, DELETE, PATCH } = chatRoute;
