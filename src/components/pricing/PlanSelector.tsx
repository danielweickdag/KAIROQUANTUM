'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Check,
  Star,
  Crown,
  Award,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Users,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  Target,
  CheckCircle,
  X,
  CreditCard,
  Clock,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanFeature {
  name: string
  description: string
  included: boolean
  limit?: string
  highlight?: boolean
}

interface PlanTier {
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
  features: PlanFeature[]
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

interface UserPreferences {
  tradingExperience: 'beginner' | 'intermediate' | 'advanced'
  portfolioSize: 'small' | 'medium' | 'large'
  tradingFrequency: 'occasional' | 'regular' | 'daily'
  primaryGoal: 'learning' | 'income' | 'growth' | 'diversification'
  budget: 'free' | 'budget' | 'premium' | 'enterprise'
}

const planTiers: PlanTier[] = [
  {
    id: 'free-trial',
    name: 'Free Trial',
    description: 'Perfect for getting started',
    price: { monthly: 0, annual: 0 },
    features: [
      { name: 'Basic Copy Trading', description: 'Follow up to 3 creators', included: true, limit: '3 creators' },
      { name: 'Basic Analytics', description: 'Essential performance metrics', included: true },
      { name: 'Email Support', description: '24-48 hour response time', included: true },
      { name: 'Mobile App Access', description: 'iOS and Android apps', included: true },
      { name: 'Paper Trading', description: 'Practice with virtual money', included: true },
      { name: 'Advanced Strategies', description: 'Complex trading algorithms', included: false },
      { name: 'Priority Support', description: 'Faster response times', included: false },
      { name: 'API Access', description: 'Programmatic trading', included: false }
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
      { name: 'Unlimited Copy Trading', description: 'Follow unlimited creators', included: true, highlight: true },
      { name: 'Advanced Analytics', description: 'Comprehensive performance metrics', included: true, highlight: true },
      { name: 'Priority Support', description: '4-12 hour response time', included: true },
      { name: 'API Access', description: 'Programmatic trading access', included: true },
      { name: 'Custom Strategies', description: 'Create your own algorithms', included: true },
      { name: 'Risk Management Tools', description: 'Advanced risk controls', included: true },
      { name: 'Real-time Alerts', description: 'Instant notifications', included: true },
      { name: 'White-label Solution', description: 'Custom branding', included: false }
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
      { name: 'Everything in Pro', description: 'All Pro features included', included: true },
      { name: 'White-label Solution', description: 'Custom branding and domain', included: true, highlight: true },
      { name: 'Dedicated Account Manager', description: 'Personal support specialist', included: true, highlight: true },
      { name: 'Custom Integrations', description: 'Bespoke API integrations', included: true },
      { name: 'Advanced Security', description: 'Enterprise-grade security', included: true },
      { name: 'Team Management', description: 'Multi-user account management', included: true },
      { name: 'Custom Reporting', description: 'Tailored analytics and reports', included: true },
      { name: 'SLA Guarantee', description: '99.9% uptime guarantee', included: true }
    ],
    icon: <Award className="w-6 h-6" />,
    color: 'orange',
    buttonText: 'Contact Sales',
    bestFor: ['Large institutions', 'Trading firms', 'White-label solutions'],
    limitations: ['Custom pricing', 'Minimum user requirements']
  }
]

const PlanSelector: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [userPreferences, setUserPreferences] = useState<Partial<UserPreferences>>({})
  const [recommendedPlan, setRecommendedPlan] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const steps = [
    'Tell us about yourself',
    'Choose your plan',
    'Review and confirm'
  ]

  useEffect(() => {
    // Calculate recommended plan based on user preferences
    if (Object.keys(userPreferences).length >= 3) {
      const { tradingExperience, portfolioSize, budget } = userPreferences
      
      if (budget === 'free' || tradingExperience === 'beginner') {
        setRecommendedPlan('free-trial')
      } else if (budget === 'enterprise' || portfolioSize === 'large') {
        setRecommendedPlan('enterprise')
      } else {
        setRecommendedPlan('pro')
      }
    }
  }, [userPreferences])

  const handlePreferenceChange = (key: keyof UserPreferences, value: string) => {
    setUserPreferences(prev => ({ ...prev, [key]: value }))
  }

  const getDisplayPrice = (tier: PlanTier) => {
    const price = isAnnual ? tier.price.annual : tier.price.monthly
    const period = isAnnual ? '/year' : '/month'

    if (tier.id === 'free-trial') {
      return { price: 'Free', period: '14 days' }
    }

    return { price: `$${price}`, period }
  }

