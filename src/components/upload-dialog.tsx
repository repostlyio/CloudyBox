'use client'

import { useState, useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { Upload, X, File, Check, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn, formatFileSize } from '@/lib/utils'
import type { UploadProgress } from '@/types'

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload?: (files: File[], onProgress?: (file: File, progress: number, status: 'uploading' | 'completed' | 'error', error?: string) => void) => Promise<void>
  maxFileSize?: number
  allowedFileTypes?: string[]
}

export function UploadDialog({
  open,
  onOpenChange,
  onUpload,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes,
}: UploadDialogProps) {
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }))

    // Add rejected files with errors
    const rejectedUploads: UploadProgress[] = rejectedFiles.map(({ file, errors }) => ({
      file,
      progress: 0,
      status: 'error' as const,
      error: errors[0]?.message || 'File rejected',
    }))

    setUploadQueue(prev => [...prev, ...newUploads, ...rejectedUploads])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxFileSize,
    accept: allowedFileTypes ? 
      Object.fromEntries(allowedFileTypes.map(type => [type, []])) : 
      undefined,
    multiple: true,
  })

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (!onUpload) return

    setIsUploading(true)
    const validFiles = uploadQueue.filter(item => item.status === 'pending')
    
    // Progress callback to update individual file progress
    const onProgress = (file: File, progress: number, status: 'uploading' | 'completed' | 'error', error?: string) => {
      setUploadQueue(prev => 
        prev.map(upload => 
          upload.file === file 
            ? { ...upload, progress, status, error }
            : upload
        )
      )
    }

    try {
      // Call the actual upload function with progress callback
      await onUpload(validFiles.map(item => item.file), onProgress)
    } catch (error) {
      // Mark any remaining files as errored
      setUploadQueue(prev => 
        prev.map(upload => 
          upload.status === 'uploading' || upload.status === 'pending'
            ? { ...upload, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
            : upload
        )
      )
    } finally {
      setIsUploading(false)
    }
  }

  const clearCompleted = () => {
    setUploadQueue(prev => prev.filter(item => item.status !== 'completed'))
  }

  const clearAll = () => {
    if (!isUploading) {
      setUploadQueue([])
    }
  }

  const pendingCount = uploadQueue.filter(item => item.status === 'pending').length
  const completedCount = uploadQueue.filter(item => item.status === 'completed').length
  const errorCount = uploadQueue.filter(item => item.status === 'error').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div>
                <p className="mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Max size: {formatFileSize(maxFileSize)}
                  {allowedFileTypes && (
                    <span> • Supported: {allowedFileTypes.join(', ')}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium">Upload Queue</h3>
                  <div className="flex gap-2">
                    {pendingCount > 0 && (
                      <Badge variant="secondary">{pendingCount} pending</Badge>
                    )}
                    {completedCount > 0 && (
                      <Badge variant="default">{completedCount} completed</Badge>
                    )}
                    {errorCount > 0 && (
                      <Badge variant="destructive">{errorCount} failed</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {completedCount > 0 && (
                    <Button variant="outline" size="sm" onClick={clearCompleted}>
                      Clear Completed
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAll}
                    disabled={isUploading}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {uploadQueue.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {item.file.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatFileSize(item.file.size)}
                        </span>
                      </div>
                      
                      {item.status === 'uploading' && (
                        <Progress value={item.progress} className="mt-1" />
                      )}
                      
                      {item.error && (
                        <p className="text-xs text-destructive mt-1">{item.error}</p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {item.status === 'completed' && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      {item.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                      {(item.status === 'pending' && !isUploading) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromQueue(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={uploadFiles}
                  disabled={isUploading || pendingCount === 0}
                >
                  {isUploading ? 'Uploading...' : `Upload ${pendingCount} Files`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}