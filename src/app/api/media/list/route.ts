import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/services/s3-service'
import type { ApiResponse, ListFilesResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get('prefix') || ''
    const maxKeys = parseInt(searchParams.get('maxKeys') || '50')
    const continuationToken = searchParams.get('continuationToken') || undefined

    const s3Service = new S3Service()
    const result = await s3Service.listFiles(prefix, maxKeys, continuationToken)

    const response: ApiResponse<ListFilesResponse> = {
      success: true,
      data: result,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error - List files:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    }

    return NextResponse.json(response, { status: 500 })
  }
}