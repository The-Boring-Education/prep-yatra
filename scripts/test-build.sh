#!/bin/bash

echo "🧪 Testing production build locally..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "Please ensure you have a .env.production file with the correct environment variables."
    exit 1
fi

# Run the build command
echo "📦 Running npm run build..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in ./dist directory"
    
    # Check if dist/index.html exists
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html found in dist directory"
    else
        echo "❌ index.html not found in dist directory"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Local build test completed successfully!" 