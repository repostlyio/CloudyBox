import Link from 'next/link'
import { Cloud, Upload, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              CloudyBox
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, secure, and embeddable S3 media manager built with React and Next.js. 
            Connect to any S3-compatible storage and manage your files with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/media-manager">
                Launch Media Manager
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/media-manager?mode=read-only">
                Try Read-Only Mode
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Upload className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Easy Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Drag & drop files or click to upload. Support for multiple files and progress tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Cloud className="w-8 h-8 text-primary mb-2" />
              <CardTitle>S3 Compatible</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Works with AWS S3, Hetzner, DigitalOcean Spaces, and any S3-compatible storage.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Secure & Embeddable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Token-based authentication with iframe embedding support. Read-only and full modes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Modern UI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with Tailwind CSS and shadcn/ui. Responsive design with dark mode support.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Configure your S3 credentials in the environment variables and start managing your media files.
          </p>
          <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold mb-3">Environment Variables Required:</h3>
            <div className="text-left space-y-1 text-sm font-mono">
              <div>AWS_ACCESS_KEY_ID=your_access_key</div>
              <div>AWS_SECRET_ACCESS_KEY=your_secret_key</div>
              <div>AWS_REGION=us-east-1</div>
              <div>S3_BUCKET=your_bucket_name</div>
              <div>S3_ENDPOINT=https://your-endpoint.com (optional)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
