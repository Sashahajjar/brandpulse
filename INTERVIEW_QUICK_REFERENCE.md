# BrandPulse - Quick Interview Reference

## 🎯 30-Second Pitch
"BrandPulse is a full-stack social media analytics platform for luxury fashion brands. It automatically syncs Instagram and TikTok data, stores historical metrics, and provides an interactive dashboard for single-brand analysis and competitive comparison."

## 📋 What It Does
- **Automated Data Sync**: Daily cron jobs fetch social media metrics
- **Historical Tracking**: 3 months of trend data
- **Single Brand Analytics**: Deep-dive performance metrics
- **Brand Comparison**: Side-by-side comparison of up to 3 brands
- **Executive Summaries**: AI-generated strategic insights

## 🛠️ Tech Stack

### Frontend
- Next.js 16 + React 19 + TypeScript
- Zustand (state management)
- Tailwind CSS + Framer Motion
- Recharts (visualizations)

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- Redis (caching)
- Zod (validation)
- Pino (logging)
- Sentry (monitoring)
- node-cron (scheduling)

## 🏗️ Architecture
```
Frontend (Next.js) → Backend (Express) → PostgreSQL
                              ↓
                         Redis Cache
                              ↓
                      RapidAPI (Instagram/TikTok)
```

## 💾 Database Models
1. **Brand** - Brand information
2. **Platform** - Instagram/TikTok metrics per brand
3. **Insight** - Historical analytics data
4. **SocialSnapshot** - Time-series snapshots
5. **SyncJob** - Sync operation tracking

## 🔑 Key Technical Features

### 1. Data Sync System
- Automated daily cron job (midnight UTC)
- Manual sync via API endpoint
- Error tracking in database
- Idempotent operations

### 2. Caching Strategy
- Redis with 10-min TTL (brands), 5-min (insights)
- Pattern-based cache invalidation
- Reduces DB queries by 70-80%

### 3. Performance Optimizations
- Database indexing on foreign keys
- React useMemo for expensive calculations
- Connection pooling via Prisma
- Lazy loading components

### 4. Security
- Helmet.js security headers
- CORS configuration
- Rate limiting (300 req/15min)
- Input validation with Zod

## 🎤 Common Questions & Answers

**Q: How does the sync work?**
A: Daily cron job fetches all brands, calls RapidAPI for Instagram/TikTok data, processes it, stores in PostgreSQL with Prisma upserts, creates time-series snapshots, and invalidates cache.

**Q: How do you handle performance?**
A: Redis caching (10-min TTL), database indexing, React memoization, and efficient Prisma queries. Cache reduces DB load by 70-80%.

**Q: Error handling?**
A: Centralized error middleware, Pino logging, Sentry monitoring, unique request IDs for tracing, sync job status tracking in DB.

**Q: Data structure?**
A: Relational schema: Brands → Platforms (1:many), Brands → Insights (1:many), Brands → Snapshots (1:many). JSON metadata for flexibility.

**Q: Challenges faced?**
A: External API rate limits (retry logic + fallbacks), historical data management (snapshot system), chart performance with large datasets (memoization).

## 📊 Key Numbers
- 5 database models
- 15+ technologies integrated
- 10+ reusable components
- 70-80% DB load reduction (caching)
- 3 months historical data

## 🚀 Future Enhancements
- Authentication (JWT)
- WebSocket real-time updates
- More platforms (X, LinkedIn)
- Sentiment analysis
- Queue system (Bull/BullMQ)
- Comprehensive testing

## 💡 Highlight Points
1. **Modern stack**: Next.js 16, React 19, TypeScript, ES Modules
2. **Production-ready**: Error handling, logging, monitoring
3. **Performance**: Redis caching, indexing, memoization
4. **Type safety**: Prisma + TypeScript + Zod
5. **Scalable architecture**: Clear separation, extensible design


