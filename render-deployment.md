# Deploy to Render - Complete Guide

## 🎯 Prerequisites
- GitHub account with your project uploaded
- Render account (free tier available)
- Your project ready for deployment

## 📋 Step 1: Prepare Your Project for Render

### 1.1 Update Environment Variables
Create `.env.production` file:

```env
# Marzpay Configuration
MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1
MARZPAY_API_CREDENTIALS=your_base64_encoded_credentials

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+256783468608

# Meta Pixel & Google Ads
NEXT_PUBLIC_META_PIXEL_ID=2621239424886813
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17957602155

# Admin Credentials (for production, use environment variables)
ADMIN_EMAIL=barbarakatusabe999@gmail.com
ADMIN_PASSWORD=QWer12@*
```

### 1.3 Create render.yaml Build Configuration
Create `render.yaml` in your project root:

```yaml
services:
  # Web Service
  - type: web
    name: mami-papa-store
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_VERSION
        value: 18
      - key: NEXT_PUBLIC_SITE_URL
        sync: false
        generateValue: https://mami-paba-store.onrender.com
      - key: MARZPAY_API_URL
        sync: false
        generateValue: https://wallet.wearemarz.com/api/v1
      - key: NEXT_PUBLIC_META_PIXEL_ID
        sync: false
        generateValue: 2621239424886813
      - key: NEXT_PUBLIC_GOOGLE_ADS_ID
        sync: false
        generateValue: AW-17957602155
      - key: NEXT_PUBLIC_WHATSAPP_NUMBER
        sync: false
        generateValue: +256783468608

  # PostgreSQL Database (Optional - for production)
  - type: pserv
    name: mami-paba-db
    plan: free
    env: docker
    dockerfilePath: ./dockerfile
    healthCheckPath: /
    envVars:
      - key: POSTGRES_DB
        sync: false
        generateValue: mami_paba_store
      - key: POSTGRES_USER
        sync: false
        generateValue: mami_paba_user
      - key: POSTGRES_PASSWORD
        sync: false
        generateValue: your_secure_password
```

## 📤 Step 2: Push to GitHub

### 2.1 Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit - Mami Papa Babies & Kids Store"
```

### 2.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) and create new repository
2. Name it `mami-paba-store` or similar
3. Don't initialize with README (you already have one)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/yourusername/mami-paba-store.git
git branch -M main
git push -u origin main
```

## 🌐 Step 3: Deploy to Render

### 3.1 Sign Up/Login to Render
1. Go to [render.com](https://render.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub" (recommended)

### 3.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. **"Connect a repository"**
3. Select your `mami-paba-store` repository
4. Click **"Connect"**

### 3.3 Configure Build Settings
Render will automatically detect Next.js. Configure:

**Basic Settings:**
- **Name**: `mami-paba-store`
- **Region**: Choose closest to your customers (likely Frankfurt)
- **Branch**: `main`

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18`

**Advanced Settings:**
- **Health Check Path**: `/`
- **Auto-Deploy**: ✅ Enabled

### 3.4 Add Environment Variables
In your service settings, add these environment variables:

```bash
NODE_VERSION=18
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1
NEXT_PUBLIC_META_PIXEL_ID=2621239424886813
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17957602155
NEXT_PUBLIC_WHATSAPP_NUMBER=+256783468608
MARZPAY_API_CREDENTIALS=your_actual_base64_credentials
```

### 3.5 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Your site will be available at `https://your-app-name.onrender.com`

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Test Your Live Site
1. Visit your Render URL
2. Test all features:
   - ✅ Product browsing
   - ✅ Add to cart
   - ✅ Checkout flow
   - ✅ Admin dashboard (/auth)
   - ✅ WhatsApp button

### 4.2 Configure Custom Domain (Optional)
1. In Render dashboard → your service → Settings
2. Click **"Custom Domains"**
3. Add your domain: `store.yourdomain.com`
4. Update DNS records as instructed by Render
5. Wait for SSL certificate (automatic)

### 4.3 Set Up Production Database (Optional)
If you want persistent data:

1. Add PostgreSQL service in Render
2. Update your app to use database
3. Migrate localStorage data to database

## 🚨 Important Notes for Your E-commerce Site

### Payment Processing
- Marzpay webhooks need a public URL
- Render provides this automatically
- Test webhook endpoint: `https://your-app.onrender.com/api/payment-webhook`

### Performance Optimization
- Render Free tier: 512MB RAM, 750 hours/month
- For production, consider paid tier ($7/month)
- Enable caching in Render settings

### Monitoring
- Render provides logs and metrics
- Set up alerts for downtime
- Monitor payment webhook failures

## 🔄 Step 5: Updates and Maintenance

### Automatic Deployments
With GitHub connected, every push to main branch triggers redeploy:

```bash
git add .
git commit -m "Update products or features"
git push origin main
```

### Manual Redeploy
In Render dashboard:
1. Go to your service
2. Click **"Manual Deploy"**
3. Select branch and deploy

## 🆘 Troubleshooting

### Common Issues

**Build Fails:**
- Check `package.json` scripts
- Verify Node version compatibility
- Review build logs in Render dashboard

**Environment Variables Not Working:**
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Restart service after adding variables
- Check for typos in variable names

**Payment Webhooks Not Working:**
- Verify webhook URL is accessible
- Check Marzpay dashboard for webhook configuration
- Review Render logs for webhook errors

**Site Not Loading:**
- Check build command: `npm install && npm run build`
- Verify start command: `npm start`
- Ensure port binding (Next.js handles automatically)

## 📞 Support Resources

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Status**: [status.render.com](https://status.render.com)
- **Community**: [community.render.com](https://community.render.com)

## 🎉 Success!

Once deployed, your Mami Papa Babies & Kids store will be:
- ✅ Fully functional e-commerce site
- ✅ Payment processing with Marzpay
- ✅ Admin dashboard
- ✅ Analytics tracking
- ✅ WhatsApp integration
- ✅ Mobile responsive
- ✅ Professional design

Your store URL will be: `https://your-app-name.onrender.com`
