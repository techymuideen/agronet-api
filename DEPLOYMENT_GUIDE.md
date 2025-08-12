# AgroNet API - Render Deployment Guide

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A GitHub account with your code repository
3. MongoDB Atlas database (you already have this configured)

## Step-by-Step Deployment Process

### Step 1: Prepare Your Application for Production

1. **Ensure your code is pushed to GitHub:**

   ```bash
   git add .
   git commit -m "Configure MongoDB Atlas and prepare for deployment"
   git push origin main
   ```

2. **Verify your package.json scripts:**
   Your package.json should have these scripts (already configured):
   ```json
   {
     "scripts": {
       "build": "nest build",
       "start": "nest start",
       "start:prod": "node dist/main"
     }
   }
   ```

### Step 2: Create a New Web Service on Render

1. **Log in to Render Dashboard:**
   - Go to https://render.com and sign in
   - Click "New +" and select "Web Service"

2. **Connect Your Repository:**
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account if not already connected
   - Select your repository: `techymuideen/agronet-api`
   - Click "Connect"

### Step 3: Configure Your Web Service

**Basic Configuration:**

- **Name:** `agronet-api` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., Oregon (US West) or Frankfurt (EU Central))
- **Branch:** `main`
- **Root Directory:** Leave empty (if API is in root) or specify folder path
- **Runtime:** `Node`

**Build Configuration:**

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

**Instance Type:**

- **Free Tier:** Choose "Free" for development/testing
- **Paid Tier:** Choose "Starter" ($7/month) or higher for production

### Step 4: Set Environment Variables

In the "Environment" section, add these environment variables:


**Optional Variables:**

```
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

**Important Security Note:**

- Generate a strong, random JWT_SECRET (use a tool like: https://www.grc.com/passwords.htm)
- Never use the default JWT_SECRET in production

### Step 5: Deploy Your Application

1. **Click "Create Web Service"**
   - Render will start building your application
   - This process takes 5-15 minutes for the first deploy

2. **Monitor the Build Process:**
   - Watch the build logs for any errors
   - The build will show "Live" when successful

### Step 6: Verify Your Deployment

1. **Test Your API:**
   - Your API will be available at: `https://your-service-name.onrender.com`
   - Test endpoints like: `https://your-service-name.onrender.com/user`

2. **Check Health:**
   - Monitor the "Metrics" tab for performance
   - Check "Events" for any deployment issues

### Step 7: Configure Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to "Settings" > "Custom Domains"
   - Add your domain (e.g., `api.yourapp.com`)
   - Configure DNS records as instructed

## Important Production Considerations

### Security Checklist

- ✅ Strong JWT_SECRET configured
- ✅ Environment variables secured
- ✅ CORS configured for your frontend domains
- ✅ MongoDB Atlas IP whitelist configured (0.0.0.0/0 for cloud services)

### Performance Tips

1. **Enable Auto-Deploy:**
   - Your service will auto-deploy when you push to main branch

2. **Monitor Resource Usage:**
   - Free tier has limitations (750 hours/month)
   - Upgrade to paid tier for production use

3. **Database Optimization:**
   - Your MongoDB Atlas connection is already optimized
   - Monitor database performance in Atlas dashboard

### Troubleshooting Common Issues

**Build Failures:**

- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs for specific errors

**Runtime Errors:**

- Check environment variables are set correctly
- Verify MongoDB connection string
- Monitor application logs in Render dashboard

**Connection Issues:**

- Ensure MongoDB Atlas allows connections from 0.0.0.0/0
- Check if your IP whitelist includes cloud provider IPs

### Post-Deployment Steps

1. **Update Frontend Configuration:**
   - Update your frontend to use the new API URL
   - Update CORS_ORIGINS environment variable with frontend URLs

2. **Monitor Application:**
   - Set up uptime monitoring
   - Configure error alerting
   - Monitor performance metrics

3. **Backup Strategy:**
   - MongoDB Atlas provides automatic backups
   - Consider implementing application-level backups for critical data

## Environment Variables Reference

```bash
# Required for all environments
NODE_ENV=production
PORT=10000

# Security (CRITICAL - change in production)
JWT_SECRET=your-super-secure-production-jwt-secret-key

# CORS (update with your actual frontend domains)
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## Support Resources

- **Render Documentation:** https://render.com/docs
- **NestJS Deployment Guide:** https://docs.nestjs.com/deployment
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

Your API will be accessible at: `https://your-service-name.onrender.com`

Make sure to test all endpoints after deployment and update your frontend configuration accordingly.
