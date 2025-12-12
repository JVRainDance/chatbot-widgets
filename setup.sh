#!/bin/bash

# Secure Chatbot Setup Script
# Run this to deploy your secure chatbot proxy

echo "🤖 Secure Chatbot Deployment Script"
echo "===================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Prerequisites checked"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Run: vercel login"
echo "2. Run: vercel --prod"
echo "3. Copy your deployment URL"
echo "4. Add environment variables in Vercel dashboard"
echo "5. Update chatbot files with your Vercel URL"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""

read -p "Deploy to Vercel now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "⚠️  IMPORTANT: Add environment variables in Vercel dashboard"
    echo "   Go to: https://vercel.com → Your Project → Settings → Environment Variables"
    echo ""
    echo "   Copy variables from .env.example"
    echo ""
fi

echo "✅ Setup complete! Happy chatting 🎉"