  const getSavings = (tier: PlanTier) => {
    if (tier.originalPrice && isAnnual) {
      const savings = tier.originalPrice.annual - tier.price.annual
      return `Save $${savings}`
    }
    return null
  }

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Let's find your perfect plan</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Answer a few questions to get personalized recommendations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trading Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'beginner', label: 'Beginner', desc: 'New to trading' },
              { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
              { value: 'advanced', label: 'Advanced', desc: 'Experienced trader' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange('tradingExperience', option.value)}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-colors",
                  userPreferences.tradingExperience === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Size</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'small', label: 'Small', desc: 'Under $10K' },
              { value: 'medium', label: 'Medium', desc: '$10K - $100K' },
              { value: 'large', label: 'Large', desc: 'Over $100K' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange('portfolioSize', option.value)}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-colors",
                  userPreferences.portfolioSize === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trading Frequency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'occasional', label: 'Occasional', desc: 'Few times a month' },
              { value: 'regular', label: 'Regular', desc: 'Few times a week' },
              { value: 'daily', label: 'Daily', desc: 'Multiple times daily' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange('tradingFrequency', option.value)}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-colors",
                  userPreferences.tradingFrequency === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primary Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'learning', label: 'Learning', desc: 'Understand markets' },
              { value: 'income', label: 'Income', desc: 'Generate regular income' },
              { value: 'growth', label: 'Growth', desc: 'Long-term wealth building' },
              { value: 'diversification', label: 'Diversification', desc: 'Spread risk' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handlePreferenceChange('primaryGoal', option.value)}
                className={cn(
                  "w-full p-3 text-left rounded-lg border transition-colors",
                  userPreferences.primaryGoal === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPlanSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Choose Your Plan</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {recommendedPlan && `We recommend the ${planTiers.find(p => p.id === recommendedPlan)?.name} plan based on your preferences`}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={cn("text-lg", !isAnnual && "font-semibold")}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            isAnnual ? "bg-green-500" : "bg-gray-300"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              isAnnual ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        <span className={cn("text-lg", isAnnual && "font-semibold")}>Annual</span>
        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
          Save up to 25%
        </Badge>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {planTiers.map((tier) => {
          const displayPrice = getDisplayPrice(tier)
          const savings = getSavings(tier)
          const isRecommended = recommendedPlan === tier.id
          const isSelected = selectedPlan === tier.id

          return (
            <Card
              key={tier.id}
              className={cn(
                "relative transition-all duration-200 cursor-pointer",
                isSelected && "ring-2 ring-blue-500 shadow-lg",
                isRecommended && "border-green-500 shadow-md",
                "hover:shadow-lg"
              )}
              onClick={() => setSelectedPlan(tier.id)}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}
              
              {tier.popular && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-purple-500 text-white">Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${tier.color}-100 dark:bg-${tier.color}-900/20 flex items-center justify-center`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">{tier.description}</p>
                
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
                <div className="space-y-3 mb-6">
                  {tier.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className={cn(
                          "w-4 h-4 mt-0.5 flex-shrink-0",
                          feature.highlight ? "text-green-600" : "text-gray-400"
                        )} />
                      ) : (
                        <X className="w-4 h-4 mt-0.5 text-gray-300 flex-shrink-0" />
                      )}
                      <div className={cn(
                        "text-sm",
                        feature.included ? "text-gray-900 dark:text-gray-100" : "text-gray-400"
                      )}>
                        <span className={feature.highlight ? "font-medium" : ""}>{feature.name}</span>
                        {feature.limit && (
                          <span className="text-gray-500 ml-1">({feature.limit})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

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
                    tier.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Feature Comparison Link */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => setShowComparison(true)}
          className="text-blue-600 hover:text-blue-700"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Compare all features
        </Button>
      </div>
    </div>
  )

  const renderConfirmationStep = () => {
    const selectedTier = planTiers.find(tier => tier.id === selectedPlan)
    if (!selectedTier) return null

    const displayPrice = getDisplayPrice(selectedTier)

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Review Your Selection</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Confirm your plan details before proceeding
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-lg bg-${selectedTier.color}-100 dark:bg-${selectedTier.color}-900/20 flex items-center justify-center`}>
              {selectedTier.icon}
            </div>
            <CardTitle className="text-2xl">{selectedTier.name}</CardTitle>
            <div className="text-3xl font-bold mt-2">
              {displayPrice.price}
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                {displayPrice.period}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What's included:</h4>
                <div className="space-y-2">
                  {selectedTier.features.filter(f => f.included).slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Perfect for:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTier.bestFor.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedTier.trialDays && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedTier.trialDays}-day free trial included
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full mt-6" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Continue to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return Object.keys(userPreferences).length >= 3
    }
    if (currentStep === 1) {
      return selectedPlan !== null
    }
    return true
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Target className="w-5 h-5 mr-2" />
            Find My Perfect Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Plan Selection Wizard</DialogTitle>
            <DialogDescription>
              Let us help you find the perfect plan for your trading needs
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-sm font-medium",
                    index <= currentStep ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {step}
                </div>
              ))}
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 0 && renderPreferencesStep()}
            {currentStep === 1 && renderPlanSelectionStep()}
            {currentStep === 2 && renderConfirmationStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // Handle final submission
                  console.log('Plan selected:', selectedPlan)
                  setIsDialogOpen(false)
                }}
                disabled={!selectedPlan}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Feature Comparison Modal */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feature Comparison</DialogTitle>
            <DialogDescription>
              Compare all features across our plans
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  {planTiers.map(tier => (
                    <th key={tier.id} className="text-center p-3 min-w-[120px]">
                      <div className="flex flex-col items-center">
                        {tier.icon}
                        <span className="mt-1 font-medium">{tier.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planTiers[0].features.map((_, featureIndex) => (
                  <tr key={featureIndex} className="border-b">
                    <td className="p-3 font-medium">
                      {planTiers[0].features[featureIndex]?.name}
                    </td>
                    {planTiers.map(tier => {
                      const feature = tier.features[featureIndex]
                      return (
                        <td key={tier.id} className="p-3 text-center">
                          {feature?.included ? (
                            <div className="flex flex-col items-center">
                              <Check className="w-5 h-5 text-green-600" />
                              {feature.limit && (
                                <span className="text-xs text-gray-500 mt-1">
                                  {feature.limit}
                                </span>
                              )}
                            </div>
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlanSelector