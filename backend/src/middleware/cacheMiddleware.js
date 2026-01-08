import { getCache, setCache } from '../services/cacheService.js';

/**
 * Cache middleware for GET requests
 */
export function cacheMiddleware(ttl = 600) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get from cache
      const cached = await getCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Store original json function
      const originalJson = res.json.bind(res);

      // Override json to cache the response
      res.json = function (data) {
        // Cache the response
        setCache(cacheKey, data, ttl).catch(console.error);
        // Call original json
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}




