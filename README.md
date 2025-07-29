# CloudyBox 🌤️

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/repostlyio/CloudyBox?style=flat-square)](https://github.com/repostlyio/CloudyBox/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/repostlyio/CloudyBox?style=flat-square)](https://github.com/repostlyio/CloudyBox/network)
[![GitHub issues](https://img.shields.io/github/issues/repostlyio/CloudyBox?style=flat-square)](https://github.com/repostlyio/CloudyBox/issues)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)

**A modern, secure, and embeddable S3 media manager with a beautiful glass morphism UI**

*Built with Next.js 15, React 19, and Tailwind CSS. Connect to any S3-compatible storage service and manage your files with ease.*

  [**📖 Documentation**](#-quick-start) • [**🐛 Report Bug**](https://github.com/repostlyio/CloudyBox/issues) • [**💡 Request Feature**](https://github.com/repostlyio/CloudyBox/issues)

</div>

---
![CloudyBox Screenshot](https://ph-files.imgix.net/0d3a5ccc-57cd-4261-8006-bcff4223d2da.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&fm=pjpg&w=1100&h=561&fit=max&frame=1&dpr=1)

## ✨ Features

- 🔗 **S3 Compatible** - Works with AWS S3, Hetzner, DigitalOcean Spaces, and any S3-compatible service
- 📁 **File Management** - Upload, preview, download, and delete files with a modern interface
- 🗂️ **Folder Navigation** - Browse and navigate through S3 folder structures with breadcrumb navigation
- 🎯 **Drag & Drop** - Intuitive drag-and-drop file upload with progress tracking
- 🖼️ **Media Preview** - Built-in preview for images, videos, and audio files
- 🔍 **Search & Filter** - Find files and folders quickly with search and file type filters
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Glass morphism design with hover animations and micro-interactions
- 🌈 **Multiple View Modes** - Switch between grid and list views
- ✨ **Bulk Operations** - Select and delete multiple files at once
- 🔒 **Secure** - Token-based authentication and secure file handling
- 📦 **Embeddable** - Can be embedded in other applications via iframe
- ⚡ **Fast** - Built with Next.js 15 and React 19 for optimal performance
- 🎭 **Glass Effect UI** - Modern design with backdrop blur and translucent elements

## 🚀 Quick Start

### ⚡ Automated Setup (Recommended)

For the fastest setup, use our interactive setup script:

```bash
git clone https://github.com/repostlyio/CloudyBox.git
cd CloudyBox
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Install dependencies
- ✅ Create environment file
- ✅ Configure S3 credentials interactively
- ✅ Set up CORS automatically
- ✅ Build the project
- ✅ Provide next steps

### 📚 Manual Setup

If you prefer manual setup:

#### 1. Clone and Install

```bash
git clone https://github.com/repostlyio/CloudyBox.git
cd CloudyBox
npm install
```

#### 2. Environment Setup

Copy the example environment file and configure your S3 credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your S3 configuration:

```env
# S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name

# Optional: For S3-compatible services (Hetzner, DigitalOcean Spaces, etc.)
S3_ENDPOINT=https://your-s3-compatible-endpoint.com

# Optional: Basic authentication token
CLOUDYBOX_ACCESS_TOKEN=your_secure_token
```

#### 3. Configure CORS (Important for Uploads)

Your S3 bucket needs CORS configuration to allow file uploads from your web application:

```bash
# Option 1: Use the provided script (recommended)
npm run configure-cors

# Option 2: Configure manually in your S3 provider's console
```

**Why CORS is needed:** CORS (Cross-Origin Resource Sharing) allows your web application to upload files directly to S3 from the browser. Without proper CORS configuration, uploads will fail with CORS errors.

**Manual CORS Configuration:**
If you prefer to configure CORS manually, add this policy to your S3 bucket in your provider's console:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001", 
      "https://your-domain.com"
    ],
    "ExposeHeaders": ["ETag", "x-amz-version-id"],
    "MaxAgeSeconds": 3600
  }
]
```

**For different S3 providers:**
- **AWS S3**: Add CORS in S3 Console → Bucket → Permissions → CORS
- **Hetzner Storage**: Configure in Hetzner Console → Storage → CORS
- **DigitalOcean Spaces**: Set in DigitalOcean Control Panel → Spaces → Settings → CORS

#### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 👶 First Time User Guide

### What You Need Before Starting

1. **S3-Compatible Storage Account**
   - AWS S3 (most common)
   - Hetzner Storage Box
   - DigitalOcean Spaces
   - Any S3-compatible service

2. **Storage Credentials**
   - Access Key ID
   - Secret Access Key
   - Bucket name
   - Region (and endpoint if not AWS)

3. **Basic Permissions**
   - Your credentials need read/write access to the bucket
   - Ability to configure CORS on the bucket

### Step-by-Step Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/repostlyio/CloudyBox.git
   cd CloudyBox
   ```

2. **Run the setup script** (easiest way)
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   The script will guide you through everything!

3. **Or set up manually**
   - Copy `.env.example` to `.env.local`
   - Fill in your S3 credentials
   - Run `npm install`
   - Run `npm run configure-cors`
   - Run `npm run dev`

4. **Access CloudyBox**
   - Open http://localhost:3000/media-manager
   - Start uploading and managing files!

### What If Something Goes Wrong?

- Check the [🔧 Troubleshooting](#-troubleshooting) section below
- Verify your S3 credentials work with AWS CLI or similar tools
- Make sure CORS is configured correctly
- Check the browser console for error messages

## 📖 Usage

### Full Mode
Access the complete media manager with upload and delete capabilities:
```
http://localhost:3000/media-manager
```

### Read-Only Mode
Access the media manager in read-only mode (view and download only):
```
http://localhost:3000/media-manager?mode=read-only
```

### Embedded Mode
Embed the media manager in other applications:
```html
<iframe 
  src="http://localhost:3000/media-manager?embed=true" 
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

### With Authentication Token
```
http://localhost:3000/media-manager?token=your_secure_token
```

### Folder Navigation
CloudyBox automatically detects S3 folder structures (using `/` delimiter) and provides:
- **Breadcrumb navigation** for easy folder traversal
- **Folder cards** with hover animations and navigation
- **Path-based uploads** - files upload to the current folder
- **Responsive breadcrumbs** that collapse on mobile devices
- **Home button** to quickly return to root directory

## 🏗️ Architecture

CloudyBox follows clean architecture principles:

```
src/
├── app/                    # Next.js App Router
│   ├── api/media/         # API routes for S3 operations
│   ├── media-manager/     # Main media manager page
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── file-card.tsx     # Individual file display with modern design
│   ├── folder-card.tsx   # Folder display with navigation
│   ├── media-grid.tsx    # Main grid/list view with breadcrumbs
│   ├── upload-dialog.tsx # File upload interface
│   ├── file-preview-dialog.tsx # File preview modal
│   ├── delete-confirm-dialog.tsx # Deletion confirmation
│   └── media-manager-client.tsx # Main client component
├── lib/                  # Utility functions
│   ├── s3-client.ts      # S3 client configuration
│   └── utils.ts          # Helper functions
├── services/             # Business logic
│   └── s3-service.ts     # S3 operations
└── types/               # TypeScript definitions
    └── index.ts         # Type definitions
```

## 🔧 Configuration

### S3-Compatible Services

CloudyBox works with various S3-compatible services:

#### AWS S3
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET=your-bucket
# S3_ENDPOINT not needed for AWS S3
```

#### Hetzner Storage Box
```env
AWS_ACCESS_KEY_ID=your_hetzner_key
AWS_SECRET_ACCESS_KEY=your_hetzner_secret
AWS_REGION=us-east-1
S3_BUCKET=your-bucket
S3_ENDPOINT=https://your-project.s3.hel1.hetzner.cloud
```

#### DigitalOcean Spaces
```env
AWS_ACCESS_KEY_ID=your_do_key
AWS_SECRET_ACCESS_KEY=your_do_secret
AWS_REGION=nyc3
S3_BUCKET=your-space-name
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t cloudybox .
docker run -p 3000:3000 --env-file .env.local cloudybox
```

## 🎨 Modern Design System

CloudyBox features a cutting-edge design system inspired by 2025 UI/UX trends:

### Glass Morphism Effects
- **Backdrop blur** for modern translucent interfaces
- **Soft shadows** with subtle depth
- **Gradient backgrounds** for visual hierarchy

### Interactive Elements
- **Hover animations** with scale and translate effects
- **Micro-interactions** throughout the interface
- **Loading skeletons** with gradient animations
- **Smooth transitions** (300ms duration)

### Responsive Design
- **Mobile-first** approach with touch-friendly targets (44px+)
- **Adaptive grid** (1-5 columns based on screen size)
- **Collapsible navigation** on smaller screens
- **Hidden scrollbars** for clean aesthetics

### Modern Components
- **Enhanced file cards** with floating action buttons
- **Animated folder states** (closed/open on hover)
- **Glass effect containers** for breadcrumbs and controls
- **Gradient buttons** with hover states

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 15.4.2 with App Router and TypeScript
- **UI Library**: React 19 with modern hooks and state management
- **Styling**: Tailwind CSS 4 + shadcn/ui components + Custom glass morphism effects
- **Storage**: AWS SDK v3 for S3-compatible services with folder support
- **File Upload**: react-dropzone for drag-and-drop with path-based uploads
- **Icons**: Lucide React with animated folder states
- **Notifications**: Sonner for toast messages
- **Design**: Modern glass morphism with backdrop blur effects
- **Animations**: CSS transitions with hover states and micro-interactions

## 🔒 Security

- Pre-signed URLs for secure file uploads
- Token-based authentication support
- No client-side storage of credentials
- Secure file deletion with confirmation
- Input validation and sanitization

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Failed to list files" Error
**Cause:** Incorrect S3 credentials or bucket configuration.
**Solution:**
```bash
# Check your .env file has correct values
# Verify bucket name matches exactly
# Ensure credentials have proper permissions
```

#### 2. CORS Upload Errors
**Symptoms:** Files fail to upload with CORS errors in browser console.
**Solutions:**
```bash
# Run the CORS configuration script
npx ts-node src/scripts/configure-cors.ts

# Or manually configure CORS in your S3 provider console
# Make sure your domain is in AllowedOrigins
```

#### 3. "Cannot read properties of undefined" 
**Cause:** Missing environment variables.
**Solution:**
```bash
# Ensure all required variables are set in .env or .env.local
# Check variable names match exactly (case-sensitive)
cp .env.example .env.local
# Edit .env.local with your actual values
```

#### 4. Images Not Loading
**Cause:** Signed URL generation failing or bucket permissions.
**Solution:**
```bash
# Check bucket public read permissions if needed
# Verify AWS credentials have GetObject permission
# Check S3_ENDPOINT is correct for your provider
```

#### 5. Folder Navigation Not Working
**Cause:** S3 delimiter configuration or empty folders.
**Solution:**
- Ensure your S3 structure uses `/` as folder delimiter
- Create test folders with files to verify navigation
- Check that S3Service is using `Delimiter: '/'` in ListObjectsV2Command

### Getting Help

1. **Check the browser console** for detailed error messages
2. **Verify environment variables** are correctly set
3. **Test S3 credentials** with AWS CLI or similar tools
4. **Check CORS configuration** in your S3 provider console
5. **Review bucket permissions** for required operations

### Required S3 Permissions

Your S3 credentials need these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

## 🤝 Contributing

We welcome contributions to CloudyBox! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Report issues via [GitHub Issues](https://github.com/repostlyio/CloudyBox/issues)
- 💡 **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve README, add examples, or write guides
- 🔧 **Code**: Fix bugs, add features, or improve performance
- 🎨 **Design**: UI/UX improvements and modern design enhancements

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/CloudyBox.git
   cd CloudyBox
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your local environment:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your test S3 credentials
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### Contribution Guidelines

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following the existing code style
3. **Test your changes** thoroughly
4. **Run linting** to ensure code quality:
   ```bash
   npm run lint
   ```
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and create a pull request

### Pull Request Process

- Provide a clear description of changes
- Include screenshots for UI changes
- Reference any related issues
- Ensure all checks pass
- Be responsive to feedback during review

### Development Guidelines

- Follow the existing code structure and patterns
- Use TypeScript for type safety
- Follow the component-based architecture
- Keep accessibility in mind
- Test with different S3 providers when possible
- Update documentation for new features

### Issues and Support

- Check [existing issues](https://github.com/repostlyio/CloudyBox/issues) before creating new ones
- Use issue templates when available
- Provide detailed reproduction steps for bugs
- Include environment details (Node.js version, S3 provider, etc.)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)
