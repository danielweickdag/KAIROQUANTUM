'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Check,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
  Brain,
  Bell,
  Lock,
  Smartphone,
  Globe,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Activity,
  Eye,
  MessageSquare,
  Settings,
  Download,
  Headphones,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  ChevronRight,
  BookOpen,
  UserCheck,
  CreditCard,
  Rocket,
  Info,
  HelpCircle
} from 'lucide-react'
import PlanSelector from './PlanSelector'
import PlanComparison from './PlanComparison'
import FeatureBreakdown from './FeatureBreakdown'
import { cn } from '@/lib/utils'
import { usePricingWorkflow, type PricingRecommendation } from '@/services/pricingWorkflowService'
import { useOnboardingWorkflow, type OnboardingStep } from '@/services/onboardingWorkflowService'
import OnboardingQuestionnaire from '@/components/onboarding/OnboardingQuestionnaire'
import { alertService } from '@/services/alertService'

interface PricingTier {
  id: string
  name: string
  description: string
  detailedDescription?: string
  price: {
    monthly: number
    annual: number
  }
  priceText?: {
    monthly?: string
    annual?: string
  }
  originalPrice?: {
    monthly: number
    annual: number
  }
  features: string[]
  detailedFeatures?: {
    category: string
    items: {
      name: string
      description: string
      included: boolean
      limit?: string
    }[]
  }[]
  highlighted?: boolean
  popular?: boolean
  trialDays?: number
  buttonText: string
  buttonVariant: 'default' | 'outline' | 'secondary'
  icon: React.ReactNode
  color: string
  benefits: {
    title: string
    description: string
    icon: React.ReactNode
  }[]
  isVariable?: boolean
  savings?: string
  bestFor?: string[]
  limitations?: string[]
}

const PricingPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined)
  const [isAnnual, setIsAnnual] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [showDetailedView, setShowDetailedView] = useState<string | null>(null)
  const { recommendations, metrics } = usePricingWorkflow()
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { steps: onboardingSteps, progress: onboardingProgress, completeStep } = useOnboardingWorkflow(selectedPlan || undefined)
  
  const handleOnboardingComplete = (formData: any) => {
    console.log('Onboarding completed with data:', formData)
    // Here you would typically save the data to your backend
    // and redirect the user to their dashboard
    setShowOnboarding(false)
    // You could also trigger a success notification here
  }

  const pricingTiers: PricingTier[] = [
    {
      id: 'free-trial',
      name: 'Free Trial',
      description: 'Perfect for getting started',
      detailedDescription: 'Experience the power of KAIRO with our comprehensive 14-day free trial. No credit card required, full access to core features.',
      price: { monthly: 0, annual: 0 },
      features: [
        'Basic Copy Trading',
        'Up to 3 Creators',
        'Basic Analytics',
        'Email Support',
        'Mobile App Access'
      ],
      detailedFeatures: [
        {
          category: 'Trading Features',
          items: [
            { name: 'Copy Trading', description: 'Follow and copy successful traders', included: true, limit: '3 creators' },
            { name: 'Manual Trading', description: 'Execute your own trades', included: true },
            { name: 'Paper Trading', description: 'Practice with virtual money', included: true },
            { name: 'Advanced Strategies', description: 'Complex trading algorithms', included: false }
          ]
        },
        {
          category: 'Analytics & Insights',
          items: [
            { name: 'Basic Analytics', description: 'Essential performance metrics', included: true },
            { name: 'Risk Analysis', description: 'Portfolio risk assessment', included: true, limit: 'Basic' },
            { name: 'AI Insights', description: 'AI-powered market analysis', included: false },
            { name: 'Custom Reports', description: 'Personalized reporting', included: false }
          ]
        },
        {
          category: 'Support & Access',
          items: [
            { name: 'Email Support', description: '24/7 email assistance', included: true },
            { name: 'Mobile App', description: 'iOS and Android apps', included: true },
            { name: 'Priority Support', description: 'Faster response times', included: false },
            { name: 'Phone Support', description: 'Direct phone assistance', included: false }
          ]
        }
      ],
      trialDays: 14,
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline',
      icon: <Star className="w-6 h-6" />,
      color: 'blue',
      benefits: [
        {
          title: 'Risk-Free Start',
          description: 'Try all features without commitment',
          icon: <Shield className="w-5 h-5" />
        }
      ],
      bestFor: ['Beginners', 'Testing the platform', 'Small portfolios'],
      limitations: ['Limited to 3 creators', 'Basic analytics only', 'Email support only']
    },
    {
      id: 'creator-quarterly',
      name: 'Creator Program (Quarterly)',
      description: 'Dub Advisors Creator Program – variable per creator',
      detailedDescription: 'Join our creator ecosystem and monetize your trading expertise. Flexible quarterly pricing based on your following and performance.',
      price: { monthly: 0, annual: 0 },
      priceText: { monthly: '$9.99–$199.99 (per quarter)' },
      features: [
        'Participate as Creator',
        'Access creator monetization tools',
        'Variable pricing per creator',
        'Community and support'
      ],
      detailedFeatures: [
        {
          category: 'Creator Tools',
          items: [
            { name: 'Creator Dashboard', description: 'Comprehensive creator analytics', included: true },
            { name: 'Follower Management', description: 'Manage your subscriber base', included: true },
            { name: 'Revenue Tracking', description: 'Monitor your earnings', included: true },
            { name: 'Performance Analytics', description: 'Detailed trading performance metrics', included: true }
          ]
        },
        {
          category: 'Monetization',
          items: [
            { name: 'Subscription Revenue', description: 'Earn from followers', included: true },
            { name: 'Performance Fees', description: 'Earn based on profits generated', included: true },
            { name: 'Tiered Pricing', description: 'Set different subscription levels', included: true },
            { name: 'Custom Strategies', description: 'Sell exclusive trading strategies', included: true }
          ]
        }
      ],
      buttonText: 'Apply as Creator',
      buttonVariant: 'default',
      icon: <Award className="w-6 h-6" />,
      color: 'green',
      benefits: [
        { title: 'Flexible Pricing', description: 'Quarterly subscription range per creator', icon: <CreditCard className="w-5 h-5" /> }
      ],
      isVariable: true,
      bestFor: ['Experienced traders', 'Content creators', 'Building a following'],
      limitations: ['Application required', 'Performance requirements', 'Revenue sharing']
    },
    {
      id: 'creator-annual',
      name: 'Creator Program (Annual)',
      description: 'Dub Advisors Creator Program – variable per creator',
      detailedDescription: 'Annual creator program with enhanced benefits and better revenue sharing. Ideal for established creators looking for long-term growth.',
      price: { monthly: 0, annual: 0 },
      priceText: { annual: '$99.99–$599.99 (per year)' },
      features: [
        'Participate as Creator',
        'Access creator monetization tools',
        'Variable pricing per creator',
        'Annual program benefits'
      ],
      buttonText: 'Apply as Creator',
      buttonVariant: 'default',
      icon: <Award className="w-6 h-6" />,
      color: 'green',
      benefits: [
        { title: 'Flexible Pricing', description: 'Annual subscription range per creator', icon: <CreditCard className="w-5 h-5" /> }
      ],
      isVariable: true,
      savings: 'Up to 30% vs quarterly',
      bestFor: ['Established creators', 'Long-term commitment', 'Higher revenue potential'],
      limitations: ['Annual commitment', 'Higher performance requirements']
    },
    {
      id: 'pro-monthly',
      name: 'Pro',
      description: 'Most popular for active traders',
      detailedDescription: 'Unlock the full potential of KAIRO with unlimited copy trading, advanced analytics, and priority support. Perfect for serious traders.',
      price: { monthly: 49, annual: 490 },
      originalPrice: { monthly: 59, annual: 590 },
      features: [
        'Unlimited Copy Trading',
        'Follow 50+ Creators',
        'Advanced Analytics',
        'Priority Support',
        'API Access',
        'Custom Strategies',
        'Risk Management Tools'
      ],
      detailedFeatures: [
        {
          category: 'Trading Features',
          items: [
            { name: 'Copy Trading', description: 'Follow unlimited successful traders', included: true, limit: '50+ creators' },
            { name: 'Advanced Strategies', description: 'Access to complex algorithms', included: true },
            { name: 'Risk Management', description: 'Advanced risk controls', included: true },
            { name: 'API Access', description: 'Programmatic trading access', included: true }
          ]
        },
        {
          category: 'Analytics & Insights',
          items: [
            { name: 'Advanced Analytics', description: 'Comprehensive performance metrics', included: true },
            { name: 'AI Insights', description: 'AI-powered market analysis', included: true },
            { name: 'Custom Reports', description: 'Personalized reporting', included: true },
            { name: 'Real-time Alerts', description: 'Instant market notifications', included: true }
          ]
        },
        {
          category: 'Support & Access',
          items: [
            { name: 'Priority Support', description: 'Faster response times', included: true },
            { name: 'Phone Support', description: 'Direct phone assistance', included: true },
            { name: 'Dedicated Manager', description: 'Personal account manager', included: false },
            { name: 'White-label', description: 'Custom branding options', included: false }
          ]
        }
      ],
      highlighted: false,
      popular: true,
      buttonText: 'Get Pro',
      buttonVariant: 'default',
      icon: <Crown className="w-6 h-6" />,
      color: 'purple',
      benefits: [
        {
          title: 'Advanced Trading',
          description: 'Professional-grade tools and analytics',
          icon: <TrendingUp className="w-5 h-5" />
        }
      ],
      bestFor: ['Active traders', 'Portfolio diversification', 'Professional trading'],
      limitations: ['Monthly commitment', 'No white-label features']
    },
    {
      id: 'pro-annual',
      name: 'Pro Annual',
      description: 'Best value for committed traders',
      detailedDescription: 'Get all Pro features with significant annual savings. Ideal for traders committed to long-term success with KAIRO.',
      price: { monthly: 49, annual: 490 },
      originalPrice: { monthly: 59, annual: 590 },
      features: [
        'Unlimited Copy Trading',
        'Follow 50+ Creators',
        'Advanced Analytics',
        'Priority Support',
        'API Access',
        'Custom Strategies',
        'Risk Management Tools',
        '25% Annual Savings'
      ],
      highlighted: true,
      buttonText: 'Get Pro Annual',
      buttonVariant: 'default',
      icon: <Crown className="w-6 h-6" />,
      color: 'purple',
      benefits: [
        {
          title: 'Maximum Savings',
          description: 'Best value with annual commitment',
          icon: <TrendingUp className="w-5 h-5" />
        }
      ],
      savings: '25% vs monthly',
      bestFor: ['Committed traders', 'Long-term investors', 'Cost-conscious users'],
      limitations: ['Annual commitment required']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For institutions and large teams',
      detailedDescription: 'Enterprise-grade solution with white-label options, dedicated support, and custom integrations. Perfect for institutions and large trading teams.',
      price: { monthly: 199, annual: 1990 },
      originalPrice: { monthly: 249, annual: 2490 },
      features: [
        'Everything in Pro',
        'White-label Solution',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Advanced Security',
        'Team Management',
        'Custom Reporting'
      ],
      detailedFeatures: [
        {
          category: 'Enterprise Features',
          items: [
            { name: 'White-label Solution', description: 'Custom branding and domain', included: true },
            { name: 'Team Management', description: 'Multi-user account management', included: true },
            { name: 'Custom Integrations', description: 'Bespoke API integrations', included: true },
            { name: 'Advanced Security', description: 'Enterprise-grade security features', included: true }
          ]
        },
        {
          category: 'Support & Services',
          items: [
            { name: 'Dedicated Manager', description: 'Personal account manager', included: true },
            { name: '24/7 Phone Support', description: 'Round-the-clock assistance', included: true },
            { name: 'Custom Training', description: 'Personalized onboarding', included: true },
            { name: 'SLA Guarantee', description: 'Service level agreements', included: true }
          ]
        }
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary',
      icon: <Award className="w-6 h-6" />,
      color: 'orange',
      benefits: [
        {
          title: 'Enterprise Scale',
          description: 'Built for large organizations',
          icon: <Users className="w-5 h-5" />
        }
      ],
      bestFor: ['Large institutions', 'Trading firms', 'White-label solutions'],
      limitations: ['Custom pricing', 'Minimum user requirements']
    }
  ]

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId)
    setShowOnboarding(true)
    console.log('Selected plan:', planId)
    
    // Automatically enable alerts for users who select a plan
    try {
      await alertService.enableAlerts();
      console.log('Alerts automatically enabled for plan selection:', planId);
    } catch (error) {
      console.warn('Failed to auto-enable alerts for plan selection:', error);
    }
    
    // In a real app, this would redirect to payment processing
    // For demo purposes, we'll show the onboarding workflow
  }

  const getDisplayPrice = (tier: PricingTier) => {
    const price = isAnnual ? tier.price.annual : tier.price.monthly
    const period = isAnnual ? '/year' : '/month'

    if (tier.id === 'free-trial') {
      return { price: 'Free', period: '14 days' }
    }

    if (tier.isVariable) {
      const variableText = isAnnual ? tier.priceText?.annual : tier.priceText?.monthly
      return { price: variableText || 'Variable', period: '' }
    }

    return { price: `$${price}`, period }
  }

  const getSavingsAmount = (tier: PricingTier) => {
    if (!isAnnual || !tier.originalPrice) return null
    const monthlySavings = tier.originalPrice.annual - tier.price.annual
    const percentageSavings = Math.round((monthlySavings / tier.originalPrice.annual) * 100)
    return { amount: monthlySavings, percentage: percentageSavings }
  }

  const getSavings = (tier: PricingTier) => {
    if (tier.originalPrice && isAnnual) {
      const savings = tier.originalPrice.annual - tier.price.annual
      return `Save $${savings.toFixed(2)}`
    }
    return null
  }

  const getAnnualSavingsPercentage = (tier: PricingTier) => {
    if (tier.originalPrice && isAnnual) {
      const monthlyTotal = tier.originalPrice.monthly * 12
      const annualPrice = tier.price.annual
      const savingsPercentage = ((monthlyTotal - annualPrice) / monthlyTotal) * 100
      return Math.round(savingsPercentage)
    }
    return 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  const getRealTimeSavings = () => {
    if (!isAnnual) return 0
    return pricingTiers.reduce((total, tier) => {
      if (tier.originalPrice) {
        const monthlyTotal = tier.originalPrice.monthly * 12
        const savings = monthlyTotal - tier.price.annual
        return total + savings
      }
      return total
    }, 0)
  }

  const dismissRecommendation = (planId: string) => {
    setDismissedRecommendations(prev => [...prev, planId])
  }

  const getRecommendationIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'medium': return <Lightbulb className="w-5 h-5 text-yellow-500" />
      default: return <CheckCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const activeRecommendations = recommendations.filter(
    rec => !dismissedRecommendations.includes(rec.planId)
  )

  const togglePlanComparison = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId)
      } else if (prev.length < 3) {
        return [...prev, planId]
      }
      return prev
    })
  }

  const getFeatureTooltip = (feature: string) => {
    const tooltips: Record<string, string> = {
      'Copy Trading': 'Automatically replicate trades from successful traders in real-time',
      'Advanced Analytics': 'Comprehensive performance metrics, risk analysis, and portfolio insights',
      'Priority Support': '24/7 dedicated support with faster response times',
      'Custom Strategies': 'Create and backtest your own trading algorithms',
      'API Access': 'Full REST and WebSocket API access for custom integrations',
      'White-label Solution': 'Fully customizable platform with your branding',
      'Dedicated Account Manager': 'Personal relationship manager for enterprise clients',
      'Custom Integrations': 'Tailored integrations with your existing systems'
    }
    return tooltips[feature] || 'Learn more about this feature'
  }

  const clearComparison = () => {
    setSelectedPlans([])
    setComparisonMode(false)
  }

  const toggleDetailedView = (planId: string) => {
    setShowDetailedView(showDetailedView === planId ? null : planId)
  }

  const renderDetailedFeatures = (tier: PricingTier) => {
    if (!tier.detailedFeatures) return null

    return (
      <div className="mt-6 space-y-6">
        {tier.detailedFeatures.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.included ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "font-medium",
                        item.included ? "text-gray-900" : "text-gray-400"
                      )}>
                        {item.name}
                      </span>
                      {item.limit && (
                        <Badge variant="outline" className="text-xs">
                          {item.limit}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm mt-1",
                      item.included ? "text-gray-600" : "text-gray-400"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderPlanCard = (tier: PricingTier, index: number) => {
    const { price, period } = getDisplayPrice(tier)
    const savings = getSavingsAmount(tier)
    const isSelected = selectedPlan === tier.id
    const isHovered = hoveredPlan === tier.id
    const isInComparison = selectedPlans.includes(tier.id)
    const isDetailedViewOpen = showDetailedView === tier.id

    return (
      <Card
        key={tier.id}
        className={cn(
          "relative overflow-hidden transition-all duration-500 transform hover:scale-105 cursor-pointer group",
          "border-2 hover:shadow-2xl",
          tier.highlighted && "ring-4 ring-purple-500/20 border-purple-500 shadow-2xl scale-105",
          tier.popular && "border-blue-500 shadow-xl",
          isSelected && "ring-4 ring-blue-500/30 border-blue-500",
          isHovered && "shadow-2xl border-gray-400",
          isInComparison && "ring-2 ring-orange-400 border-orange-400"
        )}
        onMouseEnter={() => setHoveredPlan(tier.id)}
        onMouseLeave={() => setHoveredPlan(null)}
      >
        {/* Enhanced Popular Badge */}
        {tier.popular && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-bl-2xl rounded-tr-lg shadow-lg">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">Most Popular</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Savings Badge */}
        {savings && isAnnual && (
          <div className="absolute -top-1 -left-1 z-20">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-br-2xl rounded-tl-lg shadow-lg">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-bold">Save {savings.percentage}%</span>
              </div>
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-3 rounded-2xl shadow-lg",
              `bg-gradient-to-br from-${tier.color}-400 to-${tier.color}-600`
            )}>
              {tier.icon}
            </div>
            <div className="flex space-x-2">
              {comparisonMode && (
                <Button
                  variant={isInComparison ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlanComparison(tier.id)
                  }}
                  className="h-8 w-8 p-0"
                >
                  {isInComparison ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDetailedView(tier.id)
                }}
                className="h-8 w-8 p-0"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {tier.name}
          </CardTitle>
          <p className="text-gray-600 mb-4">{tier.description}</p>

          {/* Enhanced Pricing Display */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-black text-gray-900">
                {price}
              </span>
              {period && (
                <span className="text-lg text-gray-500 font-medium">
                  {period}
                </span>
              )}
            </div>
            
            {tier.originalPrice && isAnnual && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="line-through text-gray-400">
                  ${tier.originalPrice.annual}/year
                </span>
                <Badge className="bg-green-100 text-green-800 font-semibold">
                  Save ${tier.originalPrice.annual - tier.price.annual}
                </Badge>
              </div>
            )}

            {tier.savings && (
              <p className="text-sm text-green-600 font-medium mt-1">
                {tier.savings}
              </p>
            )}
          </div>

          {/* Best For Section */}
          {tier.bestFor && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Best for:</p>
              <div className="flex flex-wrap gap-1">
                {tier.bestFor.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Features List */}
          <div className="space-y-3 mb-6">
            {tier.features.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className="flex items-start space-x-3 group/feature"
                onMouseEnter={() => setShowTooltip(feature)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-medium group-hover/feature:text-gray-900 transition-colors">
                  {feature}
                </span>
                {showTooltip === feature && (
                  <div className="absolute z-30 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs">
                    {getFeatureTooltip(feature)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed View */}
          {isDetailedViewOpen && (
            <div className="border-t pt-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Detailed Features</h4>
              {tier.detailedDescription && (
                <p className="text-gray-600 mb-4">{tier.detailedDescription}</p>
              )}
              {renderDetailedFeatures(tier)}
              
              {tier.limitations && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Limitations:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tier.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-gray-400">•</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          {tier.benefits.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
              <div className="space-y-2">
                {tier.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {benefit.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{benefit.title}</p>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced CTA Button */}
          <Button
            className={cn(
              "w-full py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105",
              tier.buttonVariant === 'default' && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
              tier.buttonVariant === 'outline' && "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
              tier.buttonVariant === 'secondary' && "bg-gray-800 hover:bg-gray-900 text-white"
            )}
            onClick={() => handlePlanSelect(tier.id)}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{tier.buttonText}</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>

          {tier.trialDays && (
            <p className="text-center text-sm text-gray-500 mt-3">
              {tier.trialDays}-day free trial included
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-xl text-gray-600 mb-8">Choose the plan that works for you</p>
        <PlanSelector />
      </div>
        
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Label htmlFor="billing-toggle">Monthly</Label>
        <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
        <Label htmlFor="billing-toggle">Annual</Label>
        <Badge variant="secondary">Save 25%</Badge>
      </div>

      {/* Plan Comparison */}
      <div className="flex justify-center mb-8">
        <Button
          variant={comparisonMode ? "default" : "outline"}
          onClick={() => setComparisonMode(!comparisonMode)}
        >
          Compare Plans
        </Button>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {pricingTiers.map((tier, index) => renderPlanCard(tier, index))}
      </div>

      {/* Plan Comparison */}
      <PlanComparison isAnnual={isAnnual} />

      {/* Feature Breakdown */}
      <FeatureBreakdown selectedPlan={selectedPlan} />

    </div>
  )
}

export default PricingPlans