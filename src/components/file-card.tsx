'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye, 
  Copy,
  FileText,
  File,
  Music,
  Video,
  Archive
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn, formatFileSize, formatDate, isImageFile } from '@/lib/utils'
import type { S3File } from '@/types'

interface FileCardProps {
  file: S3File
  onDelete?: (file: S3File) => void
  onPreview?: (file: S3File) => void
  isSelected?: boolean
  onSelect?: (file: S3File) => void
  mode?: 'read-only' | 'full'
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
        <Eye className="w-4 h-4 text-blue-600" />
      </div>
    case 'video':
      return <Video className="w-8 h-8 text-purple-600" />
    case 'audio':
      return <Music className="w-8 h-8 text-green-600" />
    case 'document':
      return <FileText className="w-8 h-8 text-red-600" />
    case 'archive':
      return <Archive className="w-8 h-8 text-orange-600" />
    default:
      return <File className="w-8 h-8 text-gray-600" />
  }
}

export function FileCard({ 
  file, 
  onDelete, 
  onPreview, 
  isSelected = false, 
  onSelect,
  mode = 'full' 
}: FileCardProps) {
  const [imageError, setImageError] = useState(false)
  const [signedUrl, setSignedUrl] = useState<string>('')
  const [loadingUrl, setLoadingUrl] = useState(false)
  const isImage = isImageFile(file.name)

  const getSignedUrl = useCallback(async () => {
    if (signedUrl || loadingUrl) return signedUrl

    try {
      setLoadingUrl(true)
      const response = await fetch(`/api/media/signed-url?key=${encodeURIComponent(file.key)}`)
      const data = await response.json()
      
      if (data.success && data.data?.url) {
        setSignedUrl(data.data.url)
        return data.data.url
      }
      
      throw new Error(data.error || 'Failed to get signed URL')
    } catch (error) {
      console.error('Failed to get signed URL:', error)
      return ''
    } finally {
      setLoadingUrl(false)
    }
  }, [file.key, signedUrl, loadingUrl])

  // Preload signed URL for images
  useEffect(() => {
    if (isImage) {
      getSignedUrl()
    }
  }, [file.key, isImage, getSignedUrl])

  const handleCopyUrl = async () => {
    try {
      const url = await getSignedUrl()
      if (url) {
        await navigator.clipboard.writeText(url)
      }
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleDownload = async () => {
    try {
      const url = await getSignedUrl()
      if (url) {
        const link = document.createElement('a')
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect?.(file)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* File Preview */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {isImage && !imageError && signedUrl ? (
              <Image
                src={signedUrl}
                alt={file.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : isImage && loadingUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
            )}
            
            {/* Actions overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              {onPreview && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(file)
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* File Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="text-sm font-medium truncate" 
                title={file.name}
              >
                {file.name}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onPreview && (
                    <DropdownMenuItem onClick={() => onPreview(file)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyUrl}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  {mode === 'full' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete?.(file)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {file.type}
              </Badge>
              <span>{formatFileSize(file.size)}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              {formatDate(file.lastModified)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}