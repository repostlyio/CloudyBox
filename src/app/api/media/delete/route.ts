import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/services/s3-service'
import type { ApiResponse } from '@/types'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      const response: ApiResponse = {
        success: false,
        error: 'File key is required',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const s3Service = new S3Service()
    await s3Service.deleteFile(key)

    const response: ApiResponse = {
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error - Delete file:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    }

    return NextResponse.json(response, { status: 500 })
  }
}