#!/bin/bash

# PrepYatra Deployment Script
# This script ensures clean builds and deployments

echo "🚀 Starting PrepYatra deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm ci --silent

# Generate sitemap and build
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output:"
    ls -la dist/
    echo ""
    echo "📊 Build statistics:"
    du -sh dist/js/* | head -10
    echo ""
    echo "🎯 Ready for deployment!"
    echo "💡 Remember to clear browser cache after deployment"
else
    echo "❌ Build failed!"
    exit 1
fi 