# CloudyBox 🌤️

A modern, secure, and embeddable S3 media manager built with React, Next.js, and Tailwind CSS. Connect to any S3-compatible storage service and manage your files with ease.

![CloudyBox Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=CloudyBox+Media+Manager)

## ✨ Features

- 🔗 **S3 Compatible** - Works with AWS S3, Hetzner, DigitalOcean Spaces, and any S3-compatible service
- 📁 **File Management** - Upload, preview, download, and delete files with a modern interface
- 🎯 **Drag & Drop** - Intuitive drag-and-drop file upload with progress tracking
- 🖼️ **Media Preview** - Built-in preview for images, videos, and audio files
- 🔍 **Search & Filter** - Find files quickly with search and file type filters
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🔒 **Secure** - Token-based authentication and secure file handling
- 📦 **Embeddable** - Can be embedded in other applications via iframe
- ⚡ **Fast** - Built with Next.js 15 and React 19 for optimal performance

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd cloudybox
npm install
```

### 2. Environment Setup

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

### 3. Configure CORS (Important for Uploads)

Your S3 bucket needs CORS configuration to allow file uploads from your web application:

```bash
# Option 1: Use the provided script (recommended)
npm run configure-cors

# Option 2: Configure manually in your S3 provider's console
```

**Manual CORS Configuration:**
Add this CORS policy to your S3 bucket:

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

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

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
│   ├── file-card.tsx     # Individual file display
│   ├── media-grid.tsx    # Main grid/list view
│   └── upload-dialog.tsx # File upload interface
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

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 15.4.2 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Storage**: AWS SDK v3 for S3-compatible services
- **File Upload**: react-dropzone for drag-and-drop
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages

## 🔒 Security

- Pre-signed URLs for secure file uploads
- Token-based authentication support
- No client-side storage of credentials
- Secure file deletion with confirmation
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)
