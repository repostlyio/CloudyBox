import { MediaManagerClient } from '@/components/media-manager-client'

interface MediaManagerPageProps {
  searchParams?: Promise<{
    token?: string
    mode?: 'read-only' | 'full'
    embed?: 'true' | 'false'
  }>
}

export default async function MediaManagerPage({ searchParams }: MediaManagerPageProps) {
  const params = await searchParams
  
  return (
    <MediaManagerClient
      mode={params?.mode || 'full'}
      token={params?.token}
      embed={params?.embed === 'true'}
    />
  )
}