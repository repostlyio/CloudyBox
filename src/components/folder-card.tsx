'use client'

import { Folder, MoreVertical, FolderOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { S3Folder } from '@/types'

interface FolderCardProps {
  folder: S3Folder
  onNavigate?: (folder: S3Folder) => void
  isSelected?: boolean
  onSelect?: (folder: S3Folder) => void
  className?: string
}

export function FolderCard({
  folder,
  onNavigate,
  isSelected = false,
  onSelect,
  className
}: FolderCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || 
        (e.target as HTMLElement).closest('.folder-content')) {
      onNavigate?.(folder)
    }
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(folder)
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 group border-0 bg-white/50 backdrop-blur-sm",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/10",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        <div className="folder-content space-y-4">
          {/* Folder Icon */}
          <div className="relative flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/20 group-hover:from-blue-400/20 group-hover:to-blue-600/30 transition-all duration-300"></div>
            <div className="relative transform group-hover:scale-110 transition-transform duration-300">
              <Folder className="w-16 h-16 text-blue-500 group-hover:hidden" />
              <FolderOpen className="w-16 h-16 text-blue-600 hidden group-hover:block" />
            </div>
            
            {/* Floating action on hover */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <span className="text-xs font-medium text-blue-600">Open</span>
              </div>
            </div>
          </div>

          {/* Folder Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-900 truncate flex-1 leading-5" title={folder.name}>
                {folder.name}
              </h3>
              
              {onSelect && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSelect}>
                      {isSelected ? 'Deselect' : 'Select'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border-0">
                FOLDER
              </div>
              <span className="text-xs text-gray-400 font-medium">Navigate →</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}