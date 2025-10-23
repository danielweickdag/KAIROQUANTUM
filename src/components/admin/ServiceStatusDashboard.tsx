'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Database,
  Server,
  Code,
  CreditCard,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'

interface ServiceCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime?: number
  details?: any
  error?: string
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  responseTime: number
  version: string
  environment: string
  checks: ServiceCheck[]
  summary: {
    total: number
    healthy: number
    degraded: number
    unhealthy: number
  }
}

export const ServiceStatusDashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchHealthStatus = async () => {
    try {
      setLoading(true)
      setError('')

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
      const response = await fetch(`${apiUrl}/api/health/status`)
      const data = await response.json()

      setHealthStatus(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Health check error:', err)
      setError('Failed to fetch health status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthStatus()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50'
      case 'unhealthy':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getServiceIcon = (service: string) => {
    if (service.includes('Database')) return <Database className="w-5 h-5" />
    if (service.includes('Python')) return <Code className="w-5 h-5" />
    if (service.includes('Stripe')) return <CreditCard className="w-5 h-5" />
    if (service.includes('Alpaca')) return <TrendingUp className="w-5 h-5" />
    return <Server className="w-5 h-5" />
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  if (loading && !healthStatus) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading health status...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-6 h-6" />
                <span>System Status</span>
              </CardTitle>
              <CardDescription>
                Real-time health monitoring of all services
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealthStatus}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-600">
                <XCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {healthStatus && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${getStatusColor(healthStatus.status)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Overall Status</div>
                      <div className="text-2xl font-bold mt-1 capitalize">
                        {healthStatus.status}
                      </div>
                    </div>
                    {getStatusIcon(healthStatus.status)}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-600">Healthy</div>
                      <div className="text-2xl font-bold mt-1 text-green-600">
                        {healthStatus.summary.healthy}
                      </div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-yellow-600">Degraded</div>
                      <div className="text-2xl font-bold mt-1 text-yellow-600">
                        {healthStatus.summary.degraded}
                      </div>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-red-600">Unhealthy</div>
                      <div className="text-2xl font-bold mt-1 text-red-600">
                        {healthStatus.summary.unhealthy}
                      </div>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-500">Uptime</div>
                  <div className="text-lg font-semibold">
                    {formatUptime(healthStatus.uptime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Response Time</div>
                  <div className="text-lg font-semibold">
                    {healthStatus.responseTime}ms
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Environment</div>
                  <div className="text-lg font-semibold capitalize">
                    {healthStatus.environment}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Version</div>
                  <div className="text-lg font-semibold">
                    {healthStatus.version}
                  </div>
                </div>
              </div>

              {/* Service Checks */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Service Health Checks</h3>
                <div className="space-y-3">
                  {healthStatus.checks.map((check, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        check.status === 'healthy'
                          ? 'border-green-200 bg-green-50'
                          : check.status === 'degraded'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getServiceIcon(check.service)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{check.service}</h4>
                              <Badge
                                variant={
                                  check.status === 'healthy'
                                    ? 'default'
                                    : check.status === 'degraded'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {check.status}
                              </Badge>
                            </div>

                            {check.responseTime !== undefined && (
                              <div className="text-sm text-gray-600 mt-1">
                                Response time: {check.responseTime}ms
                              </div>
                            )}

                            {check.error && (
                              <div className="text-sm text-red-600 mt-2">
                                Error: {check.error}
                              </div>
                            )}

                            {check.details && (
                              <div className="text-sm text-gray-600 mt-2">
                                <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(check.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusIcon(check.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className="text-sm text-gray-500 text-center pt-4 border-t">
                  Last updated: {lastUpdated.toLocaleString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ServiceStatusDashboard
