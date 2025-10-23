'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Check,
  X,
  Star,
  Crown,
  Award,
  BarChart3,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Bell,
  Settings,
  Smartphone,
  Globe,
  Brain,
  Lock,
  Activity,
  Eye,
  MessageSquare,
  Download,
  Headphones,
  Target,
  DollarSign,
  Calendar,
  Clock,
  Info,
  HelpCircle,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Plus,
  Minus,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Layers,
  Gauge,
  Rocket,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureItem {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  plans: {
    [planId: string]: {
      included: boolean
      limit?: string
      highlight?: boolean
      value?: string | number
      tooltip?: string
    }
  }
  importance: 'high' | 'medium' | 'low'
  icon: React.ReactNode
  detailedDescription?: string
  useCases?: string[]
  benefits?: string[]
}

const featureData: FeatureItem[] = [
  {
    id: 'copy-trading',
    name: 'Copy Trading',
    description: 'Follow and automatically copy trades from successful traders',
    category: 'Trading Features',
    subcategory: 'Core Trading',
    plans: {
      'free-trial': { included: true, limit: 'Up to 3 creators', tooltip: 'Copy trades from up to 3 verified creators' },
      'pro': { included: true, limit: 'Unlimited creators', highlight: true, tooltip: 'Copy trades from unlimited verified creators' },
      'enterprise': { included: true, limit: 'Unlimited creators + priority access', highlight: true, tooltip: 'Copy trades with priority execution' }
    },
    importance: 'high',
    icon: <Users className="w-4 h-4" />,
    detailedDescription: 'Our copy trading feature allows you to automatically replicate the trades of successful traders in real-time. This is perfect for beginners who want to learn from experts or busy professionals who don\'t have time to actively trade.',
    useCases: ['Learning from expert traders', 'Passive income generation', 'Portfolio diversification'],
    benefits: ['Reduced learning curve', 'Time-saving automation', 'Access to proven strategies']
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Comprehensive performance metrics and insights',
    category: 'Analytics',
    subcategory: 'Performance Tracking',
    plans: {
      'free-trial': { included: false, tooltip: 'Basic analytics only in free trial' },
      'pro': { included: true, highlight: true, tooltip: 'Full analytics suite with advanced metrics' },
      'enterprise': { included: true, value: 'Enhanced with custom reports', highlight: true, tooltip: 'Advanced analytics plus custom reporting' }
    },
    importance: 'high',
    icon: <BarChart3 className="w-4 h-4" />,
    detailedDescription: 'Get deep insights into your trading performance with advanced analytics including risk metrics, correlation analysis, and predictive modeling.',
    useCases: ['Performance optimization', 'Risk assessment', 'Strategy refinement'],
    benefits: ['Data-driven decisions', 'Risk management', 'Performance optimization']
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Full-featured iOS and Android applications',
    category: 'Platform Access',
    subcategory: 'Mobile',
    plans: {
      'free-trial': { included: true, tooltip: 'Full mobile app access' },
      'pro': { included: true, tooltip: 'Full mobile app access' },
      'enterprise': { included: true, value: 'White-label option', highlight: true, tooltip: 'Mobile app with custom branding' }
    },
    importance: 'medium',
    icon: <Smartphone className="w-4 h-4" />,
    detailedDescription: 'Trade on the go with our fully-featured mobile applications for iOS and Android. All desktop features are available on mobile.',
    useCases: ['Trading on the go', 'Real-time monitoring', 'Quick position adjustments'],
    benefits: ['24/7 market access', 'Real-time notifications', 'Seamless synchronization']
  },
  {
    id: 'paper-trading',
    name: 'Paper Trading',
    description: 'Practice trading with virtual money',
    category: 'Trading Features',
    subcategory: 'Practice',
    plans: {
      'free-trial': { included: true, limit: '$10,000 virtual', tooltip: 'Practice with $10,000 virtual money' },
      'pro': { included: true, limit: '$100,000 virtual', tooltip: 'Practice with $100,000 virtual money' },
      'enterprise': { included: true, limit: 'Unlimited virtual funds', highlight: true, tooltip: 'Unlimited virtual trading funds' }
    },
    importance: 'medium',
    icon: <Target className="w-4 h-4" />,
    detailedDescription: 'Test your strategies and learn to trade without risking real money. Our paper trading environment mirrors real market conditions.',
    useCases: ['Strategy testing', 'Learning to trade', 'Risk-free experimentation'],
    benefits: ['Risk-free learning', 'Strategy validation', 'Confidence building']
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    description: 'Faster response times and dedicated assistance',
    category: 'Support',
    subcategory: 'Customer Service',
    plans: {
      'free-trial': { included: false, tooltip: 'Email support with 24-48 hour response' },
      'pro': { included: true, limit: '4-12 hour response', tooltip: 'Priority support with faster response times' },
      'enterprise': { included: true, limit: 'Dedicated account manager', highlight: true, tooltip: 'Dedicated support with personal account manager' }
    },
    importance: 'medium',
    icon: <Headphones className="w-4 h-4" />,
    detailedDescription: 'Get the help you need when you need it with our priority support system. Enterprise customers get dedicated account managers.',
    useCases: ['Technical assistance', 'Trading guidance', 'Platform troubleshooting'],
    benefits: ['Faster problem resolution', 'Expert guidance', 'Personalized assistance']
  },
  {
    id: 'advanced-strategies',
    name: 'Advanced Strategies',
    description: 'Access to sophisticated trading algorithms',
    category: 'Trading Features',
    subcategory: 'Algorithms',
    plans: {
      'free-trial': { included: false, tooltip: 'Basic strategies only' },
      'pro': { included: true, highlight: true, tooltip: 'Access to advanced trading algorithms' },
      'enterprise': { included: true, value: 'Custom strategy development', highlight: true, tooltip: 'Advanced strategies plus custom development' }
    },
    importance: 'high',
    icon: <Brain className="w-4 h-4" />,
    detailedDescription: 'Leverage sophisticated trading algorithms developed by our quantitative research team to maximize your trading potential.',
    useCases: ['Algorithmic trading', 'Market making', 'Arbitrage opportunities'],
    benefits: ['Automated execution', 'Advanced market analysis', 'Competitive edge']
  },
  {
    id: 'api-access',
    name: 'API Access',
    description: 'Programmatic trading and data access',
    category: 'Integration',
    subcategory: 'Development',
    plans: {
      'free-trial': { included: false, tooltip: 'API access not available in free trial' },
      'pro': { included: true, limit: '1000 calls/hour', tooltip: 'API access with rate limiting' },
      'enterprise': { included: true, limit: 'Unlimited calls', highlight: true, tooltip: 'Unlimited API access with priority routing' }
    },
    importance: 'medium',
    icon: <Settings className="w-4 h-4" />,
    detailedDescription: 'Build custom integrations and automated trading systems with our comprehensive REST and WebSocket APIs.',
    useCases: ['Custom integrations', 'Automated trading bots', 'Data analysis'],
    benefits: ['Automation capabilities', 'Custom workflows', 'Third-party integrations']
  },
  {
    id: 'custom-alerts',
    name: 'Custom Alerts',
    description: 'Personalized notifications for market events',
    category: 'Alerts',
    subcategory: 'Notifications',
    plans: {
      'free-trial': { included: false, tooltip: 'Basic alerts only' },
      'pro': { included: true, limit: '50 alerts', tooltip: 'Up to 50 custom alerts' },
      'enterprise': { included: true, limit: 'Unlimited alerts', highlight: true, tooltip: 'Unlimited custom alerts with advanced triggers' }
    },
    importance: 'medium',
    icon: <Bell className="w-4 h-4" />,
    detailedDescription: 'Stay informed with customizable alerts for price movements, volume changes, and other market conditions.',
    useCases: ['Price monitoring', 'Volume alerts', 'Technical indicator signals'],
    benefits: ['Real-time notifications', 'Market awareness', 'Timely decision making']
  },
  {
    id: 'risk-management',
    name: 'Risk Management Tools',
    description: 'Advanced tools to manage and minimize trading risks',
    category: 'Risk Management',
    subcategory: 'Protection',
    plans: {
      'free-trial': { included: false, tooltip: 'Basic risk controls only' },
      'pro': { included: true, tooltip: 'Advanced risk management suite' },
      'enterprise': { included: true, value: 'Custom risk parameters', highlight: true, tooltip: 'Advanced risk management with custom parameters' }
    },
    importance: 'high',
    icon: <Shield className="w-4 h-4" />,
    detailedDescription: 'Protect your capital with sophisticated risk management tools including position sizing, stop-loss automation, and portfolio risk analysis.',
    useCases: ['Position sizing', 'Stop-loss automation', 'Portfolio risk analysis'],
    benefits: ['Capital protection', 'Automated risk controls', 'Peace of mind']
  },
  {
    id: 'white-label',
    name: 'White-label Solution',
    description: 'Custom branding and white-label options',
    category: 'Enterprise',
    subcategory: 'Branding',
    plans: {
      'free-trial': { included: false, tooltip: 'Not available in free trial' },
      'pro': { included: false, tooltip: 'Available as add-on' },
      'enterprise': { included: true, highlight: true, tooltip: 'Full white-label solution with custom branding' }
    },
    importance: 'low',
    icon: <Crown className="w-4 h-4" />,
    detailedDescription: 'Brand our platform as your own with custom logos, colors, and domain names. Perfect for financial institutions and trading firms.',
    useCases: ['Brand customization', 'Client-facing platforms', 'Institutional offerings'],
    benefits: ['Brand consistency', 'Professional appearance', 'Client trust']
  }
]

