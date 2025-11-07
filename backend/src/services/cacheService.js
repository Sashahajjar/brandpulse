import redis from '../config/redis.js';

const CACHE_TTL = 600; // 10 minutes in seconds

/**
 * Get cached data
 */
export async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set cached data
 */
export async function setCache(key, value, ttl = CACHE_TTL) {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

/**
 * Delete cached data
 */
export async function deleteCache(key) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

/**
 * Delete cache by pattern
 */
export async function deleteCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return false;
  }
}

/**
 * Invalidate brand-related cache
 */
export async function invalidateBrandCache(brandId) {
  await Promise.all([
    deleteCachePattern(`brands:*`),
    deleteCachePattern(`insights:brand:${brandId}:*`),
    deleteCache(`brand:${brandId}`),
  ]);
}

