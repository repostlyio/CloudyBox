import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return 'image'
    case 'pdf':
      return 'file-text'
    case 'doc':
    case 'docx':
      return 'file-text'
    case 'xls':
    case 'xlsx':
      return 'file-spreadsheet'
    case 'zip':
    case 'rar':
    case '7z':
      return 'file-archive'
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return 'video'
    case 'mp3':
    case 'wav':
    case 'flac':
      return 'music'
    default:
      return 'file'
  }
}

export function isImageFile(fileName: string): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')
}

export function formatDate(date: Date | string | number | undefined | null): string {
  if (!date) {
    return 'Unknown'
  }

  let dateObject: Date
  
  if (date instanceof Date) {
    dateObject = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObject = new Date(date)
  } else {
    return 'Invalid Date'
  }

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    return 'Invalid Date'
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObject)
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Invalid Date'
  }
}