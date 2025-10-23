'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  TestTube, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Code, 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  RefreshCw, 
  Target, 
  Zap, 
  Eye, 
  Bug, 
  Shield, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  Filter, 
  Search
} from 'lucide-react';

// Interfaces
interface TestCase {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'visual' | 'accessibility' | 'performance';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  lastRun?: Date;
  assertions: TestAssertion[];
  code: string;
  errorMessage?: string;
  coverage?: number;
}

interface TestAssertion {
  id: string;
  description: string;
  type: 'exists' | 'visible' | 'contains' | 'style' | 'attribute' | 'accessibility';
  selector: string;
  expected: any;
  actual?: any;
  passed?: boolean;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  testCases: TestCase[];
  isActive: boolean;
  autoRun: boolean;
  schedule?: string;
  lastRun?: Date;
  passRate: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

interface TestExecution {
  id: string;
  suiteId: string;
  suiteName: string;
  timestamp: Date;
  duration: number;
  status: 'passed' | 'failed' | 'partial';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  coverage: number;
  results: TestResult[];
}

interface TestResult {
  testCaseId: string;
  testCaseName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  assertions: AssertionResult[];
  errorMessage?: string;
  screenshot?: string;
}

interface AssertionResult {
  assertionId: string;
  description: string;
  passed: boolean;
  expected: any;
  actual: any;
  errorMessage?: string;
}

interface TestTemplate {
  id: string;
  name: string;
  description: string;
  category: 'responsive' | 'accessibility' | 'performance' | 'visual' | 'functional';
  template: string;
  variables: Record<string, any>;
}

const DivTestingWorkflows: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [testExecutions, setTestExecutions] = useState<TestExecution[]>([]);
  const [testTemplates, setTestTemplates] = useState<TestTemplate[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRun, setAutoRun] = useState(true);

  // Initialize test data
  useEffect(() => {
    initializeTestData();
  }, []);

  const initializeTestData = () => {
    // Initialize test templates
    const mockTemplates: TestTemplate[] = [
      {
        id: 'responsive-test',
        name: 'Responsive Layout Test',
        description: 'Tests div responsiveness across different screen sizes',
        category: 'responsive',
        template: `
describe('Responsive Layout Test', () => {
  test('should adapt to mobile viewport', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    const element = await page.locator('{{selector}}');
    await expect(element).toBeVisible();
    await expect(element).toHaveCSS('display', '{{mobileDisplay}}');
  });

  test('should adapt to tablet viewport', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const element = await page.locator('{{selector}}');
    await expect(element).toHaveCSS('grid-template-columns', '{{tabletColumns}}');
  });

  test('should adapt to desktop viewport', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const element = await page.locator('{{selector}}');
    await expect(element).toHaveCSS('grid-template-columns', '{{desktopColumns}}');
  });
});`,
        variables: {
          selector: '.responsive-grid',
          mobileDisplay: 'block',
          tabletColumns: 'repeat(2, 1fr)',
          desktopColumns: 'repeat(3, 1fr)'
        }
      },
      {
        id: 'accessibility-test',
        name: 'Accessibility Test',
        description: 'Tests div accessibility compliance',
        category: 'accessibility',
        template: `
describe('Accessibility Test', () => {
  test('should have proper ARIA attributes', async () => {
    const element = await page.locator('{{selector}}');
    await expect(element).toHaveAttribute('role', '{{expectedRole}}');
    await expect(element).toHaveAttribute('aria-label');
  });

  test('should be keyboard navigable', async () => {
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('tabindex', '0');
  });

  test('should meet color contrast requirements', async () => {
    const element = await page.locator('{{selector}}');
    const contrast = await element.evaluate((el) => {
      // Color contrast calculation logic
      return 4.5; // Mock contrast ratio
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});`,
        variables: {
          selector: '.card-component',
          expectedRole: 'article'
        }
      },
      {
        id: 'performance-test',
        name: 'Performance Test',
        description: 'Tests div rendering and interaction performance',
        category: 'performance',
        template: `
describe('Performance Test', () => {
  test('should render within performance budget', async () => {
    const startTime = performance.now();
    await page.locator('{{selector}}').waitFor();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan({{maxRenderTime}});
  });

  test('should handle large datasets efficiently', async () => {
    await page.evaluate(() => {
      // Simulate adding many elements
      const container = document.querySelector('{{selector}}');
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.textContent = \`Item \${i}\`;
        container?.appendChild(div);
      }
    });
    
    const element = await page.locator('{{selector}}');
    await expect(element).toBeVisible();
  });
});`,
        variables: {
          selector: '.performance-container',
          maxRenderTime: 100
        }
      }
    ];

    // Initialize test cases
    const mockTestCases: TestCase[] = [
      {
        id: 'test-1',
        name: 'Grid Layout Visibility',
        description: 'Tests if grid layout is visible and properly structured',
        type: 'unit',
        status: 'passed',
        duration: 145,
        lastRun: new Date(Date.now() - 5 * 60 * 1000),
        assertions: [
          {
            id: 'assert-1',
            description: 'Grid container should be visible',
            type: 'visible',
            selector: '.responsive-grid',
            expected: true,
            actual: true,
            passed: true
          },
          {
            id: 'assert-2',
            description: 'Grid should have correct display property',
            type: 'style',
            selector: '.responsive-grid',
            expected: 'grid',
            actual: 'grid',
            passed: true
          }
        ],
        code: `test('Grid Layout Visibility', async () => {
  const grid = await page.locator('.responsive-grid');
  await expect(grid).toBeVisible();
  await expect(grid).toHaveCSS('display', 'grid');
});`,
        coverage: 95
      },
      {
        id: 'test-2',
        name: 'Responsive Breakpoints',
        description: 'Tests responsive behavior at different screen sizes',
        type: 'integration',
        status: 'failed',
        duration: 234,
        lastRun: new Date(Date.now() - 10 * 60 * 1000),
        assertions: [
          {
            id: 'assert-3',
            description: 'Mobile layout should show single column',
            type: 'style',
            selector: '.responsive-grid',
            expected: '1fr',
            actual: 'repeat(2, 1fr)',
            passed: false
          }
        ],
        code: `test('Responsive Breakpoints', async () => {
  await page.setViewportSize({ width: 375, height: 667 });
  const grid = await page.locator('.responsive-grid');
  await expect(grid).toHaveCSS('grid-template-columns', '1fr');
});`,
        errorMessage: 'Expected single column layout on mobile, but got 2 columns',
        coverage: 78
      },
      {
        id: 'test-3',
        name: 'Card Hover Effects',
        description: 'Tests card component hover interactions',
        type: 'visual',
        status: 'passed',
        duration: 89,
        lastRun: new Date(Date.now() - 2 * 60 * 1000),
        assertions: [
          {
            id: 'assert-4',
            description: 'Card should have hover shadow effect',
            type: 'style',
            selector: '.card-component:hover',
            expected: '0 10px 25px rgba(0,0,0,0.15)',
            actual: '0 10px 25px rgba(0,0,0,0.15)',
            passed: true
          }
        ],
        code: `test('Card Hover Effects', async () => {
  const card = await page.locator('.card-component');
  await card.hover();
  await expect(card).toHaveCSS('box-shadow', '0 10px 25px rgba(0,0,0,0.15)');
});`,
        coverage: 92
      },
      {
        id: 'test-4',
        name: 'Accessibility Compliance',
        description: 'Tests ARIA attributes and keyboard navigation',
        type: 'accessibility',
        status: 'pending',
        assertions: [
          {
            id: 'assert-5',
            description: 'Elements should have proper ARIA roles',
            type: 'attribute',
            selector: '[role]',
            expected: 'article',
            actual: undefined,
            passed: false
          }
        ],
        code: `test('Accessibility Compliance', async () => {
  const elements = await page.locator('[role="article"]');
  await expect(elements).toHaveCount(3);
});`,
        coverage: 0
      }
    ];

    // Initialize test suites
    const mockTestSuites: TestSuite[] = [
      {
        id: 'suite-1',
        name: 'Responsive Grid Tests',
        description: 'Comprehensive tests for responsive grid layout workflow',
        workflowId: 'responsive-grid',
        testCases: mockTestCases.filter(t => ['test-1', 'test-2'].includes(t.id)),
        isActive: true,
        autoRun: true,
        schedule: '0 */6 * * *', // Every 6 hours
        lastRun: new Date(Date.now() - 30 * 60 * 1000),
        passRate: 75,
        totalTests: 2,
        passedTests: 1,
        failedTests: 1
      },
      {
        id: 'suite-2',
        name: 'Card Component Tests',
        description: 'Visual and interaction tests for card components',
        workflowId: 'card-component',
        testCases: mockTestCases.filter(t => ['test-3', 'test-4'].includes(t.id)),
        isActive: true,
        autoRun: false,
        lastRun: new Date(Date.now() - 2 * 60 * 1000),
        passRate: 50,
        totalTests: 2,
        passedTests: 1,
        failedTests: 0
      }
    ];

    // Initialize test executions
    const mockExecutions: TestExecution[] = [
      {
        id: 'exec-1',
        suiteId: 'suite-1',
        suiteName: 'Responsive Grid Tests',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        duration: 1234,
        status: 'partial',
        totalTests: 2,
        passedTests: 1,
        failedTests: 1,
        skippedTests: 0,
        coverage: 86.5,
        results: [
          {
            testCaseId: 'test-1',
            testCaseName: 'Grid Layout Visibility',
            status: 'passed',
            duration: 145,
            assertions: mockTestCases[0].assertions.map(a => ({
              assertionId: a.id,
              description: a.description,
              passed: a.passed || false,
              expected: a.expected,
              actual: a.actual
            }))
          },
          {
            testCaseId: 'test-2',
            testCaseName: 'Responsive Breakpoints',
            status: 'failed',
            duration: 234,
            assertions: mockTestCases[1].assertions.map(a => ({
              assertionId: a.id,
              description: a.description,
              passed: a.passed || false,
              expected: a.expected,
              actual: a.actual
            })),
            errorMessage: 'Expected single column layout on mobile, but got 2 columns'
          }
        ]
      }
    ];

    setTestTemplates(mockTemplates);
    setTestSuites(mockTestSuites);
    setSelectedSuite(mockTestSuites[0]);
    setTestExecutions(mockExecutions);
  };

