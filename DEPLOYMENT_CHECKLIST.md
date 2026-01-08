# ✅ BrandPulse Deployment Checklist

Use this checklist to track your deployment progress. Check off each item as you complete it.

---

## 📋 Pre-Deployment

- [ ] All code is pushed to GitHub
- [ ] GitHub repository is public (or connected to Railway/Vercel)
- [ ] You have accounts ready:
  - [ ] Supabase account
  - [ ] Railway account (GitHub login)
  - [ ] Vercel account (GitHub login)
  - [ ] Upstash account (if not using Railway Redis)

---

## 🗄️ Step 1: Database Setup (Supabase)

- [ ] Created Supabase account
- [ ] Created new project: `brandpulse-db`
- [ ] Saved database password securely
- [ ] Copied connection string from Settings → Database
- [ ] Replaced `[YOUR-PASSWORD]` in connection string
- [ ] Saved `DATABASE_URL` for Railway

**Time**: ~5 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 💾 Step 2: Redis Setup

**Choose ONE option:**

### Option A: Railway Redis
- [ ] Will add when deploying backend (skip for now)

### Option B: Upstash Redis
- [ ] Created Upstash account
- [ ] Created Redis database: `brandpulse-redis`
- [ ] Chose "Regional" type
- [ ] Copied endpoint (host:port)
- [ ] Copied password
- [ ] Saved connection details for Railway

**Time**: ~2 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 🚂 Step 3: Backend Deployment (Railway)

- [ ] Created Railway account (GitHub login)
- [ ] Created new project
- [ ] Connected GitHub repository
- [ ] Selected BrandPulse repository
- [ ] Set Root Directory to `backend`
- [ ] Added Redis service (if using Railway Redis)
- [ ] Added environment variables:
  - [ ] `DATABASE_URL`
  - [ ] `REDIS_URL` OR (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`)
  - [ ] `FRONTEND_URL` (placeholder: `https://brandpulse.vercel.app`)
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5000`
- [ ] Verified build command (auto-detected or from `railway.json`)
- [ ] Started deployment
- [ ] Waited for deployment to complete (3-5 min)
- [ ] Checked deployment logs for errors
- [ ] Copied backend URL from Settings → Domains
- [ ] Tested health endpoint: `[BACKEND_URL]/api/health`

**Time**: ~10 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Backend URL**: `_________________________________`

---

## 🎨 Step 4: Frontend Deployment (Vercel)

- [ ] Created Vercel account (GitHub login)
- [ ] Clicked "Add New Project"
- [ ] Imported BrandPulse repository
- [ ] Set Root Directory to `frontend`
- [ ] Verified Framework: Next.js (auto-detected)
- [ ] Added environment variable:
  - [ ] `NEXT_PUBLIC_API_URL` = `[BACKEND_URL_FROM_STEP_3]`
- [ ] Clicked "Deploy"
- [ ] Waited for deployment (2-3 min)
- [ ] Checked deployment logs for errors
- [ ] Copied frontend URL
- [ ] Tested frontend loads correctly

**Time**: ~5 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Frontend URL**: `_________________________________`

---

## 🔗 Step 5: Connect Frontend & Backend

- [ ] Went back to Railway dashboard
- [ ] Updated `FRONTEND_URL` to actual Vercel URL
- [ ] Waited for Railway to auto-redeploy
- [ ] Tested frontend can connect to backend
- [ ] Opened browser console (F12)
- [ ] Checked for CORS errors (should be none)
- [ ] Tested app functionality:
  - [ ] Can load brands
  - [ ] Can view insights
  - [ ] Can compare brands
  - [ ] No console errors

**Time**: ~2 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 🧪 Step 6: Testing

- [ ] Frontend loads without errors
- [ ] Backend health check works: `[BACKEND_URL]/api/health`
- [ ] Frontend can fetch data from backend
- [ ] No CORS errors in browser console
- [ ] All features work:
  - [ ] Brand list loads
  - [ ] Brand details display
  - [ ] Insights show data
  - [ ] Charts render correctly
  - [ ] Brand comparison works
- [ ] Tested on mobile (responsive design)
- [ ] Checked both Railway and Vercel logs for errors

**Time**: ~5 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 📝 Step 7: Documentation & Sharing

- [ ] Saved both URLs:
  - [ ] Frontend URL: `_____________________________`
  - [ ] Backend URL: `_____________________________`
- [ ] Added frontend URL to Portfolio website
- [ ] Updated CV/Resume with project URL
- [ ] Updated LinkedIn profile
- [ ] Updated GitHub README with live demo link
- [ ] Tested sharing link with someone else

**Time**: ~5 minutes  
**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 🎉 Final Status

**Deployment**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Total Time**: ~30 minutes

**Issues Encountered**:
```
[Write any issues you encountered here]
```

**Notes**:
```
[Any additional notes]
```

---

## 🆘 If Something Goes Wrong

1. **Check the troubleshooting section** in `DEPLOY_BRANDPULSE.md`
2. **Check logs**:
   - Railway: Service → Deployments → Latest → View Logs
   - Vercel: Project → Deployments → Latest → View Function Logs
3. **Verify environment variables** are set correctly
4. **Test backend health endpoint** directly
5. **Check browser console** for frontend errors

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Frontend URL loads without errors
- ✅ Backend health check returns success
- ✅ Frontend can fetch and display data
- ✅ No CORS errors
- ✅ All features work as expected
- ✅ URLs are shareable and accessible

---

**Congratulations! Your BrandPulse is now live! 🎉**

