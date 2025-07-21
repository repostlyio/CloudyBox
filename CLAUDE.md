# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CloudyBox is a modern, secure, and embeddable S3 media manager built with Next.js 15.4.2, React 19, and Tailwind CSS 4. It provides a clean interface for managing files in any S3-compatible storage service (AWS S3, Hetzner, DigitalOcean Spaces, etc.).

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
S3_ENDPOINT=https://your-endpoint.com  # Optional for S3-compatible services
```

## Architecture

### Clean Architecture Structure
- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - Reusable UI components
- `/src/lib/` - Utility functions and configurations
- `/src/services/` - Business logic and external service integrations
- `/src/types/` - TypeScript type definitions

### Key Components
- `FileCard` - Individual file display with actions
- `MediaGrid` - Main grid/list view with search and filters
- `UploadDialog` - Drag-and-drop file upload interface
- `FilePreviewDialog` - File preview with download/view options
- `DeleteConfirmDialog` - Confirmation for file deletions

### API Routes
- `GET /api/media/list` - List files in S3 bucket
- `DELETE /api/media/delete` - Delete file from S3
- `POST /api/media/upload-url` - Get pre-signed upload URL
- `GET /api/media/file-url` - Get signed file access URL

### Tech Stack
- **Framework**: Next.js 15.4.2 with App Router and TypeScript
- **UI Library**: shadcn/ui components with Tailwind CSS 4
- **Storage**: AWS SDK v3 for S3-compatible services
- **File Handling**: react-dropzone for drag-and-drop uploads
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages

### Features Implemented
- Drag-and-drop file uploads with progress tracking
- Grid and list view modes
- File search and type filtering
- Image/video/audio preview
- Secure file deletion with confirmation
- Responsive design with mobile support
- Embedding support with read-only/full modes
- Error handling and loading states

### Usage Modes
- **Full Mode** (`/media-manager`): Complete file management with upload/delete
- **Read-Only Mode** (`/media-manager?mode=read-only`): View and download only
- **Embedded Mode** (`/media-manager?embed=true`): Optimized for iframe embedding