  const runTestSuite = async (suite: TestSuite) => {
    setIsRunning(true);
    
    // Simulate test execution
    const startTime = Date.now();
    
    // Update test cases to running status
    const updatedSuite = {
      ...suite,
      testCases: suite.testCases.map(tc => ({ ...tc, status: 'running' as const }))
    };
    setSelectedSuite(updatedSuite);
    
    // Simulate test execution delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate test results
    const results = suite.testCases.map(testCase => {
      const passed = Math.random() > 0.3; // 70% pass rate
      return {
        ...testCase,
        status: passed ? 'passed' as const : 'failed' as const,
        duration: Math.floor(Math.random() * 500) + 50,
        lastRun: new Date()
      };
    });
    
    const passedCount = results.filter(r => r.status === 'passed').length;
    const failedCount = results.filter(r => r.status === 'failed').length;
    
    const finalSuite = {
      ...suite,
      testCases: results,
      lastRun: new Date(),
      passRate: (passedCount / results.length) * 100,
      passedTests: passedCount,
      failedTests: failedCount
    };
    
    // Create execution record
    const execution: TestExecution = {
      id: `exec-${Date.now()}`,
      suiteId: suite.id,
      suiteName: suite.name,
      timestamp: new Date(),
      duration: Date.now() - startTime,
      status: failedCount === 0 ? 'passed' : passedCount > 0 ? 'partial' : 'failed',
      totalTests: results.length,
      passedTests: passedCount,
      failedTests: failedCount,
      skippedTests: 0,
      coverage: Math.floor(Math.random() * 20) + 80,
      results: results.map(r => ({
        testCaseId: r.id,
        testCaseName: r.name,
        status: r.status,
        duration: r.duration || 0,
        assertions: r.assertions.map(a => ({
          assertionId: a.id,
          description: a.description,
          passed: a.passed || false,
          expected: a.expected,
          actual: a.actual
        })),
        errorMessage: r.errorMessage
      }))
    };
    
    setTestExecutions(prev => [execution, ...prev]);
    setSelectedSuite(finalSuite);
    setTestSuites(prev => prev.map(s => s.id === suite.id ? finalSuite : s));
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unit': return <TestTube className="w-4 h-4" />;
      case 'integration': return <Layers className="w-4 h-4" />;
      case 'visual': return <Eye className="w-4 h-4" />;
      case 'accessibility': return <Shield className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
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
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filteredTestCases = selectedSuite?.testCases.filter(testCase => {
    const matchesSearch = testCase.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || testCase.type === filterType;
    const matchesStatus = filterStatus === 'all' || testCase.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automated Testing Workflows</h1>
          <p className="text-gray-600">Automated testing for div components and workflows</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoRun}
              onCheckedChange={setAutoRun}
            />
            <Label>Auto-run</Label>
          </div>
          <Button 
            onClick={() => selectedSuite && runTestSuite(selectedSuite)}
            disabled={isRunning}
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Tests'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Test Suites Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                Test Suites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testSuites.map((suite) => (
                  <div
                    key={suite.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSuite?.id === suite.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSuite(suite)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{suite.name}</h3>
                      <Badge variant={suite.isActive ? 'default' : 'secondary'}>
                        {suite.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{suite.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{suite.totalTests} tests</span>
                      <span className={`font-medium ${
                        suite.passRate >= 90 ? 'text-green-600' :
                        suite.passRate >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {suite.passRate.toFixed(0)}% pass
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          suite.passRate >= 90 ? 'bg-green-500' :
                          suite.passRate >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${suite.passRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedSuite && (
            <Tabs value="tests" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tests">Test Cases</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Test Cases Tab */}
              <TabsContent value="tests">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Test Cases</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Search tests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-48"
                          />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="unit">Unit</SelectItem>
                            <SelectItem value="integration">Integration</SelectItem>
                            <SelectItem value="visual">Visual</SelectItem>
                            <SelectItem value="accessibility">Accessibility</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="passed">Passed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTestCases.map((testCase) => (
                        <div 
                          key={testCase.id} 
                          className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                          onClick={() => setSelectedTestCase(testCase)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(testCase.status)}
                              {getTypeIcon(testCase.type)}
                              <div>
                                <h3 className="font-semibold">{testCase.name}</h3>
                                <p className="text-sm text-gray-600">{testCase.description}</p>
                                {testCase.lastRun && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Last run: {formatTimeAgo(testCase.lastRun)} • {formatDuration(testCase.duration || 0)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <Badge variant={testCase.type === 'unit' ? 'default' : 'secondary'}>
                                {testCase.type}
                              </Badge>
                              <Badge variant={
                                testCase.status === 'passed' ? 'default' :
                                testCase.status === 'failed' ? 'destructive' :
                                'secondary'
                              }>
                                {testCase.status}
                              </Badge>
                              {testCase.coverage !== undefined && (
                                <div className="text-right">
                                  <p className="text-sm font-medium">{testCase.coverage}%</p>
                                  <p className="text-xs text-gray-600">coverage</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {testCase.errorMessage && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              <Bug className="w-4 h-4 inline mr-1" />
                              {testCase.errorMessage}
                            </div>
                          )}
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Assertions</p>
                              <p className="font-medium">{testCase.assertions.length}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Passed</p>
                              <p className="font-medium text-green-600">
                                {testCase.assertions.filter(a => a.passed).length}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Failed</p>
                              <p className="font-medium text-red-600">
                                {testCase.assertions.filter(a => !a.passed).length}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Execution Results</CardTitle>
                    <CardDescription>Recent test execution history and results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testExecutions.map((execution) => (
                        <div key={execution.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(execution.status)}
                              <div>
                                <h3 className="font-semibold">{execution.suiteName}</h3>
                                <p className="text-sm text-gray-600">
                                  {formatTimeAgo(execution.timestamp)} • {formatDuration(execution.duration)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <Badge variant={execution.status === 'passed' ? 'default' : execution.status === 'partial' ? 'secondary' : 'destructive'}>
                                {execution.status}
                              </Badge>
                              <div className="text-right">
                                <p className="text-sm font-medium">{execution.coverage}%</p>
                                <p className="text-xs text-gray-600">coverage</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Tests</p>
                              <p className="font-medium">{execution.totalTests}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Passed</p>
                              <p className="font-medium text-green-600">{execution.passedTests}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Failed</p>
                              <p className="font-medium text-red-600">{execution.failedTests}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Skipped</p>
                              <p className="font-medium text-yellow-600">{execution.skippedTests}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(execution.passedTests / execution.totalTests) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Templates</CardTitle>
                    <CardDescription>Pre-built test templates for common scenarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testTemplates.map((template) => (
                        <div key={template.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(template.category)}
                              <h3 className="font-semibold">{template.name}</h3>
                            </div>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Code className="w-4 h-4 mr-1" />
                              Use Template
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Suite Settings</CardTitle>
                    <CardDescription>Configure test execution and automation settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Suite Name</Label>
                          <Input value={selectedSuite.name} />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea value={selectedSuite.description} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={selectedSuite.isActive} />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={selectedSuite.autoRun} />
                          <Label>Auto-run on workflow changes</Label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Schedule (Cron)</Label>
                          <Input value={selectedSuite.schedule || ''} placeholder="0 */6 * * *" />
                        </div>
                        <div>
                          <Label>Timeout (seconds)</Label>
                          <Input type="number" defaultValue="300" />
                        </div>
                        <div>
                          <Label>Retry Attempts</Label>
                          <Input type="number" defaultValue="3" />
                        </div>
                        <div>
                          <Label>Browser</Label>
                          <Select defaultValue="chromium">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chromium">Chromium</SelectItem>
                              <SelectItem value="firefox">Firefox</SelectItem>
                              <SelectItem value="webkit">WebKit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button>Save Settings</Button>
                      <Button variant="outline">Reset to Defaults</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default DivTestingWorkflows;