# 🚀 BrandPulse Deployment Guide - Make It Clickable!

This guide will help you deploy BrandPulse so recruiters can access it via a URL. **No terminal required** - just follow the steps and click buttons!

## 📋 What You'll Deploy

- **Backend**: Node.js/Express API → Railway
- **Frontend**: Next.js App → Vercel
- **Database**: PostgreSQL → Supabase
- **Cache**: Redis → Railway (or Upstash)

**Final URLs:**
- **Frontend**: `https://brandpulse.vercel.app` ⭐ **This is what you share with recruiters!**
- **Backend**: `https://brandpulse-backend.up.railway.app` (hidden, only used by frontend)

### 🎯 Important: Recruiters Only Need ONE URL!

The frontend automatically connects to the backend. Recruiters only see and use the frontend URL - everything works together seamlessly!

**See [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for a detailed explanation.**

---

## ⏱️ Time Estimate: 20-30 minutes

---

## 🎯 Step-by-Step Deployment

### Step 1: Set Up Database (Supabase) - 5 minutes

1. **Go to** [supabase.com](https://supabase.com)
2. **Sign up/Login** (use GitHub for easy setup)
3. **Click** "New Project"
4. **Fill in**:
   - **Name**: `brandpulse-db`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
5. **Click** "Create new project"
6. **Wait** 2-3 minutes for setup
7. **Get Connection String**:
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Click "URI" tab
   - Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
   - **Replace** `[YOUR-PASSWORD]` with your actual password
   - **Save this** - you'll need it for Railway!

✅ **Database is ready!**

---

### Step 2: Set Up Redis (Railway - Easiest) - 2 minutes

**Option A: Railway Redis (Recommended)**

You'll add this when deploying the backend on Railway - it's built-in!

**Option B: Upstash Redis (Alternative)**

1. **Go to** [upstash.com](https://upstash.com)
2. **Sign up/Login**
3. **Click** "Create Database"
4. **Choose** "Regional" (for direct Redis protocol)
5. **Fill in**:
   - **Name**: `brandpulse-redis`
   - **Region**: Choose closest
6. **Click** "Create"
7. **Copy** the connection details:
   - Go to "Details" tab
   - Copy **Endpoint** (host:port)
   - Copy **Password**
   - **Save these** for Railway environment variables

✅ **Redis is ready!**

---

### Step 3: Deploy Backend (Railway) - 10 minutes

1. **Go to** [railway.app](https://railway.app)
2. **Sign up/Login** (use GitHub - it's easier)
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** your BrandPulse repository
6. **Important**: Click on the service → **Settings** → **Root Directory**
   - Set to: `backend`
   - Click "Save"
7. **Add Redis** (if using Railway Redis):
   - In your project, click "New" → "Database" → "Add Redis"
   - Railway will auto-configure it
   - Copy the `REDIS_URL` from the Redis service variables
8. **Add Environment Variables**:
   - Click on your backend service
   - Go to **Variables** tab
   - Click "New Variable"
   - Add these one by one:

   ```
   DATABASE_URL = [your-supabase-connection-string-from-step-1]
   ```

   If using Railway Redis:
   ```
   REDIS_URL = [railway-redis-url-from-step-2]
   ```

   If using Upstash Redis:
   ```
   REDIS_HOST = [upstash-host]
   REDIS_PORT = [upstash-port]
   REDIS_PASSWORD = [upstash-password]
   ```

   ```
   FRONTEND_URL = https://brandpulse.vercel.app
   ```
   (Update this after deploying frontend)

   ```
   NODE_ENV = production
   PORT = 5000
   ```

9. **Configure Build**:
   - Railway should auto-detect Node.js
   - The `railway.json` file I created will handle the build
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `npm start`

10. **Deploy**:
    - Railway will automatically start deploying
    - Wait 3-5 minutes for first deployment
    - Watch the logs to see progress

11. **Get Backend URL**:
    - Once deployed, click on your service
    - Go to **Settings** → **Domains**
    - Copy the generated URL (e.g., `https://brandpulse-backend.up.railway.app`)
    - **Save this** - you'll need it for Vercel!

✅ **Backend is deployed!**

---

### Step 4: Deploy Frontend (Vercel) - 5 minutes

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up/Login** (use GitHub)
3. **Click** "Add New Project"
4. **Import** your BrandPulse repository
5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" → Change to `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
6. **Add Environment Variable**:
   - Click "Environment Variables"
   - Click "Add"
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Railway backend URL from Step 3
     - Example: `https://brandpulse-backend.up.railway.app`
   - Click "Save"
7. **Click** "Deploy"
8. **Wait** 2-3 minutes for deployment
9. **Get Frontend URL**:
    - Once deployed, you'll see your URL
    - It will be something like: `https://brandpulse.vercel.app`
    - Or you can customize it in Settings → Domains
    - **Copy this URL**

✅ **Frontend is deployed!**

---

### Step 5: Connect Frontend and Backend - 2 minutes

1. **Update Backend CORS**:
   - Go back to Railway dashboard
   - Click on your backend service
   - Go to **Variables** tab
   - Find `FRONTEND_URL`
   - Update it to your Vercel frontend URL
     - Example: `https://brandpulse.vercel.app`
   - Railway will automatically redeploy

2. **Test the Connection**:
   - Open your Vercel frontend URL in a browser
   - Open browser console (F12)
   - Check for any errors
   - Try navigating the app

✅ **Everything is connected!**

---

## ✅ Deployment Checklist

### Database (Supabase)
- [ ] Supabase account created
- [ ] Project created: `brandpulse-db`
- [ ] Connection string copied
- [ ] Password saved securely

### Redis
- [ ] Railway Redis added OR Upstash Redis created
- [ ] Connection details saved

### Backend (Railway)
- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] Root directory set to `backend`
- [ ] All environment variables added
- [ ] Build successful
- [ ] Backend URL copied

### Frontend (Vercel)
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] `NEXT_PUBLIC_API_URL` environment variable added
- [ ] Build successful
- [ ] Frontend URL copied

### Connection
- [ ] `FRONTEND_URL` updated in Railway
- [ ] App tested and working
- [ ] No CORS errors in console

---

## 🔧 Troubleshooting

### Backend Build Fails

**Problem**: Build fails with Prisma errors
- **Solution**: Make sure `DATABASE_URL` is set correctly
- Check Railway logs for specific error messages

**Problem**: "Missing required environment variables"
- **Solution**: Verify all environment variables are set in Railway
- Check variable names match exactly (case-sensitive)

### Frontend Can't Connect to Backend

**Problem**: CORS errors in browser console
- **Solution**: 
  - Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
  - No trailing slashes
  - Include `https://` protocol
  - Wait for Railway to redeploy after updating

**Problem**: "Network Error" or "Failed to fetch"
- **Solution**:
  - Verify `NEXT_PUBLIC_API_URL` in Vercel is correct
  - Check backend is running (visit backend URL + `/api/health`)
  - Check browser console for specific error

### Database Connection Issues

**Problem**: "Can't reach database server"
- **Solution**:
  - Verify `DATABASE_URL` connection string is correct
  - Make sure password in connection string matches Supabase password
  - Check Supabase project is active (not paused)

### Redis Connection Issues

**Problem**: Redis errors in logs (but app still works)
- **Solution**: 
  - Redis is optional for caching
  - App will work without it (just slower)
  - Check Redis connection details if you want caching

---

## 🎉 You're Done!

Your BrandPulse is now live and accessible at:
- **Frontend**: `https://brandpulse.vercel.app` ⭐ **Share this URL with recruiters!**
- **Backend**: `https://brandpulse-backend.up.railway.app` (hidden, only used internally)

### 📝 What to Share

**You only need to share ONE URL with recruiters:**
```
https://brandpulse.vercel.app
```

The frontend automatically connects to the backend - everything works together! Recruiters will see a fully functional application with no setup required.

**See [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) to understand how it all connects.**

### Next Steps:

1. **Test everything**:
   - Visit your frontend URL
   - Try all features
   - Check browser console for errors

2. **Add to your Portfolio**:
   - Add the frontend URL to your portfolio website
   - Update your CV/Resume
   - Update LinkedIn profile

3. **Monitor**:
   - Check Railway logs if issues arise
   - Check Vercel logs for frontend issues
   - Both platforms have free monitoring

---

## 📝 Environment Variables Reference

See `ENVIRONMENT_VARIABLES.md` in this folder for a complete reference of all environment variables.

---

## 💰 Cost

**Everything is FREE** using:
- Supabase free tier (500MB database)
- Railway free tier ($5/month credit)
- Vercel free tier (unlimited for personal projects)
- Redis free tier (Railway or Upstash)

**Total Cost: $0/month** 🎉

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- Check the troubleshooting section above

---

**Estimated Time**: 20-30 minutes  
**Difficulty**: Easy (just clicking buttons!)  
**Result**: BrandPulse accessible via URL! 🚀

