# 🚀 Render Deployment Checklist - Mami Papa Babies & Kids

## ✅ Pre-Deployment Checklist

### Project Setup
- [ ] Project pushed to GitHub
- [ ] `render.yaml` file created
- [ ] Environment variables identified
- [ ] Build tested locally (`npm run build`)
- [ ] All dependencies in package.json

### Code Review
- [ ] Admin credentials correct (barbarakatusabe999@gmail.com / QWer12@*)
- [ ] Marzpay API endpoints correct
- [ ] Meta Pixel ID: 2621239424886813
- [ ] Google Ads ID: AW-17957602155
- [ ] WhatsApp number: +256783468608

## 🌐 Deployment Steps

### 1. GitHub Setup
- [ ] Go to github.com
- [ ] Create new repository: `mami-paba-store`
- [ ] Push local code to GitHub
- [ ] Verify all files are uploaded

### 2. Render Setup
- [ ] Go to render.com
- [ ] Sign up/login with GitHub
- [ ] Click "New Web Service"
- [ ] Connect your repository
- [ ] Configure build settings

### 3. Configuration
- [ ] Name: `mami-paba-store`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Node Version: `18`
- [ ] Health Check Path: `/`

### 4. Environment Variables
Add these in Render dashboard:
- [ ] `NODE_VERSION=18`
- [ ] `NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com`
- [ ] `NEXT_PUBLIC_META_PIXEL_ID=2621239424886813`
- [ ] `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17957602155`
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER=+256783468608`
- [ ] `MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1`
- [ ] `MARZPAY_API_CREDENTIALS=your_actual_credentials`

## ✅ Post-Deployment Testing

### Basic Functionality
- [ ] Homepage loads correctly
- [ ] Product grid displays (2/3/4 columns)
- [ ] Categories section works
- [ ] Add to cart functionality
- [ ] Cart sidebar opens/closes
- [ ] Checkout flow works
- [ ] Form validation works

### Admin Features
- [ ] Login page accessible (/auth)
- [ ] Admin login works with credentials
- [ ] Product management accessible
- [ ] Add/edit/delete products work
- [ ] Admin session persists

### Payment & Analytics
- [ ] Marzpay integration loads
- [ ] Payment form validates phone/email
- [ ] Meta Pixel fires on page load
- [ ] Google Analytics tracking active
- [ ] WhatsApp button functions

### Responsive Design
- [ ] Mobile layout (2 columns)
- [ ] Tablet layout (3 columns)
- [ ] Desktop layout (4 columns)
- [ ] Header responsive
- [ ] Cart mobile-friendly

## 🔧 Advanced Configuration

### Custom Domain (Optional)
- [ ] Custom domain added in Render
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] HTTPS redirect working

### Database (Optional)
- [ ] PostgreSQL service created
- [ ] Connection strings configured
- [ ] Data migration planned
- [ ] LocalStorage data backed up

## 🚨 Troubleshooting Guide

### Build Failures
**Issue**: Build fails in Render
**Solution**: 
1. Check build logs in Render dashboard
2. Verify `package.json` scripts
3. Ensure all dependencies are listed

### Environment Variables Not Working
**Issue**: Variables not accessible
**Solution**:
1. Use `NEXT_PUBLIC_` prefix for client-side
2. Restart service after adding variables
3. Check for typos in variable names

### Payment Webhook Issues
**Issue**: Webhooks not receiving data
**Solution**:
1. Test webhook endpoint manually
2. Check Render logs for errors
3. Verify Marzpay configuration

### Performance Issues
**Issue**: Site loads slowly
**Solution**:
1. Enable caching in Render
2. Optimize images
3. Consider upgrading to paid tier

## 📞 Support Contacts

### Render Support
- Documentation: docs.render.com
- Status: status.render.com
- Support: support@render.com

### Project Support
- WhatsApp: +256 783 468 608
- Email: info@mamipaba.com

## 🎉 Go Live!

When all checkboxes are checked:
- ✅ Your store is live on Render
- ✅ All features working correctly
- ✅ Ready for customers
- ✅ Payment processing active
- ✅ Analytics tracking enabled

**Your Store URL**: `https://your-app-name.onrender.com`
