import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/services/s3-service'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, contentType } = body

    if (!key) {
      const response: ApiResponse = {
        success: false,
        error: 'File key is required',
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Validate and sanitize the file key to prevent path traversal attacks
    if (typeof key !== 'string' || key.trim() === '') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid file key format',
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Prevent path traversal attacks by checking for dangerous patterns
    const sanitizedKey = key.replace(/\.\./g, '').replace(/\/+/g, '/').replace(/^\/+/, '')
    
    if (sanitizedKey !== key || key.includes('..') || key.includes('//')) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid file path detected',
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Additional validation: ensure key doesn't contain dangerous characters
    if (!/^[a-zA-Z0-9._/-]+$/.test(key)) {
      const response: ApiResponse = {
        success: false,
        error: 'File key contains invalid characters',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const s3Service = new S3Service()
    const uploadUrl = await s3Service.getUploadUrl(sanitizedKey, contentType)

    const response: ApiResponse<{ uploadUrl: string }> = {
      success: true,
      data: { uploadUrl },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error - Get upload URL:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get upload URL',
    }

    return NextResponse.json(response, { status: 500 })
  }
}