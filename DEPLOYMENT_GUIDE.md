# Deployment Guide for ByetHost

## ⚠️ Important Notice

ByetHost is primarily designed for PHP/MySQL hosting and **does not natively support Node.js applications** like Next.js. However, you can deploy your Next.js app as a static site using the static export feature.

## 🚀 Method 1: Static Export (Recommended for ByetHost)

### Step 1: Configure Next.js for Static Export

Update your `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: 'export',
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  // Set trailing slash for static hosting
  trailingSlash: true,
  // Base path if deploying to subdirectory
  // basePath: '/your-subdirectory',
};

export default nextConfig;
```

### Step 2: Build Static Files

```bash
# Install dependencies
npm install

# Build the static export
npm run build

# This creates an 'out' folder with static HTML/CSS/JS files
```

### Step 3: Upload to ByetHost

1. **Login to ByetHost Control Panel**
2. **Go to File Manager**
3. **Upload the contents of the `out` folder** to your public_html directory
4. **Ensure all files maintain their folder structure**

### Step 4: Configure .htaccess

Create an `.htaccess` file in your public_html directory:

```apache
# Enable pretty URLs
RewriteEngine On
RewriteBase /

# Handle Next.js static routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirect all requests to index.html
RewriteRule ^(.*)$ index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🚨 Limitations with Static Export

**Features that won't work:**
- ❌ API routes (payment webhooks, admin dashboard)
- ❌ Server-side rendering
- ❌ Image optimization
- ❌ Dynamic routing with parameters
- ❌ Real-time features

**Workarounds:**
- **API Routes**: Use external services (Firebase, Supabase) or separate backend
- **Admin Dashboard**: Deploy as separate static site or use external CMS
- **Payment Webhooks**: Use webhook forwarding services like webhook.site

## 🚀 Method 2: Alternative Hosting Solutions

Since you're building an e-commerce site with payment processing, consider these better alternatives:

### 1. Vercel (Recommended)
- **Free tier available**
- **Native Next.js support**
- **Automatic deployments**
- **Built-in API routes support**
- **Easy custom domain setup**

```bash
# Deploy to Vercel
npm i -g vercel
vercel --prod
```

### 2. Netlify
- **Free tier with serverless functions**
- **Git-based deployment**
- **Form handling**
- **API support**

### 3. Railway/Render
- **Node.js hosting**
- **Database support**
- **Environment variables**
- **Free tiers available**

### 4. DigitalOcean/VPS
- **Full control**
- **Node.js environment**
- **Database hosting**
- **~$5/month starting price**

## 🔧 Static Export Setup for Your Project

Let me help you configure your project for static export:

### 1. Update next.config.ts
<tool_call>file_path</arg_key>
<arg_value>c:/xampp/htdocs/store/next.config.ts
