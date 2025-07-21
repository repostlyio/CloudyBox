/**
 * Script to configure CORS for S3 bucket
 * Run with: npx ts-node src/scripts/configure-cors.ts
 */

import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'hel1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
})

const corsConfiguration = {
  CORSRules: [
    {
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://your-domain.com', // Replace with your actual domain
      ],
      ExposeHeaders: ['ETag', 'x-amz-version-id'],
      MaxAgeSeconds: 3600,
    },
  ],
}

async function configureCORS() {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: process.env.S3_BUCKET || 'repostly-staging',
      CORSConfiguration: corsConfiguration,
    })

    await s3Client.send(command)
    console.log('✅ CORS configuration applied successfully!')
    console.log('Configuration:', JSON.stringify(corsConfiguration, null, 2))
  } catch (error) {
    console.error('❌ Failed to configure CORS:', error)
  }
}

configureCORS()