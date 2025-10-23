'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Globe,
  Shield,
  Zap,
  Users
} from 'lucide-react'
import EmailSystem from '@/components/contact/EmailSystem'

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Contact & Support
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Get in touch with our team. We're here to help you succeed with KAIRO.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Quick Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">support@kairo.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri: 9AM-6PM EST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-green-600" />
                Support Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Free Trial</span>
                  <Badge variant="outline">Email</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email support with 24-48 hour response time
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pro Plan</span>
                  <Badge variant="secondary">Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Priority email + phone support, 4-12 hour response
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Enterprise</span>
                  <Badge className="bg-purple-100 text-purple-700">Dedicated</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dedicated account manager, 1-4 hour response
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Office Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Office Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Headquarters</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  123 Financial District<br />
                  New York, NY 10004<br />
                  United States
                </p>
              </div>
              <div>
                <p className="font-medium">European Office</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  45 Canary Wharf<br />
                  London E14 5AB<br />
                  United Kingdom
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href="/help" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Help Center & FAQ
              </a>
              <a 
                href="/help/faq" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Getting Started Guide
              </a>
              <a 
                href="/social" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Users className="w-4 h-4" />
                Community Forum
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Email System */}
        <div className="lg:col-span-2">
          <EmailSystem />
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="mt-8 border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Emergency Trading Support
              </h3>
              <p className="text-red-700 dark:text-red-200 mb-3">
                For urgent trading issues or account access problems during market hours, 
                call our emergency hotline for immediate assistance.
              </p>
              <p className="font-medium text-red-900 dark:text-red-100">
                Emergency Hotline: +1 (555) 911-TRADE
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                Available during market hours: Mon-Fri 9:30AM-4:00PM EST
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContactPage