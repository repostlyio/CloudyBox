import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createS3Client, getS3Config } from '@/lib/s3-client'
import type { S3File, S3Folder, S3Config, ListFilesResponse } from '@/types'

export class S3Service {
  private client
  private bucket: string

  constructor(config?: S3Config) {
    try {
      const s3Config = config || getS3Config()
      if (!s3Config) {
        throw new Error('S3 configuration is required. Please ensure AWS credentials are properly configured.')
      }
      
      this.client = createS3Client(s3Config)
      this.bucket = s3Config.bucket
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`S3 Service initialization failed: ${error.message}`)
      }
      throw new Error('S3 Service initialization failed: Unknown error')
    }
  }

  async listFiles(
    prefix = '',
    maxKeys = 50,
    continuationToken?: string
  ): Promise<ListFilesResponse> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken,
        Delimiter: '/', // This enables folder detection
      })

      const response = await this.client.send(command)
      
      // Process files
      const files: S3File[] = (response.Contents || [])
        .filter(item => item.Key !== prefix) // Exclude the current folder itself
        .map((item) => {
          // Ensure we have a valid date
          let lastModified: Date
          if (item.LastModified && item.LastModified instanceof Date) {
            lastModified = item.LastModified
          } else if (item.LastModified) {
            lastModified = new Date(item.LastModified)
          } else {
            lastModified = new Date()
          }

          return {
            key: item.Key!,
            name: item.Key!.split('/').pop() || item.Key!,
            size: item.Size || 0,
            lastModified,
            url: '', // We'll generate signed URLs on demand
            type: this.getFileType(item.Key!),
          }
        })

      // Process folders (CommonPrefixes)
      const folders: S3Folder[] = (response.CommonPrefixes || []).map((prefixObj) => {
        const folderKey = prefixObj.Prefix!
        const folderName = folderKey.slice(prefix.length).replace(/\/$/, '') // Remove trailing slash
        
        return {
          key: folderKey,
          name: folderName,
          type: 'folder' as const,
        }
      })

      return {
        files,
        folders,
        hasMore: response.IsTruncated || false,
        continuationToken: response.NextContinuationToken,
      }
    } catch (error) {
      console.error('Error listing files:', error)
      throw new Error('Failed to list files')
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(command)
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Failed to delete file')
    }
  }

  async getFileUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      return await getSignedUrl(this.client, command, { expiresIn })
    } catch (error) {
      console.error('Error getting file URL:', error)
      throw new Error('Failed to get file URL')
    }
  }

  async getUploadUrl(key: string, contentType?: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      })

      return await getSignedUrl(this.client, command, { expiresIn: 3600 })
    } catch (error) {
      console.error('Error getting upload URL:', error)
      throw new Error('Failed to get upload URL')
    }
  }

  private getFileType(key: string): string {
    const extension = key.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image'
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
      return 'video'
    } else if (['mp3', 'wav', 'flac'].includes(extension || '')) {
      return 'audio'
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return 'document'
    }
    
    return 'file'
  }
}