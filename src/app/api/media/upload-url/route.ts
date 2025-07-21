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

    const s3Service = new S3Service()
    const uploadUrl = await s3Service.getUploadUrl(key, contentType)

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