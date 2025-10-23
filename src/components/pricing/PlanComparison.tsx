'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureDetail {
  name: string
  description: string
  category: string
  included: boolean
  limit?: string
  highlight?: boolean
  tooltip?: string
}

interface PlanData {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    annual: number
  }
  originalPrice?: {
    monthly: number
    annual: number
  }
  features: FeatureDetail[]
  popular?: boolean
  recommended?: boolean
  icon: React.ReactNode
  color: string
  buttonText: string
  trialDays?: number
  savings?: string
  bestFor: string[]
  limitations?: string[]
}

const planData: PlanData[] = [
  {
    id: 'free-trial',
    name: 'Free Trial',
    description: 'Perfect for getting started',
    price: { monthly: 0, annual: 0 },
    features: [
      {
        name: 'Copy Trading',
        description: 'Follow and copy successful traders',
        category: 'Trading Features',
        included: true,
        limit: 'Up to 3 creators',
        tooltip: 'Copy trades from up to 3 verified creators'
      },
      {
        name: 'Basic Analytics',
        description: 'Essential performance metrics',
        category: 'Analytics',
        included: true,
        tooltip: 'View basic profit/loss and performance data'
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android applications',
        category: 'Platform Access',
        included: true,
        tooltip: 'Full-featured mobile apps for trading on the go'
      },
      {
        name: 'Paper Trading',
        description: 'Practice with virtual money',
        category: 'Trading Features',
        included: true,
        tooltip: 'Test strategies without risking real money'
      },
      {
        name: 'Email Support',
        description: 'Customer support via email',
        category: 'Support',
        included: true,
        limit: '24-48 hour response',
        tooltip: 'Get help via email with standard response times'
      },
      {
        name: 'Advanced Strategies',
        description: 'Complex trading algorithms',
        category: 'Trading Features',
        included: false,
        tooltip: 'Access to sophisticated trading strategies and algorithms'
      },
      {
        name: 'Priority Support',
        description: 'Faster response times',
        category: 'Support',
        included: false,
        tooltip: 'Get priority support with faster response times'
      },
      {
        name: 'API Access',
        description: 'Programmatic trading access',
        category: 'Integration',
        included: false,
        tooltip: 'Build custom integrations with our trading API'
      },
      {
        name: 'Custom Alerts',
        description: 'Personalized notifications',
        category: 'Alerts',
        included: false,
        tooltip: 'Set up custom alerts for specific market conditions'
      },
      {
        name: 'Risk Management Tools',
        description: 'Advanced risk controls',
        category: 'Risk Management',
        included: false,
        tooltip: 'Advanced tools to manage and minimize trading risks'
      }
    ],
    icon: <Star className="w-6 h-6" />,
    color: 'blue',
    buttonText: 'Start Free Trial',
    trialDays: 14,
    bestFor: ['Beginners', 'Testing the platform', 'Small portfolios'],
    limitations: ['Limited to 3 creators', 'Basic analytics only', 'Email support only']
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Most popular for active traders',
    price: { monthly: 49, annual: 490 },
    originalPrice: { monthly: 59, annual: 590 },
    features: [
      {
        name: 'Copy Trading',
        description: 'Follow and copy successful traders',
        category: 'Trading Features',
        included: true,
        limit: 'Unlimited creators',
        highlight: true,
        tooltip: 'Copy trades from unlimited verified creators'
      },
      {
        name: 'Advanced Analytics',
        description: 'Comprehensive performance metrics',
        category: 'Analytics',
        included: true,
        highlight: true,
        tooltip: 'Detailed analytics with advanced metrics and insights'
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android applications',
        category: 'Platform Access',
        included: true,
        tooltip: 'Full-featured mobile apps for trading on the go'
      },
      {
        name: 'Paper Trading',
        description: 'Practice with virtual money',
        category: 'Trading Features',
        included: true,
        tooltip: 'Test strategies without risking real money'
      },
      {
        name: 'Priority Support',
        description: 'Faster response times',
        category: 'Support',
        included: true,
        limit: '4-12 hour response',
        tooltip: 'Get priority support with faster response times'
      },
      {
        name: 'Advanced Strategies',
        description: 'Complex trading algorithms',
        category: 'Trading Features',
        included: true,
        highlight: true,
        tooltip: 'Access to sophisticated trading strategies and algorithms'
      },
      {
        name: 'API Access',
        description: 'Programmatic trading access',
        category: 'Integration',
        included: true,
        tooltip: 'Build custom integrations with our trading API'
      },
      {
        name: 'Custom Alerts',
        description: 'Personalized notifications',
        category: 'Alerts',
        included: true,
        tooltip: 'Set up custom alerts for specific market conditions'
      },
      {
        name: 'Risk Management Tools',
        description: 'Advanced risk controls',
        category: 'Risk Management',
        included: true,
        tooltip: 'Advanced tools to manage and minimize trading risks'
      },
      {
        name: 'White-label Solution',
        description: 'Custom branding options',
        category: 'Enterprise',
        included: false,
        tooltip: 'Brand the platform with your own logo and colors'
      }
    ],
    popular: true,
    recommended: true,
    icon: <Crown className="w-6 h-6" />,
    color: 'purple',
    buttonText: 'Get Pro',
    savings: '25% vs monthly',
    bestFor: ['Active traders', 'Portfolio diversification', 'Professional trading'],
    limitations: ['Monthly commitment', 'No white-label features']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For institutions and large teams',
    price: { monthly: 199, annual: 1990 },
    originalPrice: { monthly: 249, annual: 2490 },
    features: [
      {
        name: 'Copy Trading',
        description: 'Follow and copy successful traders',
        category: 'Trading Features',
        included: true,
        limit: 'Unlimited creators',
        tooltip: 'Copy trades from unlimited verified creators'
      },
      {
        name: 'Advanced Analytics',
        description: 'Comprehensive performance metrics',
        category: 'Analytics',
        included: true,
        tooltip: 'Detailed analytics with advanced metrics and insights'
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android applications',
        category: 'Platform Access',
        included: true,
        tooltip: 'Full-featured mobile apps for trading on the go'
      },
      {
        name: 'Paper Trading',
        description: 'Practice with virtual money',
        category: 'Trading Features',
        included: true,
        tooltip: 'Test strategies without risking real money'
      },
      {
        name: 'Priority Support',
        description: 'Faster response times',
        category: 'Support',
        included: true,
        limit: 'Dedicated account manager',
        highlight: true,
        tooltip: 'Get dedicated support with a personal account manager'
      },
      {
        name: 'Advanced Strategies',
        description: 'Complex trading algorithms',
        category: 'Trading Features',
        included: true,
        tooltip: 'Access to sophisticated trading strategies and algorithms'
      },
      {
        name: 'API Access',
        description: 'Programmatic trading access',
        category: 'Integration',
        included: true,
        tooltip: 'Build custom integrations with our trading API'
      },
      {
        name: 'Custom Alerts',
        description: 'Personalized notifications',
        category: 'Alerts',
        included: true,
        tooltip: 'Set up custom alerts for specific market conditions'
      },
      {
        name: 'Risk Management Tools',
        description: 'Advanced risk controls',
        category: 'Risk Management',
        included: true,
        tooltip: 'Advanced tools to manage and minimize trading risks'
      },
      {
        name: 'White-label Solution',
        description: 'Custom branding options',
        category: 'Enterprise',
        included: true,
        highlight: true,
        tooltip: 'Brand the platform with your own logo and colors'
      }
    ],
    icon: <Award className="w-6 h-6" />,
    color: 'orange',
    buttonText: 'Contact Sales',
    bestFor: ['Large institutions', 'Trading firms', 'White-label solutions'],
    limitations: ['Custom pricing', 'Minimum user requirements']
  }
]

const featureCategories = [
  { name: 'Trading Features', icon: <TrendingUp className="w-4 h-4" />, color: 'blue' },
  { name: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, color: 'green' },
  { name: 'Platform Access', icon: <Smartphone className="w-4 h-4" />, color: 'purple' },
  { name: 'Support', icon: <Headphones className="w-4 h-4" />, color: 'orange' },
  { name: 'Integration', icon: <Settings className="w-4 h-4" />, color: 'gray' },
  { name: 'Alerts', icon: <Bell className="w-4 h-4" />, color: 'yellow' },
  { name: 'Risk Management', icon: <Shield className="w-4 h-4" />, color: 'red' },
  { name: 'Enterprise', icon: <Crown className="w-4 h-4" />, color: 'indigo' }
]

interface PlanComparisonProps {
  isAnnual?: boolean
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ isAnnual = false }) => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['pro'])
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Trading Features'])
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId)
      } else if (prev.length < 3) {
        return [...prev, planId]
      }
      return prev
    })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const getDisplayPrice = (plan: PlanData) => {
    const price = isAnnual ? plan.price.annual : plan.price.monthly
    const period = isAnnual ? '/year' : '/month'

    if (plan.id === 'free-trial') {
      return { price: 'Free', period: '14 days' }
    }

    return { price: `$${price}`, period }
  }

  const getSavings = (plan: PlanData) => {
    if (plan.originalPrice && isAnnual) {
      const savings = plan.originalPrice.annual - plan.price.annual
      return `Save $${savings}`
    }
    return null
  }

  const getFeaturesByCategory = (category: string) => {
    const categoryFeatures: { [planId: string]: FeatureDetail } = {}
    
    planData.forEach(plan => {
      const feature = plan.features.find(f => f.category === category)
      if (feature) {
        categoryFeatures[plan.id] = feature
      }
    })
    
    return categoryFeatures
  }

  const getAllFeatures = () => {
    const allFeatures = new Set<string>()
    planData.forEach(plan => {
      plan.features.forEach(feature => {
        allFeatures.add(feature.name)
      })
    })
    return Array.from(allFeatures)
  }

  const getFeatureForPlan = (planId: string, featureName: string) => {
    const plan = planData.find(p => p.id === planId)
    return plan?.features.find(f => f.name === featureName)
  }

  const selectedPlanData = planData.filter(plan => selectedPlans.includes(plan.id))

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Plan Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Compare Plans
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Select up to 3 plans to compare their features side by side
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {planData.map((plan) => {
                const isSelected = selectedPlans.includes(plan.id)
                const displayPrice = getDisplayPrice(plan)
                const savings = getSavings(plan)

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      isSelected && "ring-2 ring-blue-500 shadow-lg",
                      plan.popular && "border-purple-500",
                      "hover:shadow-md"
                    )}
                    onClick={() => togglePlanSelection(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 right-4">
                        <Badge className="bg-purple-500 text-white">Popular</Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${plan.color}-100 dark:bg-${plan.color}-900/20 flex items-center justify-center`}>
                        {plan.icon}
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                      
                      <div className="mt-4">
                        <div className="text-3xl font-bold">
                          {displayPrice.price}
                          <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                            {displayPrice.period}
                          </span>
                        </div>
                        {savings && (
                          <p className="text-green-600 font-medium mt-1">{savings}</p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <Button
                        className={cn(
                          "w-full",
                          isSelected && "bg-blue-600 hover:bg-blue-700"
                        )}
                        variant={isSelected ? "default" : "outline"}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Compare
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feature Comparison */}
        {selectedPlans.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Feature Comparison
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                >
                  {showAllFeatures ? 'Show by Category' : 'Show All Features'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 min-w-[200px]">Feature</th>
                      {selectedPlanData.map(plan => (
                        <th key={plan.id} className="text-center p-4 min-w-[150px]">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 mb-2 rounded-lg bg-${plan.color}-100 dark:bg-${plan.color}-900/20 flex items-center justify-center`}>
                              {plan.icon}
                            </div>
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-sm text-gray-500">
                              {getDisplayPrice(plan).price}{getDisplayPrice(plan).period}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {showAllFeatures ? (
                      // Show all features in a flat list
                      getAllFeatures().map((featureName, index) => (
                        <tr key={featureName} className={cn("border-b", index % 2 === 0 && "bg-gray-50/50 dark:bg-gray-800/50")}>
                          <td className="p-4 font-medium">{featureName}</td>
                          {selectedPlanData.map(plan => {
                            const feature = getFeatureForPlan(plan.id, featureName)
                            return (
                              <td key={plan.id} className="p-4 text-center">
                                {feature ? (
                                  <div className="flex flex-col items-center">
                                    {feature.included ? (
                                      <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="flex flex-col items-center">
                                                  <Check className={cn(
                                                    "w-5 h-5",
                                                    feature.highlight ? "text-green-600" : "text-gray-400"
                                                  )} />
                                                  {feature.limit && (
                                                    <span className="text-xs text-gray-500 mt-1">
                                                      {feature.limit}
                                                    </span>
                                                  )}
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>{feature.tooltip || feature.description}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                    ) : (
                                      <X className="w-5 h-5 text-gray-300" />
                                    )}
                                  </div>
                                ) : (
                                  <X className="w-5 h-5 text-gray-300" />
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))
                    ) : (
                      // Show features grouped by category
                      featureCategories.map((category) => {
                        const isExpanded = expandedCategories.includes(category.name)
                        const categoryFeatures = getFeaturesByCategory(category.name)
                        
                        if (Object.keys(categoryFeatures).length === 0) return null

                        return (
                          <React.Fragment key={category.name}>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              <td colSpan={selectedPlanData.length + 1} className="p-4">
                                <button
                                  onClick={() => toggleCategory(category.name)}
                                  className="flex items-center gap-2 w-full text-left font-semibold hover:text-blue-600 transition-colors"
                                >
                                  <div className={`w-6 h-6 rounded bg-${category.color}-100 dark:bg-${category.color}-900/20 flex items-center justify-center`}>
                                    {category.icon}
                                  </div>
                                  <span>{category.name}</span>
                                  {isExpanded ? (
                                    <Minus className="w-4 h-4 ml-auto" />
                                  ) : (
                                    <Plus className="w-4 h-4 ml-auto" />
                                  )}
                                </button>
                              </td>
                            </tr>
                            {isExpanded && Object.keys(categoryFeatures).length > 0 && (
                              <tr className="border-b">
                                <td className="p-4 font-medium">{categoryFeatures[Object.keys(categoryFeatures)[0]].name}</td>
                                {selectedPlanData.map(plan => {
                                  const feature = categoryFeatures[plan.id]
                                  return (
                                    <td key={plan.id} className="p-4 text-center">
                                      {feature ? (
                                        <div className="flex flex-col items-center">
                                          {feature.included ? (
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="flex flex-col items-center">
                                                  <Check className={cn(
                                                    "w-5 h-5",
                                                    feature.highlight ? "text-green-600" : "text-gray-400"
                                                  )} />
                                                  {feature.limit && (
                                                    <span className="text-xs text-gray-500 mt-1">
                                                      {feature.limit}
                                                    </span>
                                                  )}
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>{feature.tooltip || feature.description}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          ) : (
                                            <X className="w-5 h-5 text-gray-300" />
                                          )}
                                        </div>
                                      ) : (
                                        <X className="w-5 h-5 text-gray-300" />
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Recommendations */}
        {selectedPlans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Our Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedPlanData.map(plan => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg bg-${plan.color}-100 dark:bg-${plan.color}-900/20 flex items-center justify-center`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{plan.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best for:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plan.bestFor.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {plan.limitations && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Limitations:</span>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {plan.limitations.map((limitation, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

export default PlanComparison