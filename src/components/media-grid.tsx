'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid, List, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileCard } from '@/components/file-card'
import { UploadDialog } from '@/components/upload-dialog'
import { cn } from '@/lib/utils'
import type { S3File, MediaManagerConfig } from '@/types'

interface MediaGridProps {
  files: S3File[]
  loading?: boolean
  onDelete?: (file: S3File) => void
  onPreview?: (file: S3File) => void
  onUpload?: (files: File[]) => void
  config?: MediaManagerConfig
  className?: string
}

export function MediaGrid({
  files,
  loading = false,
  onDelete,
  onPreview,
  onUpload,
  config = { mode: 'full' },
  className
}: MediaGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = fileTypeFilter === 'all' || file.type === fileTypeFilter
      return matchesSearch && matchesType
    })
  }, [files, searchQuery, fileTypeFilter])

  const fileTypes = useMemo(() => {
    const types = new Set(files.map(file => file.type))
    return Array.from(types).sort()
  }, [files])

  const handleSelectFile = (file: S3File) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(file.key)) {
      newSelected.delete(file.key)
    } else {
      newSelected.add(file.key)
    }
    setSelectedFiles(newSelected)
  }

  const handleBulkDelete = () => {
    const filesToDelete = files.filter(file => selectedFiles.has(file.key))
    filesToDelete.forEach(file => onDelete?.(file))
    setSelectedFiles(new Set())
  }

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {config.mode === 'full' && onUpload && (
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.size > 0 && config.mode === 'full' && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedFiles.size} file{selectedFiles.size === 1 ? '' : 's'} selected
          </span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleBulkDelete}
            className="ml-auto"
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* File Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {files.length === 0 ? 'No files found' : 'No files match your search'}
          </div>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-2"
        )}>
          {filteredFiles.map(file => (
            <FileCard
              key={file.key}
              file={file}
              onDelete={config.mode === 'full' ? onDelete : undefined}
              onPreview={onPreview}
              isSelected={selectedFiles.has(file.key)}
              onSelect={handleSelectFile}
              mode={config.mode}
            />
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      {showUploadDialog && (
        <UploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUpload={onUpload}
          maxFileSize={config.maxFileSize}
          allowedFileTypes={config.allowedFileTypes}
        />
      )}
    </div>
  )
}