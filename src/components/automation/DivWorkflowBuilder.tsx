'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Removed react-beautiful-dnd dependency - using simple reordering buttons instead
import {
  Box,
  Layout,
  Layers,
  Settings,
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Code,
  Palette,
  Grid,
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Bot,
  Workflow,
  Target,
  Timer,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Move,
  RotateCcw,
  Maximize,
  Minimize,
  Lock,
  Activity
} from 'lucide-react';

interface DivElement {
  id: string;
  type: 'container' | 'content' | 'layout' | 'component';
  name: string;
  tag: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'form';
  className: string;
  styles: {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderRadius?: string;
    border?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    zIndex?: string;
  };
  content?: string;
  children: DivElement[];
  isVisible: boolean;
  isLocked: boolean;
  responsive: {
    mobile: Partial<DivElement['styles']>;
    tablet: Partial<DivElement['styles']>;
    desktop: Partial<DivElement['styles']>;
  };
}

interface WorkflowStep {
  id: string;
  type: 'create' | 'modify' | 'style' | 'animate' | 'condition' | 'loop' | 'delay';
  name: string;
  description: string;
  config: {
    elementId?: string;
    elementType?: string;
    properties?: Record<string, any>;
    condition?: string;
    duration?: number;
    iterations?: number;
    delay?: number;
  };
  isActive: boolean;
  order: number;
}

interface DivWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  steps: WorkflowStep[];
  triggers: {
    type: 'manual' | 'timer' | 'event' | 'condition';
    config: Record<string, any>;
  }[];
  elements: DivElement[];
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
}

const defaultDivElement: DivElement = {
  id: '',
  type: 'container',
  name: 'New Div',
  tag: 'div',
  className: '',
  styles: {
    width: '100%',
    height: 'auto',
    padding: '16px',
    margin: '0',
    backgroundColor: 'transparent',
    display: 'block'
  },
  children: [],
  isVisible: true,
  isLocked: false,
  responsive: {
    mobile: {},
    tablet: {},
    desktop: {}
  }
};

