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
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200/50">
          <Eye className="w-6 h-6 text-blue-600" />
        </div>
      )
    case 'video':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center border border-purple-200/50">
          <Video className="w-6 h-6 text-purple-600" />
        </div>
      )
    case 'audio':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center border border-green-200/50">
          <Music className="w-6 h-6 text-green-600" />
        </div>
      )
    case 'document':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center border border-red-200/50">
          <FileText className="w-6 h-6 text-red-600" />
        </div>
      )
    case 'archive':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center border border-orange-200/50">
          <Archive className="w-6 h-6 text-orange-600" />
        </div>
      )
    default:
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200/50">
          <File className="w-6 h-6 text-gray-600" />
        </div>
      )
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
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 border-0 bg-white/50 backdrop-blur-sm",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/10"
      )}
      onClick={() => onSelect?.(file)}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* File Preview */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200/50">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 gap-2">
              {onPreview && (
                <Button
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm border-0 h-8 w-8 p-0"
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
                className="bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm border-0 h-8 w-8 p-0"
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
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="text-sm font-semibold text-gray-900 truncate leading-5" 
                title={file.name}
              >
                {file.name}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 rounded-lg"
                  >
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

            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className="text-xs font-medium bg-gray-100 text-gray-700 border-0 px-2 py-1 rounded-md"
              >
                {file.type.toUpperCase()}
              </Badge>
              <span className="text-xs font-medium text-gray-500">{formatFileSize(file.size)}</span>
            </div>

            <div className="text-xs text-gray-400 font-medium">
              {formatDate(file.lastModified)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}