'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Grid, List, Upload, ChevronRight, Home, Trash2 } from 'lucide-react'
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
import { FolderCard } from '@/components/folder-card'
import { UploadDialog } from '@/components/upload-dialog'
import { cn } from '@/lib/utils'
import type { S3File, S3Folder, MediaManagerConfig } from '@/types'

interface MediaGridProps {
  files: S3File[]
  folders: S3Folder[]
  loading?: boolean
  currentPath?: string
  onDelete?: (file: S3File) => void
  onPreview?: (file: S3File) => void
  onUpload?: (files: File[]) => void
  onNavigate?: (path: string) => void
  config?: MediaManagerConfig
  className?: string
}

export function MediaGrid({
  files,
  folders,
  loading = false,
  currentPath = '',
  onDelete,
  onPreview,
  onUpload,
  onNavigate,
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

  const filteredFolders = useMemo(() => {
    return folders.filter(folder => {
      return folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [folders, searchQuery])

  const breadcrumbs = useMemo(() => {
    if (!currentPath) return []
    const parts = currentPath.split('/').filter(Boolean)
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/') + '/'
    }))
  }, [currentPath])

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

  const handleFolderNavigate = (folder: S3Folder) => {
    onNavigate?.(folder.key)
  }

  const handleBreadcrumbNavigate = (path: string) => {
    onNavigate?.(path)
  }

  const handleHomeNavigate = () => {
    onNavigate?.('')
  }

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Loading breadcrumb */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-sm">
          <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl w-48" />
        </div>
        
        {/* Loading header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl flex-1 max-w-md" />
          <div className="flex items-center gap-3">
            <div className="h-12 w-36 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
            <div className="h-12 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
            <div className="h-12 w-32 bg-gradient-to-r from-blue-200 to-blue-300 animate-pulse rounded-2xl" />
          </div>
        </div>
        
        {/* Loading grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
              <div className="space-y-3">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                <div className="flex justify-between">
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-md" />
                  <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                </div>
                <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Breadcrumb Navigation */}
      {(currentPath || breadcrumbs.length > 0) && (
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-1 text-sm overflow-x-auto scrollbar-hide">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHomeNavigate}
              className="h-9 px-3 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 font-medium whitespace-nowrap transition-all duration-200 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center space-x-1 whitespace-nowrap">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBreadcrumbNavigate(crumb.path)}
                  className="h-9 px-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-medium transition-all duration-200 hover:scale-105"
                >
                  {crumb.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-gray-200/50 bg-white/70 backdrop-blur-sm shadow-sm focus:shadow-md focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
            <SelectTrigger className="w-36 h-12 rounded-2xl border-gray-200/50 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200/50 shadow-lg">
              <SelectItem value="all">All Files</SelectItem>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-1 shadow-sm">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                "h-10 px-4 rounded-xl transition-all duration-200",
                viewMode === 'grid' 
                  ? "bg-gray-900 text-white shadow-md hover:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                "h-10 px-4 rounded-xl transition-all duration-200",
                viewMode === 'list' 
                  ? "bg-gray-900 text-white shadow-md hover:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {config.mode === 'full' && onUpload && (
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.size > 0 && config.mode === 'full' && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              {selectedFiles.size}
            </div>
            <span className="text-sm font-medium text-blue-900">
              {selectedFiles.size} file{selectedFiles.size === 1 ? '' : 's'} selected
            </span>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleBulkDelete}
            className="ml-auto h-10 px-4 rounded-xl bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* File and Folder Grid/List */}
      {filteredFiles.length === 0 && filteredFolders.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-12 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {files.length === 0 && folders.length === 0 ? 'No files or folders found' : 'No items match your search'}
            </h3>
            <p className="text-gray-500 text-sm">
              {files.length === 0 && folders.length === 0 
                ? 'Upload some files to get started' 
                : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "space-y-3"
        )}>
          {/* Folders first */}
          {filteredFolders.map(folder => (
            <FolderCard
              key={folder.key}
              folder={folder}
              onNavigate={handleFolderNavigate}
            />
          ))}
          
          {/* Then files */}
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