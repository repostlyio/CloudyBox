import { S3Client } from '@aws-sdk/client-s3'
import type { S3Config } from '@/types'

let s3Client: S3Client | null = null

export function createS3Client(config: S3Config): S3Client {
  const clientConfig = {
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    ...(config.endpoint && {
      endpoint: config.endpoint,
      forcePathStyle: true,
    }),
  }

  return new S3Client(clientConfig)
}

export function getS3Client(): S3Client | null {
  return s3Client
}

export function setS3Client(client: S3Client): void {
  s3Client = client
}

export function getS3Config(): S3Config | null {
  if (typeof window !== 'undefined') {
    return null
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION || 'us-east-1'
  const bucket = process.env.S3_BUCKET
  const endpoint = process.env.S3_ENDPOINT

  // Validate required configuration
  if (!accessKeyId || accessKeyId.trim() === '') {
    throw new Error('AWS_ACCESS_KEY_ID environment variable is required and cannot be empty')
  }

  if (!secretAccessKey || secretAccessKey.trim() === '') {
    throw new Error('AWS_SECRET_ACCESS_KEY environment variable is required and cannot be empty')
  }

  if (!bucket || bucket.trim() === '') {
    throw new Error('S3_BUCKET environment variable is required and cannot be empty')
  }

  // Validate region format (basic check)
  if (!/^[a-z0-9-]+$/.test(region)) {
    throw new Error('Invalid AWS_REGION format. Must contain only lowercase letters, numbers, and hyphens')
  }

  // Validate bucket name format (basic S3 bucket naming rules)
  if (!/^[a-z0-9.-]+$/.test(bucket) || bucket.length < 3 || bucket.length > 63) {
    throw new Error('Invalid S3_BUCKET format. Must be 3-63 characters, lowercase letters, numbers, dots, and hyphens only')
  }

  return {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    endpoint,
  }
}