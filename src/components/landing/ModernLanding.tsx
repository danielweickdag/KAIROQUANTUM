'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Shield,
  Users,
  Brain,
  Zap,
  Globe,
  Award,
  BarChart3,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Eye,
  Lock,
  Smartphone,
  Activity,
  DollarSign,
  Clock,
  Crown,
  Rocket,
  LineChart,
  PieChart,
  Bell,
  Settings,
  Download,
  MousePointer,
  Layers,
  Cpu,
  Database,
  Network,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ModernLanding: React.FC = () => {
  const router = useRouter();

  // Custom CSS animations
  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .animate-float-delayed {
      animation: float-delayed 3s ease-in-out infinite 1s;
    }
    
    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
    }
    
    .animation-delay-1000 {
      animation-delay: 1s;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `;

  // Inject styles
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    portfolio: 0,
    profit: 0,
    trades: 0,
    percentage: 0
  });
  const [chartData, setChartData] = useState([40, 60, 45, 80, 65, 90, 75, 95, 85, 100, 90, 85]);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate portfolio value
    const portfolioTarget = 124567.89;
    const profitTarget = 12456;
    const tradesTarget = 1247;
    const percentageTarget = 2.4;
    
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        callback(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    setTimeout(() => {
      animateValue(0, portfolioTarget, 2000, (value) => {
        setAnimatedValues(prev => ({ ...prev, portfolio: value }));
      });
      animateValue(0, profitTarget, 2200, (value) => {
        setAnimatedValues(prev => ({ ...prev, profit: value }));
      });
      animateValue(0, tradesTarget, 1800, (value) => {
        setAnimatedValues(prev => ({ ...prev, trades: value }));
      });
      animateValue(0, percentageTarget, 1500, (value) => {
        setAnimatedValues(prev => ({ ...prev, percentage: value }));
      });
    }, 500);

    // Animate chart data
    const chartInterval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        // Update last few bars with random variations
        for (let i = newData.length - 3; i < newData.length; i++) {
          newData[i] = Math.max(20, Math.min(100, newData[i] + (Math.random() - 0.5) * 10));
        }
        return newData;
      });
    }, 2000);

    return () => clearInterval(chartInterval);
  }, []);

  const handleGetStarted = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleWatchDemo = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation Header */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              KAIRO
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
            <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleLogin}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              Login
            </Button>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={cn(
              "space-y-8 transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}>
              <div className="space-y-2">
                <p className="text-gray-400 text-lg">Here's the app for you</p>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  The new era of{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    finance
                  </span>
                  <br />
                  technology.
                </h1>
              </div>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Managing your financial business in easy way.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try it free
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleWatchDemo}
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Show me the demo
                </Button>
              </div>
            </div>

            {/* Right Content - 3D Phone Mockup */}
            <div className={cn(
              "relative transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}>
              <div className="relative">
                {/* Floating Data Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top Left - Market Cap */}
                  <div className="absolute top-10 left-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30 animate-float">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Market Cap</span>
                    </div>
                    <p className="text-blue-400 font-bold text-sm">$2.1T</p>
                  </div>

                  {/* Top Right - Volume */}
                  <div className="absolute top-20 right-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30 animate-float-delayed">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-white text-xs font-medium">24h Volume</span>
                    </div>
                    <p className="text-green-400 font-bold text-sm">$89.2B</p>
                  </div>

                  {/* Middle Left - AI Signal */}
                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 animate-bounce-slow">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span className="text-white text-xs font-medium">AI Signal</span>
                    </div>
                    <p className="text-purple-400 font-bold text-sm">BUY</p>
                  </div>

                  {/* Middle Right - Success Rate */}
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-3 border border-orange-500/30 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <Target className="w-3 h-3 text-orange-400" />
                      <span className="text-white text-xs font-medium">Success Rate</span>
                    </div>
                    <p className="text-orange-400 font-bold text-sm">94.2%</p>
                  </div>

                  {/* Bottom Left - Active Traders */}
                  <div className="absolute bottom-20 left-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/30 animate-float">
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span className="text-white text-xs font-medium">Active Traders</span>
                    </div>
                    <p className="text-cyan-400 font-bold text-sm">12.4K</p>
                  </div>

                  {/* Bottom Right - ROI */}
                  <div className="absolute bottom-10 right-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-3 border border-emerald-500/30 animate-float-delayed">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span className="text-white text-xs font-medium">Avg ROI</span>
                    </div>
                    <p className="text-emerald-400 font-bold text-sm">+127%</p>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping animation-delay-1000"></div>
                  <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-2000"></div>
                </div>

                {/* Phone Frame */}
                <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500">
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center text-white text-sm mb-6">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-white rounded-sm"></div>
                          <div className="w-1 h-2 bg-white rounded-sm"></div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="text-center">
                          <h3 className="text-white text-lg font-bold">Portfolio</h3>
                          <p className="text-gray-300 text-sm">
                            ${animatedValues.portfolio.toLocaleString('en-US', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </p>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-white text-sm font-medium">Today's Performance</span>
                            <span className="text-green-400 text-sm font-bold">
                              +{animatedValues.percentage.toFixed(1)}%
                            </span>
                          </div>
                          
                          {/* Animated Chart */}
                          <div className="h-24 flex items-end space-x-1 relative">
                            {chartData.map((height, i) => (
                              <div 
                                key={i}
                                className="bg-gradient-to-t from-orange-500 via-red-400 to-pink-400 rounded-t flex-1 transition-all duration-1000 ease-out relative"
                                style={{ height: `${height}%` }}
                              >
                                {/* Glowing effect for active bars */}
                                {i >= chartData.length - 3 && (
                                  <div className="absolute inset-0 bg-gradient-to-t from-orange-300 to-pink-300 rounded-t opacity-50 animate-pulse"></div>
                                )}
                              </div>
                            ))}
                            
                            {/* Trend line overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path
                                  d="M 0,80 Q 25,60 50,40 T 100,20"
                                  stroke="rgba(255,255,255,0.6)"
                                  strokeWidth="2"
                                  fill="none"
                                  className="animate-pulse"
                                />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Data points indicator */}
                          <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>9AM</span>
                            <span>12PM</span>
                            <span>3PM</span>
                            <span className="text-green-400 font-bold">Now</span>
                          </div>
                        </div>

                        {/* Enhanced Stats Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-3 backdrop-blur-sm border border-green-500/30">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-white text-xs">Profit</span>
                            </div>
                            <p className="text-white font-bold text-sm">
                              ${Math.floor(animatedValues.profit).toLocaleString()}
                            </p>
                            <div className="w-full bg-green-900/30 rounded-full h-1 mt-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-emerald-400 h-1 rounded-full transition-all duration-2000"
                                style={{ width: `${Math.min(100, (animatedValues.profit / 15000) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-3 backdrop-blur-sm border border-blue-500/30">
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4 text-blue-400" />
                              <span className="text-white text-xs">Trades</span>
                            </div>
                            <p className="text-white font-bold text-sm">
                              {Math.floor(animatedValues.trades).toLocaleString()}
                            </p>
                            <div className="w-full bg-blue-900/30 rounded-full h-1 mt-2">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1 rounded-full transition-all duration-1800"
                                style={{ width: `${Math.min(100, (animatedValues.trades / 1500) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium">
                            Buy
                          </button>
                          <button className="bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium backdrop-blur-sm">
                            Sell
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-20 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-30 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent block">
                Modern Trading
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of financial technology with our comprehensive suite of AI-powered tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI-Powered Analytics",
                description: "Advanced machine learning algorithms analyze market patterns and provide intelligent trading insights.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Advanced Security",
                description: "Bank-level security with multi-factor authentication and encrypted data transmission.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Execute trades in milliseconds with our high-frequency trading infrastructure.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Social Trading",
                description: "Follow and copy successful traders automatically. Learn from the community.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Advanced Analytics",
                description: "Comprehensive portfolio analytics and performance tracking with detailed insights.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Markets",
                description: "Access to global markets including stocks, crypto, forex, and commodities.",
                gradient: "from-teal-500 to-blue-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300",
                    feature.gradient
                  )}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <Crown className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent block">
                Trading Journey?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who've discovered the power of AI-driven trading. 
              Start your free trial today and experience the future of finance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleWatchDemo}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              KAIRO
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 KAIRO. All rights reserved. The future of finance technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ModernLanding;