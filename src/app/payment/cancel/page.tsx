'use client'

import { useRouter } from 'next/navigation'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Your payment was cancelled
            </p>
            <p className="text-sm text-gray-500">
              No charges have been made to your account. You can try again whenever you're ready.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Why subscribe to KAIRO QUANTUM?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Advanced trading algorithms</li>
              <li>• Real-time market analytics</li>
              <li>• Auto-trading capabilities</li>
              <li>• Priority customer support</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push('/pricing')}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="pt-6 border-t">
            <p className="text-center text-sm text-gray-500">
              Have questions?{' '}
              <a href="mailto:support@kairoquantum.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
