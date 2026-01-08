# 🔐 BrandPulse Environment Variables

Complete reference for all environment variables needed for BrandPulse deployment.

---

## Backend (Railway)

### Required Variables

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```
**How to get**: Supabase → Settings → Database → Connection string (URI tab)

---

### Redis (Choose ONE option)

**Option A: Railway Redis (Recommended)**
```env
REDIS_URL=redis://default:[PASSWORD]@[HOST]:[PORT]
```
**How to get**: Railway automatically provides this when you add Redis service

**Option B: Upstash Redis**
```env
REDIS_HOST=[UPSTASH_ENDPOINT]
REDIS_PORT=[UPSTASH_PORT]
REDIS_PASSWORD=[UPSTASH_PASSWORD]
```
**How to get**: Upstash dashboard → Your Redis database → Details tab

---

### Frontend Configuration

```env
# Frontend URL (for CORS)
FRONTEND_URL=https://brandpulse.vercel.app
```
**Update this** after deploying frontend to match your Vercel URL exactly.

---

### Environment Settings

```env
# Environment
NODE_ENV=production

# Server Port
PORT=5000
```
Railway will automatically set `PORT`, but you can override if needed.

---

### Optional Variables

```env
# Error Tracking (Sentry)
SENTRY_DSN=[YOUR_SENTRY_DSN]
```
**How to get**: Sentry.io → Create project → Copy DSN

---

## Frontend (Vercel)

### Required Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://brandpulse-backend.up.railway.app
```
**How to get**: Railway dashboard → Your backend service → Settings → Domains → Copy URL

**Important**: 
- Must start with `https://`
- No trailing slash
- Must include `/api` path if your backend uses it (BrandPulse does)

---

## 📋 Quick Setup Checklist

### Backend (Railway)
- [ ] `DATABASE_URL` - From Supabase
- [ ] `REDIS_URL` OR (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`) - From Railway/Upstash
- [ ] `FRONTEND_URL` - Your Vercel URL (update after frontend deploy)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Set to `5000` (optional, Railway auto-sets)

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` - Your Railway backend URL

---

## 🔒 Security Notes

- ⚠️ **Never commit** `.env` files to Git
- ✅ Use platform environment variable settings (Railway, Vercel)
- ✅ Keep passwords and connection strings secure
- ✅ Rotate credentials if exposed
- ✅ Use different passwords for production vs development

---

## 🧪 Testing Environment Variables

### Backend Health Check
Visit: `https://your-backend-url.up.railway.app/api/health`

Should return:
```json
{
  "status": "BrandPulse backend running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Frontend API Connection
1. Open browser console (F12)
2. Visit your frontend URL
3. Check Network tab for API calls
4. Should see successful requests to your backend

---

## 📝 Example Values

### Backend (Railway)
```env
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.abcdefgh.supabase.co:5432/postgres
REDIS_URL=redis://default:AnotherPassword@containers-us-west-123.railway.app:6379
FRONTEND_URL=https://brandpulse.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://brandpulse-backend.up.railway.app
```

---

## 🆘 Common Issues

### "Missing required environment variables"
- Check all required variables are set
- Variable names must match exactly (case-sensitive)
- No extra spaces in values

### "Database connection failed"
- Verify `DATABASE_URL` format is correct
- Check password in connection string matches Supabase
- Ensure Supabase project is active

### "CORS error"
- Verify `FRONTEND_URL` matches Vercel URL exactly
- No trailing slashes
- Include `https://` protocol

### "API not found"
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running (visit `/api/health`)
- Ensure backend URL doesn't have trailing slash

---

## 📚 Additional Resources

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)