const workflowStepTypes = [
  {
    type: 'create',
    name: 'Create Element',
    description: 'Create a new div element',
    icon: <Plus className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  {
    type: 'modify',
    name: 'Modify Element',
    description: 'Modify existing element properties',
    icon: <Settings className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  {
    type: 'style',
    name: 'Apply Styles',
    description: 'Apply CSS styles to element',
    icon: <Palette className="h-4 w-4" />,
    color: 'bg-purple-500'
  },
  {
    type: 'animate',
    name: 'Animate Element',
    description: 'Add animations to element',
    icon: <Zap className="h-4 w-4" />,
    color: 'bg-yellow-500'
  },
  {
    type: 'condition',
    name: 'Conditional Logic',
    description: 'Add conditional execution',
    icon: <Target className="h-4 w-4" />,
    color: 'bg-orange-500'
  },
  {
    type: 'loop',
    name: 'Loop Action',
    description: 'Repeat actions multiple times',
    icon: <RefreshCw className="h-4 w-4" />,
    color: 'bg-indigo-500'
  },
  {
    type: 'delay',
    name: 'Add Delay',
    description: 'Wait before next action',
    icon: <Timer className="h-4 w-4" />,
    color: 'bg-gray-500'
  }
];

export default function DivWorkflowBuilder() {
  const [workflows, setWorkflows] = useState<DivWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<DivWorkflow | null>(null);
  const [selectedElement, setSelectedElement] = useState<DivElement | null>(null);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const createNewWorkflow = useCallback(() => {
    const newWorkflow: DivWorkflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Div Workflow',
      description: 'Automated div element workflow',
      isActive: true,
      steps: [],
      triggers: [{
        type: 'manual',
        config: {}
      }],
      elements: [],
      createdAt: new Date(),
      executionCount: 0,
      successRate: 100
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  }, []);

  const createNewElement = useCallback(() => {
    if (!selectedWorkflow) return;

    const newElement: DivElement = {
      ...defaultDivElement,
      id: `element-${Date.now()}`,
      name: `Element ${selectedWorkflow.elements.length + 1}`
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      elements: [...selectedWorkflow.elements, newElement]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    setSelectedElement(newElement);
  }, [selectedWorkflow]);

  const addWorkflowStep = useCallback((stepType: string) => {
    if (!selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type: stepType as WorkflowStep['type'],
      name: workflowStepTypes.find(t => t.type === stepType)?.name || 'New Step',
      description: workflowStepTypes.find(t => t.type === stepType)?.description || '',
      config: {},
      isActive: true,
      order: selectedWorkflow.steps.length
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
  }, [selectedWorkflow]);

  const executeWorkflow = useCallback(async () => {
    if (!selectedWorkflow || isExecuting) return;

    setIsExecuting(true);
    setExecutionLog([]);

    try {
      for (const step of selectedWorkflow.steps) {
        if (!step.isActive) continue;

        setExecutionLog(prev => [...prev, `Executing: ${step.name}`]);
        
        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, step.config.delay || 500));

        switch (step.type) {
          case 'create':
            setExecutionLog(prev => [...prev, `✓ Created element: ${step.config.elementType || 'div'}`]);
            break;
          case 'modify':
            setExecutionLog(prev => [...prev, `✓ Modified element properties`]);
            break;
          case 'style':
            setExecutionLog(prev => [...prev, `✓ Applied styles to element`]);
            break;
          case 'animate':
            setExecutionLog(prev => [...prev, `✓ Added animation to element`]);
            break;
          case 'condition':
            setExecutionLog(prev => [...prev, `✓ Evaluated condition: ${step.config.condition || 'true'}`]);
            break;
          case 'loop':
            setExecutionLog(prev => [...prev, `✓ Executed loop ${step.config.iterations || 1} times`]);
            break;
          case 'delay':
            setExecutionLog(prev => [...prev, `✓ Waited ${step.config.duration || 1000}ms`]);
            break;
        }
      }

      setExecutionLog(prev => [...prev, '🎉 Workflow execution completed successfully']);
      
      // Update workflow stats
      const updatedWorkflow = {
        ...selectedWorkflow,
        lastExecuted: new Date(),
        executionCount: selectedWorkflow.executionCount + 1
      };
      setSelectedWorkflow(updatedWorkflow);
      setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));

    } catch (error) {
      setExecutionLog(prev => [...prev, `❌ Error: ${error}`]);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedWorkflow, isExecuting]);

  const moveStep = useCallback((stepId: string, direction: 'up' | 'down') => {
    if (!selectedWorkflow) return;

    const steps = [...selectedWorkflow.steps].sort((a, b) => a.order - b.order);
    const currentIndex = steps.findIndex(step => step.id === stepId);
    
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === steps.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedStep] = steps.splice(currentIndex, 1);
    steps.splice(newIndex, 0, movedStep);

    // Update order property
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      order: index
    }));

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
  }, [selectedWorkflow]);

  const renderElement = (element: DivElement, depth = 0) => {
    const styles = {
      ...element.styles,
      ...(activeDevice === 'mobile' ? element.responsive.mobile : {}),
      ...(activeDevice === 'tablet' ? element.responsive.tablet : {}),
      ...(activeDevice === 'desktop' ? element.responsive.desktop : {})
    } as React.CSSProperties;

    return (
      <div
        key={element.id}
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 p-2 m-1 cursor-pointer transition-all hover:border-blue-500 ${
          selectedElement?.id === element.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        style={styles}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {element.name} ({element.tag})
          </span>
          <div className="flex items-center space-x-1">
            {element.isVisible ? (
              <Eye className="h-3 w-3 text-green-500" />
            ) : (
              <EyeOff className="h-3 w-3 text-gray-400" />
            )}
            {element.isLocked && <Lock className="h-3 w-3 text-orange-500" />}
          </div>
        </div>
        {element.content && (
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {element.content}
          </div>
        )}
        {element.children.map(child => renderElement(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Div Workflow Builder
              </h1>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Automated
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={activeDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveDevice('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={activeDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveDevice('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={activeDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveDevice('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={executeWorkflow}
              disabled={!selectedWorkflow || isExecuting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <Tabs defaultValue="workflows" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="flex-1 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Workflows</h3>
                <Button size="sm" onClick={createNewWorkflow}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              
              <div className="space-y-2">
                {workflows.map(workflow => (
                  <Card
                    key={workflow.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedWorkflow?.id === workflow.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{workflow.name}</h4>
                        <Badge variant={workflow.isActive ? 'default' : 'secondary'} className="text-xs">
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {workflow.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{workflow.steps.length} steps</span>
                        <span>{workflow.elements.length} elements</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="elements" className="flex-1 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Elements</h3>
                <Button size="sm" onClick={createNewElement} disabled={!selectedWorkflow}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {selectedElement && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Element Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="element-name" className="text-xs">Name</Label>
                      <Input
                        id="element-name"
                        value={selectedElement.name}
                        onChange={(e) => {
                          const updated = { ...selectedElement, name: e.target.value };
                          setSelectedElement(updated);
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="element-tag" className="text-xs">Tag</Label>
                      <Select
                        value={selectedElement.tag}
                        onValueChange={(value) => {
                          const updated = { ...selectedElement, tag: value as DivElement['tag'] };
                          setSelectedElement(updated);
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
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
                          <SelectItem value="form">form</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="element-class" className="text-xs">CSS Classes</Label>
                      <Input
                        id="element-class"
                        value={selectedElement.className}
                        onChange={(e) => {
                          const updated = { ...selectedElement, className: e.target.value };
                          setSelectedElement(updated);
                        }}
                        className="h-8 text-xs"
                        placeholder="class1 class2 class3"
                      />
                    </div>

                    <div>
                      <Label htmlFor="element-content" className="text-xs">Content</Label>
                      <Textarea
                        id="element-content"
                        value={selectedElement.content || ''}
                        onChange={(e) => {
                          const updated = { ...selectedElement, content: e.target.value };
                          setSelectedElement(updated);
                        }}
                        className="h-16 text-xs resize-none"
                        placeholder="Element content..."
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedElement.isVisible}
                          onCheckedChange={(checked) => {
                            const updated = { ...selectedElement, isVisible: checked };
                            setSelectedElement(updated);
                          }}
                        />
                        <Label className="text-xs">Visible</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedElement.isLocked}
                          onCheckedChange={(checked) => {
                            const updated = { ...selectedElement, isLocked: checked };
                            setSelectedElement(updated);
                          }}
                        />
                        <Label className="text-xs">Locked</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="steps" className="flex-1 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Workflow Steps</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {workflowStepTypes.map(stepType => (
                  <Button
                    key={stepType.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addWorkflowStep(stepType.type)}
                    disabled={!selectedWorkflow}
                    className="h-auto p-2 flex flex-col items-center space-y-1"
                  >
                    <div className={`p-1 rounded ${stepType.color} text-white`}>
                      {stepType.icon}
                    </div>
                    <span className="text-xs font-medium">{stepType.name}</span>
                  </Button>
                ))}
              </div>

              {selectedWorkflow && selectedWorkflow.steps.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Step Sequence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedWorkflow.steps
                        .sort((a, b) => a.order - b.order)
                        .map((step, index) => (
                          <div
                            key={step.id}
                            className={`p-2 bg-gray-50 dark:bg-gray-700 rounded border ${
                              selectedStep?.id === step.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedStep(step)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex flex-col space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveStep(step.id, 'up');
                                    }}
                                    disabled={index === 0}
                                    className="h-4 w-4 p-0"
                                  >
                                    <ArrowUp className="h-2 w-2" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveStep(step.id, 'down');
                                    }}
                                    disabled={index === selectedWorkflow.steps.length - 1}
                                    className="h-4 w-4 p-0"
                                  >
                                    <ArrowDown className="h-2 w-2" />
                                  </Button>
                                </div>
                                <span className="text-xs font-medium">{step.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Switch
                                  checked={step.isActive}
                                  onCheckedChange={(checked) => {
                                    const updatedSteps = selectedWorkflow.steps.map(s =>
                                      s.id === step.id ? { ...s, isActive: checked } : s
                                    );
                                    const updatedWorkflow = { ...selectedWorkflow, steps: updatedSteps };
                                    setSelectedWorkflow(updatedWorkflow);
                                    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
                                  }}
                                  className="scale-75"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedSteps = selectedWorkflow.steps.filter(s => s.id !== step.id);
                                    const updatedWorkflow = { ...selectedWorkflow, steps: updatedSteps };
                                    setSelectedWorkflow(updatedWorkflow);
                                    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {step.description}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {selectedWorkflow ? selectedWorkflow.name : 'Select a workflow'}
                </h2>
                {selectedWorkflow && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedWorkflow.description}
                  </p>
                )}
              </div>
              
              {selectedWorkflow && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Layers className="h-4 w-4" />
                    <span>{selectedWorkflow.elements.length} elements</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Workflow className="h-4 w-4" />
                    <span>{selectedWorkflow.steps.length} steps</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{selectedWorkflow.executionCount} executions</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 p-4 overflow-auto">
            {selectedWorkflow ? (
              <div className="h-full">
                {isPreviewMode ? (
                  <div
                    ref={canvasRef}
                    className={`h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 ${
                      activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                      activeDevice === 'tablet' ? 'max-w-2xl mx-auto' :
                      'w-full'
                    }`}
                  >
                    {selectedWorkflow.elements.length > 0 ? (
                      selectedWorkflow.elements.map(element => renderElement(element))
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No elements yet</p>
                          <p className="text-sm">Add elements to see the preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Visual Canvas */}
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                          <Layout className="h-4 w-4 mr-2" />
                          Visual Canvas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div
                          className={`h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 ${
                            activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                            activeDevice === 'tablet' ? 'max-w-md mx-auto' :
                            'w-full'
                          }`}
                          onClick={() => setSelectedElement(null)}
                        >
                          {selectedWorkflow.elements.length > 0 ? (
                            selectedWorkflow.elements.map(element => renderElement(element))
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <div className="text-center">
                                <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Canvas is empty</p>
                                <p className="text-sm">Add elements to start building</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Execution Log */}
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Execution Log
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div className="h-full bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto">
                          {executionLog.length > 0 ? (
                            executionLog.map((log, index) => (
                              <div key={index} className="mb-1">
                                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500">
                              Execution log will appear here...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Welcome to Div Workflow Builder</h3>
                  <p className="mb-4">Create automated workflows for div element generation and management</p>
                  <Button onClick={createNewWorkflow}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Workflow
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}