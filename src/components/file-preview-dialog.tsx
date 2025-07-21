'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Download, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isImageFile, formatFileSize, formatDate } from '@/lib/utils'
import type { S3File } from '@/types'

interface FilePreviewDialogProps {
  file: S3File | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreviewDialog({ file, open, onOpenChange }: FilePreviewDialogProps) {
  const [imageError, setImageError] = useState(false)
  const [signedUrl, setSignedUrl] = useState<string>('')
  const [loadingUrl, setLoadingUrl] = useState(false)

  const getSignedUrl = useCallback(async () => {
    if (!file || signedUrl || loadingUrl) return signedUrl

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
  }, [file, signedUrl, loadingUrl])

  // Get signed URL when dialog opens
  useEffect(() => {
    if (open && file) {
      getSignedUrl()
    }
  }, [open, file, getSignedUrl])
  
  if (!file) return null

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

  const handleOpenInNewTab = async () => {
    try {
      const url = await getSignedUrl()
      if (url) {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  const renderPreview = () => {
    if (loadingUrl) {
      return (
        <div className="p-8 bg-muted rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      )
    }

    if (isImageFile(file.name) && !imageError && signedUrl) {
      return (
        <div className="relative w-full max-h-96 bg-muted rounded-lg overflow-hidden">
          <Image
            src={signedUrl}
            alt={file.name}
            width={800}
            height={600}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      )
    }

    if (file.type === 'video' && signedUrl) {
      return (
        <div className="relative w-full max-h-96 bg-muted rounded-lg overflow-hidden">
          <video
            src={signedUrl}
            controls
            className="w-full h-full object-contain"
          >
            Your browser does not support video playback.
          </video>
        </div>
      )
    }

    if (file.type === 'audio' && signedUrl) {
      return (
        <div className="p-8 bg-muted rounded-lg text-center">
          <audio src={signedUrl} controls className="w-full max-w-md mx-auto">
            Your browser does not support audio playback.
          </audio>
        </div>
      )
    }

    // Default preview for unsupported file types
    return (
      <div className="p-8 bg-muted rounded-lg text-center">
        <div className="text-muted-foreground">
          <p className="mb-2">Preview not available for this file type</p>
          <p className="text-sm">Click &ldquo;Open in New Tab&rdquo; to view the file</p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="truncate">{file.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{file.type}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(file.lastModified)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 max-h-[calc(90vh-200px)] overflow-auto">
          {renderPreview()}
        </div>

        {/* File Details */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">File Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">File Name:</span>
              <p className="font-mono break-all">{file.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p>{file.type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Modified:</span>
              <p>{formatDate(file.lastModified)}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Key:</span>
              <p className="font-mono text-xs break-all mt-1">{file.key}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}