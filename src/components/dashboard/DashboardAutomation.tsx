'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  Clock, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap,
  RefreshCw
} from 'lucide-react';
import pageAutomationService, { PageAutomation, AutomationExecution } from '@/services/pageAutomationService';

interface DashboardAutomationProps {
  onAutomationChange?: (isActive: boolean) => void;
}

export default function DashboardAutomation({ onAutomationChange }: DashboardAutomationProps) {
  const [automations, setAutomations] = useState<PageAutomation[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAutomation, setSelectedAutomation] = useState<string>('');

  // Dashboard-specific automation configurations
  const dashboardAutomations = [
    {
      id: 'welcome-flow',
      name: 'Welcome Flow',
      description: 'Guide new users through dashboard features',
      category: 'onboarding',
      isActive: true,
      triggers: ['page_load'],
      actions: ['show_welcome_modal', 'highlight_features']
    },
    {
      id: 'auto-refresh',
      name: 'Auto Data Refresh',
      description: 'Automatically refresh portfolio and market data',
      category: 'data',
      isActive: true,
      triggers: ['time_based'],
      actions: ['refresh_portfolio', 'update_market_data']
    },
    {
      id: 'performance-alerts',
      name: 'Performance Alerts',
      description: 'Alert users about significant portfolio changes',
      category: 'alerts',
      isActive: false,
      triggers: ['data_change'],
      actions: ['show_notification', 'highlight_change']
    },
    {
      id: 'quick-actions',
      name: 'Quick Actions',
      description: 'Enable one-click trading and portfolio actions',
      category: 'trading',
      isActive: false,
      triggers: ['user_action'],
      actions: ['execute_trade', 'rebalance_portfolio']
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      description: 'Automatically generate and display AI trading insights',
      category: 'ai',
      isActive: true,
      triggers: ['data_change', 'time_based'],
      actions: ['generate_insights', 'update_recommendations']
    }
  ];

  useEffect(() => {
    initializeAutomations();
    setupEventListeners();
    
    return () => {
      pageAutomationService.removeAllListeners();
    };
  }, []);

  const initializeAutomations = async () => {
    try {
      // Get existing dashboard automations
      const existingAutomations = pageAutomationService.getAutomationsForPage('/dashboard');
      setAutomations(existingAutomations);
      
      // Get recent executions
      const recentExecutions = pageAutomationService.getExecutions()
        .filter(e => e.pageRoute === '/dashboard')
        .slice(0, 10);
      setExecutions(recentExecutions);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize dashboard automations:', error);
      setIsLoading(false);
    }
  };

  const setupEventListeners = () => {
    pageAutomationService.on('automation:created', handleAutomationUpdate);
    pageAutomationService.on('automation:updated', handleAutomationUpdate);
    pageAutomationService.on('execution:completed', handleExecutionUpdate);
    pageAutomationService.on('execution:failed', handleExecutionUpdate);
  };

  const handleAutomationUpdate = () => {
    const updatedAutomations = pageAutomationService.getAutomationsForPage('/dashboard');
    setAutomations(updatedAutomations);
  };

  const handleExecutionUpdate = (execution: AutomationExecution) => {
    if (execution.pageRoute === '/dashboard') {
      setExecutions(prev => [execution, ...prev.slice(0, 9)]);
    }
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      pageAutomationService.updateAutomation(automationId, { isActive });
      
      // Notify parent component
      if (onAutomationChange) {
        const activeCount = automations.filter(a => a.isActive).length;
        onAutomationChange(activeCount > 0);
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const executeAutomation = async (automationId: string) => {
    try {
      await pageAutomationService.executeAutomation(automationId, {
        source: 'manual',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to execute automation:', error);
    }
  };

  const createNewAutomation = () => {
    const newAutomation = {
      pageRoute: '/dashboard',
      name: 'Custom Dashboard Automation',
      description: 'User-created automation for dashboard',
      isActive: false,
      triggers: [{
        id: 'custom-trigger',
        type: 'page_load' as const,
        isActive: true
      }],
      actions: [{
        id: 'custom-action',
        type: 'notification' as const,
        value: 'Custom automation executed'
      }]
    };

    pageAutomationService.createAutomation(newAutomation);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding':
        return <Target className="h-4 w-4" />;
      case 'data':
        return <BarChart3 className="h-4 w-4" />;
      case 'alerts':
        return <AlertTriangle className="h-4 w-4" />;
      case 'trading':
        return <TrendingUp className="h-4 w-4" />;
      case 'ai':
        return <Bot className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading automations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Dashboard Automation
            </CardTitle>
            <CardDescription>
              Automate your dashboard experience with intelligent workflows
            </CardDescription>
          </div>
          <Button onClick={createNewAutomation} size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value="automations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="executions">Recent Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="automations" className="space-y-4">
            <div className="grid gap-4">
              {automations.map((automation) => (
                <Card key={automation.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon('data')}
                        <div>
                          <h4 className="font-medium">{automation.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {automation.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={automation.isActive ? 'default' : 'secondary'}>
                          {automation.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={automation.isActive}
                          onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executeAutomation(automation.id)}
                          disabled={!automation.isActive}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Executions: {automation.executionCount}</span>
                      <span>Success Rate: {automation.successRate.toFixed(1)}%</span>
                      {automation.lastExecuted && (
                        <span>Last: {automation.lastExecuted.toLocaleTimeString()}</span>
                      )}
                    </div>
                    
                    {automation.isActive && (
                      <Progress 
                        value={automation.successRate} 
                        className="mt-2 h-2"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="executions" className="space-y-4">
            <div className="space-y-2">
              {executions.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent automation activity</p>
                  </CardContent>
                </Card>
              ) : (
                executions.map((execution) => (
                  <Card key={execution.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(execution.status)}
                          <div>
                            <h4 className="font-medium">
                              {automations.find(a => a.id === execution.automationId)?.name || 'Unknown'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Triggered by {execution.triggeredBy} • {execution.startTime.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={execution.status === 'completed' ? 'default' : 'destructive'}>
                            {execution.status}
                          </Badge>
                          {execution.duration && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {execution.duration}ms
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {execution.results.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Actions:</p>
                          <div className="flex flex-wrap gap-1">
                            {execution.results.map((result, index) => (
                              <Badge 
                                key={index} 
                                variant={result.status === 'success' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {result.actionId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Global Automation</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable all dashboard automations
                    </p>
                  </div>
                  <Switch
                    checked={automations.some(a => a.isActive)}
                    onCheckedChange={(checked) => {
                      automations.forEach(automation => {
                        toggleAutomation(automation.id, checked);
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-refresh Interval</h4>
                    <p className="text-sm text-muted-foreground">
                      How often to refresh dashboard data
                    </p>
                  </div>
                  <select className="px-3 py-1 border rounded">
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Smart Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Intelligent alerts based on portfolio changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">AI Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate trading recommendations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}