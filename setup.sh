#!/bin/bash

# CloudyBox Setup Script
# This script helps you set up CloudyBox quickly

echo "🌤️  CloudyBox Setup Wizard"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file
echo ""
echo "⚙️  Setting up environment..."

if [ ! -f .env.example ]; then
    echo "❌ .env.example file not found"
    exit 1
fi

if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local file"
    else
        cp .env.example .env.local
        echo "✅ Created new .env.local from example"
    fi
else
    cp .env.example .env.local
    echo "✅ Created .env.local from example"
fi

# Interactive configuration
echo ""
echo "🔧 Let's configure your S3 settings..."
echo "   (You can also edit .env.local manually later)"
echo ""

read -p "Enter your S3 Access Key ID: " ACCESS_KEY
read -p "Enter your S3 Secret Access Key: " SECRET_KEY
read -p "Enter your S3 Bucket Name: " BUCKET_NAME
read -p "Enter your S3 Region (default: us-east-1): " REGION
REGION=${REGION:-us-east-1}
read -p "Enter your S3 Endpoint (leave empty for AWS S3): " ENDPOINT

# Update .env.local file
sed -i.bak "s/AWS_ACCESS_KEY_ID=.*/AWS_ACCESS_KEY_ID=$ACCESS_KEY/" .env.local
sed -i.bak "s/AWS_SECRET_ACCESS_KEY=.*/AWS_SECRET_ACCESS_KEY=$SECRET_KEY/" .env.local
sed -i.bak "s/S3_BUCKET=.*/S3_BUCKET=$BUCKET_NAME/" .env.local
sed -i.bak "s/AWS_REGION=.*/AWS_REGION=$REGION/" .env.local

if [ ! -z "$ENDPOINT" ]; then
    sed -i.bak "s|S3_ENDPOINT=.*|S3_ENDPOINT=$ENDPOINT|" .env.local
fi

# Remove backup file
rm -f .env.local.bak

echo ""
echo "✅ Environment configuration updated"

# CORS configuration
echo ""
echo "🔧 CORS Configuration"
echo "   CORS is required for file uploads to work properly."
echo ""
read -p "Do you want to configure CORS automatically? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "Configuring CORS..."
    npx ts-node src/scripts/configure-cors.ts
    if [ $? -eq 0 ]; then
        echo "✅ CORS configured successfully"
    else
        echo "⚠️  CORS configuration failed. You may need to configure it manually."
        echo "   See the README.md for manual CORS setup instructions."
    fi
else
    echo "⚠️  Skipping CORS configuration. You'll need to set this up manually."
    echo "   See the README.md for CORS setup instructions."
fi

# Build the project
echo ""
echo "🏗️  Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors and try again."
    exit 1
fi

echo "✅ Build completed successfully"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Visit http://localhost:3000/media-manager to access CloudyBox"
echo ""
echo "If you encounter any issues:"
echo "- Check the troubleshooting section in README.md"
echo "- Verify your S3 credentials and permissions"
echo "- Ensure CORS is properly configured"
echo "- Create an issue at: https://github.com/repostlyio/CloudyBox/issues"
echo ""
echo "⭐ If you find CloudyBox useful, please star the repository!"
echo "   https://github.com/repostlyio/CloudyBox"
echo ""
echo "Happy file managing! 🚀"