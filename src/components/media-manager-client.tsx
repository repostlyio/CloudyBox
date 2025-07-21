'use client'

import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { MediaGrid } from '@/components/media-grid'
import { FilePreviewDialog } from '@/components/file-preview-dialog'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog'
import type { S3File, MediaManagerConfig, ApiResponse, ListFilesResponse } from '@/types'

interface MediaManagerClientProps {
  mode: 'read-only' | 'full'
  token?: string
  embed: boolean
}

export function MediaManagerClient({ 
  mode, 
  token, 
  embed 
}: MediaManagerClientProps) {
  const [files, setFiles] = useState<S3File[]>([])
  const [loading, setLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<S3File | null>(null)
  const [deleteFile, setDeleteFile] = useState<S3File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const config: MediaManagerConfig = {
    mode,
    token,
  }

  const isEmbedded = embed

  // Load files on component mount
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/media/list')
      const data: ApiResponse<ListFilesResponse> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load files')
      }
      
      // Convert string dates back to Date objects
      const filesWithDates = (data.data?.files || []).map(file => {
        let lastModified: Date
        if (file.lastModified instanceof Date) {
          lastModified = file.lastModified
        } else {
          lastModified = new Date(file.lastModified)
          // If the date is invalid, use current date
          if (isNaN(lastModified.getTime())) {
            lastModified = new Date()
          }
        }
        
        return {
          ...file,
          lastModified
        }
      })
      
      setFiles(filesWithDates)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load files'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (uploadFiles: File[]) => {
    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        // Generate unique key
        const timestamp = Date.now()
        const key = `${timestamp}-${file.name}`
        
        // Get pre-signed upload URL
        const urlResponse = await fetch('/api/media/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            contentType: file.type,
          }),
        })
        
        const urlData: ApiResponse<{ uploadUrl: string }> = await urlResponse.json()
        
        if (!urlData.success || !urlData.data?.uploadUrl) {
          throw new Error('Failed to get upload URL')
        }
        
        // Upload file using pre-signed URL
        const uploadResponse = await fetch(urlData.data.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })
        
        if (!uploadResponse.ok) {
          // Check if it's a CORS error
          if (uploadResponse.status === 0 || uploadResponse.type === 'opaque') {
            throw new Error('CORS Error: Please check your S3 bucket CORS configuration. Make sure it allows PUT requests from your domain.')
          }
          throw new Error(`Upload failed (${uploadResponse.status}): ${uploadResponse.statusText}`)
        }
        
        return key
      })
      
      await Promise.all(uploadPromises)
      toast.success(`Successfully uploaded ${uploadFiles.length} file(s)`)
      
      // Reload files list
      await loadFiles()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      toast.error(message)
    }
  }

  const handleDelete = async (file: S3File) => {
    try {
      const response = await fetch(`/api/media/delete?key=${encodeURIComponent(file.key)}`, {
        method: 'DELETE',
      })
      
      const data: ApiResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete file')
      }
      
      toast.success('File deleted successfully')
      
      // Remove from local state
      setFiles(prev => prev.filter(f => f.key !== file.key))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete file'
      toast.error(message)
    } finally {
      setDeleteFile(null)
    }
  }

  const handlePreview = (file: S3File) => {
    setPreviewFile(file)
  }

  if (error && !files.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={loadFiles}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${isEmbedded ? 'p-4' : 'p-8'}`}>
      {!isEmbedded && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CloudyBox</h1>
              <p className="text-muted-foreground">
                Manage your S3 media files with ease
              </p>
            </div>
            {config.mode === 'read-only' && (
              <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Read-Only Mode
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`${isEmbedded ? '' : 'max-w-7xl mx-auto'}`}>
        <MediaGrid
          files={files}
          loading={loading}
          onDelete={(file) => setDeleteFile(file)}
          onPreview={handlePreview}
          onUpload={config.mode === 'full' ? handleUpload : undefined}
          config={config}
        />
      </div>

      {/* Dialogs */}
      <FilePreviewDialog
        file={previewFile}
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      />

      <DeleteConfirmDialog
        file={deleteFile}
        open={!!deleteFile}
        onOpenChange={(open) => !open && setDeleteFile(null)}
        onConfirm={handleDelete}
      />

      <Toaster />
    </div>
  )
}