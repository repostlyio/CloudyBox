'use client'

import { AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { formatFileSize } from '@/lib/utils'
import type { S3File } from '@/types'

interface DeleteConfirmDialogProps {
  file: S3File | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (file: S3File) => void
}

export function DeleteConfirmDialog({
  file,
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!file) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete File
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this file? This action cannot be undone.
              </p>
              
              <div className="p-3 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{file.name}</span>
                    <Badge variant="outline">{file.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Size: {formatFileSize(file.size)}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Key: {file.key}
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(file)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete File
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}