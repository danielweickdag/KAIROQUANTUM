'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play, 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Settings, 
  Bell, 
  Target, 
  Layers, 
  Monitor, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Wifi, 
  Database
} from 'lucide-react';

// Interfaces
interface WorkflowMetrics {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  lastExecution: Date;
  elementsCreated: number;
  elementsModified: number;
  elementsDeleted: number;
  errorCount: number;
  performanceScore: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeWorkflows: number;
  totalExecutions: number;
  errorRate: number;
  uptime: number;
}

interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  timestamp: Date;
  duration: number;
  status: 'success' | 'error' | 'warning';
  elementsAffected: number;
  errorMessage?: string;
  details: Record<string, any>;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  workflowId?: string;
  acknowledged: boolean;
}

interface PerformanceData {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  executionsPerSecond: number;
  errorRate: number;
}

const DivWorkflowMonitoring: React.FC = () => {
  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetrics[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize monitoring data
  useEffect(() => {
    initializeMonitoringData();
    if (autoRefresh) {
      startRealTimeMonitoring();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  const initializeMonitoringData = () => {
    // Initialize workflow metrics
    const mockWorkflowMetrics: WorkflowMetrics[] = [
      {
        id: 'responsive-grid',
        name: 'Responsive Grid Layout',
        status: 'running',
        executionCount: 1247,
        successRate: 98.5,
        averageExecutionTime: 145,
        lastExecution: new Date(Date.now() - 2 * 60 * 1000),
        elementsCreated: 3421,
        elementsModified: 892,
        elementsDeleted: 156,
        errorCount: 18,
        performanceScore: 94
      },
      {
        id: 'card-component',
        name: 'Card Component Styling',
        status: 'running',
        executionCount: 892,
        successRate: 99.2,
        averageExecutionTime: 89,
        lastExecution: new Date(Date.now() - 5 * 60 * 1000),
        elementsCreated: 2156,
        elementsModified: 445,
        elementsDeleted: 23,
        errorCount: 7,
        performanceScore: 97
      },
      {
        id: 'typography-scale',
        name: 'Typography Scale',
        status: 'paused',
        executionCount: 567,
        successRate: 96.8,
        averageExecutionTime: 234,
        lastExecution: new Date(Date.now() - 30 * 60 * 1000),
        elementsCreated: 1234,
        elementsModified: 678,
        elementsDeleted: 89,
        errorCount: 18,
        performanceScore: 89
      },
      {
        id: 'animation-workflow',
        name: 'Animation Workflow',
        status: 'error',
        executionCount: 234,
        successRate: 87.3,
        averageExecutionTime: 456,
        lastExecution: new Date(Date.now() - 15 * 60 * 1000),
        elementsCreated: 567,
        elementsModified: 234,
        elementsDeleted: 45,
        errorCount: 30,
        performanceScore: 72
      }
    ];

    // Initialize system metrics
    const mockSystemMetrics: SystemMetrics = {
      cpuUsage: 34.5,
      memoryUsage: 67.8,
      diskUsage: 45.2,
      networkLatency: 23,
      activeWorkflows: 3,
      totalExecutions: 2940,
      errorRate: 1.8,
      uptime: 99.97
    };

    // Initialize execution logs
    const mockExecutionLogs: ExecutionLog[] = Array.from({ length: 50 }, (_, i) => ({
      id: `log-${i}`,
      workflowId: mockWorkflowMetrics[i % mockWorkflowMetrics.length].id,
      workflowName: mockWorkflowMetrics[i % mockWorkflowMetrics.length].name,
      timestamp: new Date(Date.now() - i * 2 * 60 * 1000),
      duration: Math.floor(Math.random() * 500) + 50,
      status: Math.random() > 0.1 ? 'success' : Math.random() > 0.5 ? 'warning' : 'error',
      elementsAffected: Math.floor(Math.random() * 10) + 1,
      errorMessage: Math.random() > 0.8 ? 'Timeout error in element creation' : undefined,
      details: {
        elementsCreated: Math.floor(Math.random() * 5),
        elementsModified: Math.floor(Math.random() * 3),
        elementsDeleted: Math.floor(Math.random() * 2)
      }
    }));

    // Initialize alerts
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        type: 'error',
        title: 'Workflow Execution Failed',
        message: 'Animation Workflow failed due to timeout error',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        workflowId: 'animation-workflow',
        acknowledged: false
      },
      {
        id: 'alert-2',
        type: 'warning',
        title: 'High Memory Usage',
        message: 'System memory usage is above 65%',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        acknowledged: false
      },
      {
        id: 'alert-3',
        type: 'info',
        title: 'Workflow Paused',
        message: 'Typography Scale workflow was paused by user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        workflowId: 'typography-scale',
        acknowledged: true
      }
    ];

    // Initialize performance data
    const mockPerformanceData: PerformanceData[] = Array.from({ length: 60 }, (_, i) => ({
      timestamp: new Date(Date.now() - (59 - i) * 60 * 1000),
      cpuUsage: Math.random() * 40 + 20,
      memoryUsage: Math.random() * 30 + 50,
      executionsPerSecond: Math.random() * 10 + 2,
      errorRate: Math.random() * 3
    }));

    setWorkflowMetrics(mockWorkflowMetrics);
    setSystemMetrics(mockSystemMetrics);
    setExecutionLogs(mockExecutionLogs);
    setAlerts(mockAlerts);
    setPerformanceData(mockPerformanceData);
  };

  const startRealTimeMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      // Simulate real-time updates
      setSystemMetrics(prev => prev ? {
        ...prev,
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(0, prev.networkLatency + (Math.random() - 0.5) * 10),
        totalExecutions: prev.totalExecutions + Math.floor(Math.random() * 3)
      } : null);

      // Add new performance data point
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          timestamp: new Date(),
          cpuUsage: Math.random() * 40 + 20,
          memoryUsage: Math.random() * 30 + 50,
          executionsPerSecond: Math.random() * 10 + 2,
          errorRate: Math.random() * 3
        });
        return newData;
      });

      // Occasionally add new execution logs
      if (Math.random() > 0.7) {
        const newLog: ExecutionLog = {
          id: `log-${Date.now()}`,
          workflowId: 'responsive-grid',
          workflowName: 'Responsive Grid Layout',
          timestamp: new Date(),
          duration: Math.floor(Math.random() * 300) + 50,
          status: Math.random() > 0.1 ? 'success' : 'error',
          elementsAffected: Math.floor(Math.random() * 5) + 1,
          details: {
            elementsCreated: Math.floor(Math.random() * 3),
            elementsModified: Math.floor(Math.random() * 2)
          }
        };

        setExecutionLogs(prev => [newLog, ...prev.slice(0, 49)]);
      }
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'stopped': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filteredWorkflows = workflowMetrics.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = executionLogs.filter(log => {
    const matchesSearch = log.workflowName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflow Monitoring</h1>
          <p className="text-gray-600">Real-time monitoring and analytics for div workflows</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label>Auto-refresh</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isMonitoring}
              onCheckedChange={setIsMonitoring}
            />
            <Label>Monitoring</Label>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* System Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CPU Usage</p>
                  <p className="text-2xl font-bold">{systemMetrics.cpuUsage.toFixed(1)}%</p>
                </div>
                <Cpu className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${systemMetrics.cpuUsage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Memory Usage</p>
                  <p className="text-2xl font-bold">{systemMetrics.memoryUsage.toFixed(1)}%</p>
                </div>
                <MemoryStick className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Workflows</p>
                  <p className="text-2xl font-bold">{systemMetrics.activeWorkflows}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+2 from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Error Rate</p>
                  <p className="text-2xl font-bold">{systemMetrics.errorRate.toFixed(1)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">-0.3% from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Workflow Status</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="stopped">Stopped</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(workflow.status)}
                        <div>
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <p className="text-sm text-gray-600">
                            Last execution: {formatTimeAgo(workflow.lastExecution)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                          {workflow.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{workflow.successRate.toFixed(1)}% success</p>
                          <p className="text-xs text-gray-600">{workflow.executionCount} executions</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Avg. Duration</p>
                        <p className="font-medium">{formatDuration(workflow.averageExecutionTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Elements Created</p>
                        <p className="font-medium">{workflow.elementsCreated.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Elements Modified</p>
                        <p className="font-medium">{workflow.elementsModified.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Performance Score</p>
                        <p className="font-medium">{workflow.performanceScore}/100</p>
                      </div>
                    </div>

                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          workflow.performanceScore >= 90 ? 'bg-green-500' :
                          workflow.performanceScore >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${workflow.performanceScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>Recent workflow execution history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="font-medium">{log.workflowName}</p>
                        <p className="text-sm text-gray-600">
                          {formatTimeAgo(log.timestamp)} • {formatDuration(log.duration)} • {log.elementsAffected} elements
                        </p>
                        {log.errorMessage && (
                          <p className="text-sm text-red-600">{log.errorMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={log.status === 'success' ? 'default' : log.status === 'warning' ? 'secondary' : 'destructive'}>
                        {log.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Notifications and warnings from workflow executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 border rounded-lg ${
                      alert.acknowledged ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimeAgo(alert.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}>
                          {alert.type}
                        </Badge>
                        {!alert.acknowledged && (
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>System performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Performance chart would be rendered here</p>
                    <p className="text-sm text-gray-500">CPU, Memory, and Execution metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Statistics</CardTitle>
                <CardDescription>Execution statistics by workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowMetrics.slice(0, 4).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-gray-600">{workflow.executionCount} executions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{workflow.successRate.toFixed(1)}%</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${workflow.successRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Real-time Activity</CardTitle>
                <CardDescription>Live workflow execution activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <Activity className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Real-time activity feed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DivWorkflowMonitoring;