// This file routes API calls to the vote endpoint from the root path to the features directory

// Import the vote API endpoint from the features directory
import * as voteRoute from '../../features/(chat)/api/vote/route';

// Re-export all exports from the vote route
export const { GET, POST, PUT, DELETE, PATCH } = voteRoute;
