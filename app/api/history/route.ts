// This file routes API calls to the history endpoint from the root path to the features directory

// Import the history API endpoint from the features directory
import * as historyRoute from '../../features/(chat)/api/history/route';

// Re-export all exports from the history route
export const { GET, POST, PUT, DELETE, PATCH } = historyRoute;
