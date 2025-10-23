'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  HelpCircle,
  Bug,
  Lightbulb,
  CreditCard,
  Shield,
  Zap,
  Star,
  Calendar,
  FileText,
  Upload,
  X,
  Plus,
  ArrowRight,
  Globe,
  Headphones,
  Video,
  Users,
  Settings,
  Target,
  TrendingUp,
  BarChart3,
  Brain,
  Bell,
  Lock,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactForm {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  message: string
  attachments?: File[]
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  createdAt: string
  lastUpdate: string
  assignedTo?: string
  messages: {
    id: string
    sender: string
    message: string
    timestamp: string
    isStaff: boolean
  }[]
}

const EmailSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contact')
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    attachments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<ContactForm>>({})

  // Mock support tickets for demonstration
  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      subject: 'Unable to connect trading account',
      status: 'in_progress',
      priority: 'high',
      category: 'technical',
      createdAt: '2024-01-15T10:30:00Z',
      lastUpdate: '2024-01-15T14:20:00Z',
      assignedTo: 'Sarah Chen',
      messages: [
        {
          id: '1',
          sender: 'John Doe',
          message: 'I\'m having trouble connecting my trading account. The API keeps returning authentication errors.',
          timestamp: '2024-01-15T10:30:00Z',
          isStaff: false
        },
        {
          id: '2',
          sender: 'Sarah Chen',
          message: 'Hi John, I\'ve reviewed your account and it looks like there might be an issue with your API permissions. Can you please check if your trading platform has enabled API access?',
          timestamp: '2024-01-15T14:20:00Z',
          isStaff: true
        }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Billing question about Pro plan',
      status: 'resolved',
      priority: 'medium',
      category: 'billing',
      createdAt: '2024-01-14T09:15:00Z',
      lastUpdate: '2024-01-14T16:45:00Z',
      assignedTo: 'Mike Johnson',
      messages: [
        {
          id: '1',
          sender: 'Jane Smith',
          message: 'I was charged twice for my Pro plan subscription this month. Can you help me understand why?',
          timestamp: '2024-01-14T09:15:00Z',
          isStaff: false
        },
        {
          id: '2',
          sender: 'Mike Johnson',
          message: 'Hi Jane, I\'ve reviewed your billing history and found the duplicate charge. This was due to a processing error on our end. I\'ve issued a full refund for the duplicate charge, which should appear in your account within 3-5 business days.',
          timestamp: '2024-01-14T16:45:00Z',
          isStaff: true
        }
      ]
    }
  ])

  const contactCategories = [
    { value: 'general', label: 'General Inquiry', icon: <HelpCircle className="w-4 h-4" /> },
    { value: 'technical', label: 'Technical Support', icon: <Settings className="w-4 h-4" /> },
    { value: 'billing', label: 'Billing & Payments', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'account', label: 'Account Issues', icon: <User className="w-4 h-4" /> },
    { value: 'feature', label: 'Feature Request', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" /> },
    { value: 'partnership', label: 'Partnership', icon: <Building className="w-4 h-4" /> },
    { value: 'security', label: 'Security Concern', icon: <Shield className="w-4 h-4" /> }
  ]

  const supportChannels = [
    {
      id: 'email',
      name: 'Email Support',
      description: 'Get detailed help via email',
      responseTime: '4-6 hours',
      availability: '24/7',
      icon: <Mail className="w-6 h-6" />,
      color: 'blue',
      action: 'Send Email'
    },
    {
      id: 'chat',
      name: 'Live Chat',
      description: 'Instant help from our team',
      responseTime: '< 2 minutes',
      availability: 'Mon-Fri, 9AM-6PM EST',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'green',
      action: 'Start Chat'
    },
    {
      id: 'phone',
      name: 'Phone Support',
      description: 'Speak directly with an expert',
      responseTime: 'Immediate',
      availability: 'Mon-Fri, 9AM-6PM EST',
      icon: <Phone className="w-6 h-6" />,
      color: 'purple',
      action: 'Call Now'
    },
    {
      id: 'video',
      name: 'Video Call',
      description: 'Screen sharing and demos',
      responseTime: 'Scheduled',
      availability: 'By appointment',
      icon: <Video className="w-6 h-6" />,
      color: 'orange',
      action: 'Schedule Call'
    }
  ]

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send the data to your backend
      console.log('Submitting contact form:', formData)
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
        attachments: []
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Contact & Support
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get help when you need it. Our support team is here to assist you with any questions or issues.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportChannels.map((channel) => (
          <Card key={channel.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mx-auto",
                channel.color === 'blue' && "bg-blue-100 text-blue-600",
                channel.color === 'green' && "bg-green-100 text-green-600",
                channel.color === 'purple' && "bg-purple-100 text-purple-600",
                channel.color === 'orange' && "bg-orange-100 text-orange-600"
              )}>
                {channel.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{channel.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{channel.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Response Time:</span>
                  <span className="font-medium">{channel.responseTime}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Availability:</span>
                  <span className="font-medium">{channel.availability}</span>
                </div>
              </div>
              <Button className="w-full" variant={channel.id === 'email' ? 'default' : 'outline'}>
                {channel.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Form</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Contact Form Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitStatus === 'success' && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your message has been sent successfully! We'll get back to you within 4-6 hours.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    There was an error sending your message. Please try again or contact us directly.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your Company"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              {category.icon}
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={errors.subject ? 'border-red-500' : ''}
                    placeholder="Brief description of your inquiry"
                  />
                  {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={cn("min-h-[120px]", errors.message ? 'border-red-500' : '')}
                    placeholder="Please provide as much detail as possible about your inquiry..."
                  />
                  {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ticket #{ticket.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Update:</span>
                        <p className="font-medium">{formatDate(ticket.lastUpdate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium capitalize">{ticket.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Assigned to:</span>
                        <p className="font-medium">{ticket.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Recent Messages:</h4>
                      <div className="space-y-2">
                        {ticket.messages.slice(-2).map((message) => (
                          <div key={message.id} className={cn(
                            "p-3 rounded-lg text-sm",
                            message.isStaff 
                              ? "bg-blue-50 border-l-4 border-blue-500" 
                              : "bg-gray-50 border-l-4 border-gray-300"
                          )}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{message.sender}</span>
                              <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                            </div>
                            <p className="text-gray-700">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">How do I get started with KAIRO?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Getting started is easy! Sign up for a free trial, connect your trading account, and start following successful traders. Our onboarding process will guide you through each step.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">What trading platforms do you support?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We support major trading platforms including MetaTrader 4/5, TradingView, Interactive Brokers, TD Ameritrade, and many others. Check our integrations page for the full list.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Is my data secure?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, we use bank-level encryption and security measures to protect your data. We never store your trading account credentials and use read-only API access where possible.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Can I cancel my subscription anytime?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Absolutely! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmailSystem