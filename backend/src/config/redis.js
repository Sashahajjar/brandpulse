import Redis from 'ioredis';

// Support multiple Redis connection formats:
// 1. REDIS_URL (Railway, Render, etc.) - full connection string
// 2. REDIS_HOST + REDIS_PORT + REDIS_PASSWORD (Upstash, custom)
// 3. Fallback to localhost for development

let redisConfig;

if (process.env.REDIS_URL) {
  // Use full connection string (Railway, Render, etc.)
  redisConfig = process.env.REDIS_URL;
} else {
  // Use individual components
  redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  };
}

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
  // Don't crash the app if Redis is unavailable
});

export default redis;




