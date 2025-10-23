'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Copy, 
  Download, 
  Upload, 
  Settings, 
  Activity, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Layers,
  Code,
  Palette,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { 
  divAutomationService, 
  DivElement, 
  AutomationRule, 
  GenerationTemplate, 
  AutomationMetrics,
  ExecutionContext 
} from '@/services/divAutomationService';

interface DivAutomationManagerProps {
  className?: string;
}

export default function DivAutomationManager({ className }: DivAutomationManagerProps) {
  const [elements, setElements] = useState<DivElement[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<GenerationTemplate[]>([]);
  const [metrics, setMetrics] = useState<AutomationMetrics | null>(null);
  const [selectedElement, setSelectedElement] = useState<DivElement | null>(null);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isCreatingElement, setIsCreatingElement] = useState(false);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);

  // Form states
  const [newElement, setNewElement] = useState<Partial<DivElement>>({
    type: 'container',
    name: '',
    tag: 'div',
    className: '',
    styles: {},
    content: '',
    isVisible: true,
    isLocked: false
  });

  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    trigger: { type: 'manual', config: {} },
    actions: [],
    isActive: true,
    priority: 1
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
    
    // Set up event listeners
    const handleElementCreated = () => loadData();
    const handleElementModified = () => loadData();
    const handleElementDeleted = () => loadData();
    const handleRuleExecuted = () => {
      loadData();
      setExecutionHistory(divAutomationService.getExecutionHistory(50));
    };

    divAutomationService.on('element:created', handleElementCreated);
    divAutomationService.on('element:modified', handleElementModified);
    divAutomationService.on('element:deleted', handleElementDeleted);
    divAutomationService.on('rule:executed', handleRuleExecuted);

    return () => {
      divAutomationService.off('element:created', handleElementCreated);
      divAutomationService.off('element:modified', handleElementModified);
      divAutomationService.off('element:deleted', handleElementDeleted);
      divAutomationService.off('rule:executed', handleRuleExecuted);
    };
  }, []);

  const loadData = useCallback(() => {
    setElements(divAutomationService.getAllElements());
    setRules(divAutomationService.getAllRules());
    setTemplates(divAutomationService.getAllTemplates());
    setMetrics(divAutomationService.getMetrics());
    setExecutionHistory(divAutomationService.getExecutionHistory(50));
  }, []);

  const handleCreateElement = () => {
    if (!newElement.name) return;

    const context: ExecutionContext = {
      workflowId: 'manual-creation',
      timestamp: new Date(),
      user: 'current-user',
      variables: {}
    };

    divAutomationService.createElement(newElement, context);
    setNewElement({
      type: 'container',
      name: '',
      tag: 'div',
      className: '',
      styles: {},
      content: '',
      isVisible: true,
      isLocked: false
    });
    setIsCreatingElement(false);
  };

  const handleCreateFromTemplate = (templateId: string, variables: Record<string, any> = {}) => {
    const context: ExecutionContext = {
      workflowId: 'template-creation',
      timestamp: new Date(),
      user: 'current-user',
      variables
    };

    divAutomationService.createFromTemplate(templateId, variables, context);
  };

  const handleDeleteElement = (id: string) => {
    const context: ExecutionContext = {
      workflowId: 'manual-deletion',
      timestamp: new Date(),
      user: 'current-user',
      variables: {}
    };

    divAutomationService.deleteElement(id, context);
  };

  const handleCloneElement = (id: string) => {
    const context: ExecutionContext = {
      workflowId: 'manual-clone',
      timestamp: new Date(),
      user: 'current-user',
      variables: {}
    };

    divAutomationService.cloneElement(id, context);
  };

  const handleExecuteRule = async (ruleId: string) => {
    const context: ExecutionContext = {
      workflowId: 'manual-execution',
      timestamp: new Date(),
      user: 'current-user',
      variables: {}
    };

    await divAutomationService.executeRule(ruleId, context);
  };

  const handleCreateRule = () => {
    if (!newRule.name) return;

    divAutomationService.addRule(newRule as Omit<AutomationRule, 'id'>);
    setNewRule({
      name: '',
      description: '',
      trigger: { type: 'manual', config: {} },
      actions: [],
      isActive: true,
      priority: 1
    });
    setIsCreatingRule(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Div Automation Manager</h2>
          <p className="text-muted-foreground">
            Automate div element creation, management, and styling workflows
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Elements</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalElements}</div>
              <p className="text-xs text-muted-foreground">
                +{metrics.elementsCreated} created today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automation Runs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.automationRuns}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.successRate.toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageExecutionTime.toFixed(0)}ms</div>
              <p className="text-xs text-muted-foreground">
                {metrics.errorCount} errors total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Execution</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.lastExecution ? 
                  new Date(metrics.lastExecution).toLocaleTimeString() : 
                  'Never'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.elementsModified} modifications
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="elements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>

        {/* Elements Tab */}
        <TabsContent value="elements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Div Elements</h3>
            <Button onClick={() => setIsCreatingElement(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Element
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Elements List */}
            <div className="lg:col-span-2">
              <div className="h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {elements.map((element) => (
                    <Card key={element.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedElement(element)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={element.type === 'container' ? 'default' : 'secondary'}>
                              {element.type}
                            </Badge>
                            <Badge variant="outline">{element.tag}</Badge>
                            {!element.isVisible && <Badge variant="destructive">Hidden</Badge>}
                            {element.isLocked && <Badge variant="secondary">Locked</Badge>}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleCloneElement(element.id);
                            }}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteElement(element.id);
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-base">{element.name}</CardTitle>
                        <CardDescription>
                          Created {element.metadata.createdAt.toLocaleDateString()} by {element.metadata.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {element.className && (
                            <div className="text-sm">
                              <span className="font-medium">Classes:</span> {element.className}
                            </div>
                          )}
                          {element.content && (
                            <div className="text-sm">
                              <span className="font-medium">Content:</span> {element.content.substring(0, 50)}...
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>v{element.metadata.version}</span>
                            <span>{element.children.length} children</span>
                            <span>Updated {element.metadata.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Element Details */}
            <div>
              {selectedElement ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>{selectedElement.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Element Type</Label>
                      <p className="text-sm text-muted-foreground">{selectedElement.type}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">HTML Tag</Label>
                      <p className="text-sm text-muted-foreground">{selectedElement.tag}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">CSS Classes</Label>
                      <p className="text-sm text-muted-foreground break-all">
                        {selectedElement.className || 'None'}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Inline Styles</Label>
                      <div className="text-sm text-muted-foreground">
                        {Object.keys(selectedElement.styles).length > 0 ? (
                          <pre className="text-xs bg-muted p-2 rounded">
                            {JSON.stringify(selectedElement.styles, null, 2)}
                          </pre>
                        ) : (
                          'None'
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Responsive Styles</Label>
                      <div className="space-y-2">
                        {(['mobile', 'tablet', 'desktop'] as const).map((device) => (
                          <div key={device} className="flex items-center space-x-2">
                            {getDeviceIcon(device)}
                            <span className="text-sm">
                              {Object.keys(selectedElement.responsive[device]).length} styles
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Palette className="h-4 w-4 mr-2" />
                        Style
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Select an element to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Create Element Modal */}
          {isCreatingElement && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Create New Element</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="element-name">Name</Label>
                    <Input
                      id="element-name"
                      value={newElement.name || ''}
                      onChange={(e) => setNewElement({ ...newElement, name: e.target.value })}
                      placeholder="Element name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="element-type">Type</Label>
                    <Select value={newElement.type} onValueChange={(value) => 
                      setNewElement({ ...newElement, type: value as DivElement['type'] })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="container">Container</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="layout">Layout</SelectItem>
                        <SelectItem value="component">Component</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="element-tag">HTML Tag</Label>
                    <Select value={newElement.tag} onValueChange={(value) => 
                      setNewElement({ ...newElement, tag: value as DivElement['tag'] })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="div">div</SelectItem>
                        <SelectItem value="section">section</SelectItem>
                        <SelectItem value="article">article</SelectItem>
                        <SelectItem value="aside">aside</SelectItem>
                        <SelectItem value="header">header</SelectItem>
                        <SelectItem value="footer">footer</SelectItem>
                        <SelectItem value="main">main</SelectItem>
                        <SelectItem value="nav">nav</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="element-className">CSS Classes</Label>
                    <Input
                      id="element-className"
                      value={newElement.className || ''}
                      onChange={(e) => setNewElement({ ...newElement, className: e.target.value })}
                      placeholder="CSS classes"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="element-content">Content</Label>
                  <Textarea
                    id="element-content"
                    value={newElement.content || ''}
                    onChange={(e) => setNewElement({ ...newElement, content: e.target.value })}
                    placeholder="Element content"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newElement.isVisible}
                      onCheckedChange={(checked) => setNewElement({ ...newElement, isVisible: checked })}
                    />
                    <Label>Visible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newElement.isLocked}
                      onCheckedChange={(checked) => setNewElement({ ...newElement, isLocked: checked })}
                    />
                    <Label>Locked</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={handleCreateElement}>Create Element</Button>
                  <Button variant="outline" onClick={() => setIsCreatingElement(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Automation Rules</h3>
            <Button onClick={() => setIsCreatingRule(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExecuteRule(rule.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base">{rule.name}</CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Trigger:</span> {rule.trigger.type}
                    </div>
                    <div>
                      <span className="font-medium">Actions:</span> {rule.actions.length}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> {rule.priority}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Element Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleCreateFromTemplate(template.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Variables:</span> {template.variables.length}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable) => (
                        <Badge key={variable.name} variant="secondary" className="text-xs">
                          {variable.name}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.variables.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-semibold">Execution History</h3>
          
          <div className="h-[500px] overflow-y-auto">
            <div className="space-y-2">
              {executionHistory.map((execution) => (
                <Card key={execution.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(execution.status)}
                        <div>
                          <p className="font-medium">Rule: {execution.ruleId}</p>
                          <p className="text-sm text-muted-foreground">
                            {execution.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{execution.duration}ms</p>
                        <Badge variant={execution.status === 'success' ? 'default' : 'destructive'}>
                          {execution.status}
                        </Badge>
                      </div>
                    </div>
                    {execution.error && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                        {execution.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}