#!/bin/bash

echo "🚀 Building Mami Papa Babies & Kids for Static Export..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf out
rm -rf .next

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for static export
echo "🏗️  Building static export..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    echo "✅ Build successful! Static files are in the 'out' directory."
    echo ""
    echo "📁 To deploy to ByetHost:"
    echo "1. Upload all files from the 'out' folder to your public_html directory"
    echo "2. Copy the .htaccess file to your public_html directory"
    echo "3. Ensure all folder structures are maintained"
    echo ""
    echo "📊 Build statistics:"
    echo "Total files: $(find out -type f | wc -l)"
    echo "Total size: $(du -sh out | cut -f1)"
    echo ""
    echo "⚠️  Important limitations:"
    echo "- API routes (payment webhooks, admin) will not work"
    echo "- Consider using external services for backend functionality"
    echo "- For full functionality, use Vercel, Netlify, or Node.js hosting"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
