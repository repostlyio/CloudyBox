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

  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || '',
    endpoint: process.env.S3_ENDPOINT,
  }
}