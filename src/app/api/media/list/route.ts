import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/services/s3-service'
import type { ApiResponse, ListFilesResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get('prefix') || ''
    const maxKeysParam = searchParams.get('maxKeys') || '50'
    const continuationToken = searchParams.get('continuationToken') || undefined

    // Validate and limit maxKeys to prevent DoS attacks
    let maxKeys = parseInt(maxKeysParam)
    if (isNaN(maxKeys) || maxKeys < 1) {
      maxKeys = 50 // Default value
    } else if (maxKeys > 1000) {
      // Cap at 1000 to prevent excessive resource usage
      maxKeys = 1000
    }

    // Validate prefix to prevent path traversal
    const sanitizedPrefix = prefix.replace(/\.\./g, '').replace(/\/+/g, '/').replace(/^\/+/, '')
    if (sanitizedPrefix !== prefix && prefix !== '') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid prefix path detected',
      }
      return NextResponse.json(response, { status: 400 })
    }

    const s3Service = new S3Service()
    const result = await s3Service.listFiles(sanitizedPrefix, maxKeys, continuationToken)

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