const categories = [
  { name: 'Trading Features', icon: <TrendingUp className="w-4 h-4" />, color: 'blue' },
  { name: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, color: 'green' },
  { name: 'Platform Access', icon: <Smartphone className="w-4 h-4" />, color: 'purple' },
  { name: 'Support', icon: <Headphones className="w-4 h-4" />, color: 'orange' },
  { name: 'Integration', icon: <Settings className="w-4 h-4" />, color: 'gray' },
  { name: 'Alerts', icon: <Bell className="w-4 h-4" />, color: 'yellow' },
  { name: 'Risk Management', icon: <Shield className="w-4 h-4" />, color: 'red' },
  { name: 'Enterprise', icon: <Crown className="w-4 h-4" />, color: 'indigo' }
]

const plans = [
  { id: 'free-trial', name: 'Free Trial', icon: <Star className="w-4 h-4" />, color: 'blue' },
  { id: 'pro', name: 'Pro', icon: <Crown className="w-4 h-4" />, color: 'purple' },
  { id: 'enterprise', name: 'Enterprise', icon: <Award className="w-4 h-4" />, color: 'orange' }
]

interface FeatureBreakdownProps {
  selectedPlan?: string
}

const FeatureBreakdown: React.FC<FeatureBreakdownProps> = ({ selectedPlan }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null)
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']))

  const filteredFeatures = featureData.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesImportance = importanceFilter === 'all' || feature.importance === importanceFilter
    return matchesCategory && matchesSearch && matchesImportance
  })

  const groupedFeatures = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as Record<string, FeatureItem[]>)

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const getFeatureAvailability = (feature: FeatureItem) => {
    const availablePlans = plans.filter(plan => feature.plans[plan.id]?.included).length
    return (availablePlans / plans.length) * 100
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Feature Breakdown
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive feature set and see exactly what's included in each plan. 
            Compare capabilities across all tiers to find the perfect fit for your trading needs.
          </p>
        </div>

        <div className="space-y-6">


        {/* Filters and Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={importanceFilter}
                  onChange={(e) => setImportanceFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Importance</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Grid/List */}
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredFeatures.map((feature) => {
            const availability = getFeatureAvailability(feature)
            const categoryInfo = categories.find(cat => cat.name === feature.category)

            return (
              <Card
                key={feature.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  selectedPlan && feature.plans[selectedPlan]?.included && "ring-2 ring-blue-500"
                )}
                onClick={() => setSelectedFeature(feature)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-${categoryInfo?.color}-100 dark:bg-${categoryInfo?.color}-900/20 flex items-center justify-center`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{feature.name}</h3>
                        <p className="text-xs text-gray-500">{feature.category}</p>
                      </div>
                    </div>
                    <Badge className={cn("text-xs", getImportanceColor(feature.importance))}>
                      {feature.importance}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>

                  {/* Plan Availability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Availability</span>
                      <span className="font-medium">{Math.round(availability)}% of plans</span>
                    </div>
                    <Progress value={availability} className="h-2" />
                    
                    <div className="flex gap-1 mt-2">
                      {plans.map(plan => {
                        const planFeature = feature.plans[plan.id]
                        return (
                          <Tooltip key={plan.id}>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                "w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer",
                                planFeature?.included 
                                  ? `bg-${plan.color}-100 text-${plan.color}-700 dark:bg-${plan.color}-900/20` 
                                  : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                              )}>
                                {planFeature?.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{plan.name}: {planFeature?.included ? 'Included' : 'Not included'}</p>
                              {planFeature?.limit && <p className="text-xs">Limit: {planFeature.limit}</p>}
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Detail Modal */}
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedFeature && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedFeature.icon}
                    {selectedFeature.name}
                    <Badge className={cn("ml-2", getImportanceColor(selectedFeature.importance))}>
                      {selectedFeature.importance} priority
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedFeature.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Detailed Description */}
                  {selectedFeature.detailedDescription && (
                    <div>
                      <h4 className="font-semibold mb-2">Overview</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedFeature.detailedDescription}
                      </p>
                    </div>
                  )}

                  {/* Use Cases */}
                  {selectedFeature.useCases && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Use Cases
                      </h4>
                      <ul className="space-y-1">
                        {selectedFeature.useCases.map((useCase, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ArrowRight className="w-3 h-3" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedFeature.benefits && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {selectedFeature.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Plan Comparison */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Plan Availability
                    </h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      {plans.map(plan => {
                        const planFeature = selectedFeature.plans[plan.id]
                        return (
                          <Card key={plan.id} className={cn(
                            "p-4",
                            planFeature?.included && "ring-2 ring-green-500"
                          )}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded bg-${plan.color}-100 dark:bg-${plan.color}-900/20 flex items-center justify-center`}>
                                {plan.icon}
                              </div>
                              <span className="font-medium">{plan.name}</span>
                              {planFeature?.included ? (
                                <Check className="w-4 h-4 text-green-500 ml-auto" />
                              ) : (
                                <X className="w-4 h-4 text-gray-400 ml-auto" />
                              )}
                            </div>
                            
                            {planFeature?.included && (
                              <div className="space-y-1">
                                {planFeature.limit && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <strong>Limit:</strong> {planFeature.limit}
                                  </p>
                                )}
                                {planFeature.value && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <strong>Value:</strong> {planFeature.value}
                                  </p>
                                )}
                                {planFeature.highlight && (
                                  <Badge variant="secondary" className="text-xs">
                                    Enhanced
                                  </Badge>
                                )}
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Feature Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{featureData.length}</div>
                <div className="text-sm text-gray-600">Total Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {featureData.filter(f => f.importance === 'high').length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(featureData.reduce((acc, f) => acc + getFeatureAvailability(f), 0) / featureData.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default FeatureBreakdown