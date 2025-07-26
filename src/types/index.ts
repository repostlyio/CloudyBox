export interface S3File {
  key: string
  size: number
  lastModified: Date | string
  url: string
  name: string
  type: string
}

export interface S3Folder {
  key: string
  name: string
  type: 'folder'
}

export type S3Item = S3File | S3Folder

export interface S3Config {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
  endpoint?: string
}

export interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface MediaManagerConfig {
  mode: 'read-only' | 'full'
  maxFileSize?: number
  allowedFileTypes?: string[]
  token?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ListFilesResponse {
  files: S3File[]
  folders: S3Folder[]
  hasMore: boolean
  continuationToken?: string
}