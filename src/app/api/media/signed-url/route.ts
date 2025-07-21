import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/services/s3-service'
import type { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600')

    if (!key) {
      const response: ApiResponse = {
        success: false,
        error: 'File key is required',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const s3Service = new S3Service()
    const signedUrl = await s3Service.getFileUrl(key, expiresIn)

    const response: ApiResponse<{ url: string }> = {
      success: true,
      data: { url: signedUrl },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error - Get signed URL:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get signed URL',
    }

    return NextResponse.json(response, { status: 500 })
  }
}