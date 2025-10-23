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
  Layout, 
  Grid, 
  Zap, 
  Target, 
  Workflow, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Settings, 
  Eye, 
  Code, 
  Copy, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Activity,
  Layers
} from 'lucide-react';
import { divAutomationService, GenerationTemplate, AutomationRule, ExecutionContext } from '@/services/divAutomationService';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'component' | 'responsive' | 'animation' | 'utility';
  icon: React.ReactNode;
  complexity: 'simple' | 'intermediate' | 'advanced';
  estimatedTime: string;
  rules: Omit<AutomationRule, 'id'>[];
  templates: Omit<GenerationTemplate, 'id'>[];
  variables: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'color';
    default: any;
    options?: string[];
    description: string;
    required: boolean;
  }[];
  preview: string;
  tags: string[];
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'responsive-grid-layout',
    name: 'Responsive Grid Layout',
    description: 'Automatically generates a responsive grid layout with customizable columns and breakpoints',
    category: 'layout',
    icon: <Grid className="h-5 w-5" />,
    complexity: 'simple',
    estimatedTime: '2-3 minutes',
    variables: [
      { name: 'columns', type: 'number', default: 3, description: 'Number of columns', required: true },
      { name: 'gap', type: 'select', default: '1rem', options: ['0.5rem', '1rem', '1.5rem', '2rem'], description: 'Grid gap', required: true },
      { name: 'containerName', type: 'string', default: 'Grid Container', description: 'Container name', required: true },
      { name: 'itemCount', type: 'number', default: 6, description: 'Number of grid items', required: true },
      { name: 'autoFit', type: 'boolean', default: true, description: 'Auto-fit columns', required: false }
    ],
    rules: [
      {
        name: 'Create Grid Container',
        description: 'Creates the main grid container with responsive classes',
        trigger: { type: 'manual', config: {} },
        actions: [
          {
            id: 'create-grid-container',
            type: 'create',
            config: {
              type: 'layout',
              name: '{{containerName}}',
              tag: 'div',
              className: 'grid grid-cols-1 md:grid-cols-{{columns}} gap-{{gap}} w-full',
              styles: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                 gap: '1rem'
              },
              responsive: {
                mobile: { gridTemplateColumns: '1fr' },
                tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
                desktop: { gridTemplateColumns: 'repeat({{columns}}, 1fr)' }
              }
            }
          }
        ],
        isActive: true,
        priority: 1
      },
      {
        name: 'Generate Grid Items',
        description: 'Creates grid items with placeholder content',
        trigger: { type: 'event', config: { event: 'element:created', elementType: 'layout' } },
        actions: [
          {
            id: 'create-grid-items',
            type: 'create',
            config: {
              type: 'component',
              name: 'Grid Item {{index}}',
              tag: 'div',
              className: 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow',
              content: '<h3 class="text-lg font-semibold mb-2">Item {{index}}</h3><p class="text-gray-600 dark:text-gray-300">Grid item content goes here.</p>',
              styles: {
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }
            }
          }
        ],
        isActive: true,
        priority: 2
      }
    ],
    templates: [
      {
        name: 'Grid Container Template',
        description: 'Responsive grid container with customizable columns',
        category: 'layout',
        template: {
          id: '',
          type: 'layout',
          name: '{{containerName}}',
          tag: 'div',
          className: 'grid gap-{{gap}} w-full',
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat({{columns}}, 1fr)',
            gap: '{{gap}}'
          },
          children: [],
          isVisible: true,
          isLocked: false,
          responsive: {
            mobile: { gridTemplateColumns: '1fr' },
            tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
            desktop: { gridTemplateColumns: 'repeat({{columns}}, 1fr)' }
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            author: 'template',
            tags: ['grid', 'layout', 'responsive']
          }
        },
        variables: [
          { name: 'containerName', type: 'string', default: 'Grid Container', description: 'Container name' },
          { name: 'columns', type: 'number', default: 3, description: 'Number of columns' },
          { name: 'gap', type: 'size', default: '1rem', description: 'Grid gap' }
        ],
        preview: '<svg>...</svg>'
      }
    ],
    preview: `
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-blue-100 p-4 rounded">Item 1</div>
        <div class="bg-blue-100 p-4 rounded">Item 2</div>
        <div class="bg-blue-100 p-4 rounded">Item 3</div>
      </div>
    `,
    tags: ['grid', 'responsive', 'layout', 'css-grid']
  },
  {
    id: 'card-component-generator',
    name: 'Card Component Generator',
    description: 'Generates a set of consistent card components with various styles and content types',
    category: 'component',
    icon: <Layers className="h-5 w-5" />,
    complexity: 'intermediate',
    estimatedTime: '3-5 minutes',
    variables: [
      { name: 'cardCount', type: 'number', default: 4, description: 'Number of cards to generate', required: true },
      { name: 'cardStyle', type: 'select', default: 'modern', options: ['modern', 'classic', 'minimal', 'gradient'], description: 'Card style', required: true },
      { name: 'hasImage', type: 'boolean', default: true, description: 'Include image placeholder', required: false },
      { name: 'hasButton', type: 'boolean', default: true, description: 'Include action button', required: false },
      { name: 'shadowLevel', type: 'select', default: 'medium', options: ['none', 'small', 'medium', 'large'], description: 'Shadow level', required: true }
    ],
    rules: [
      {
        name: 'Generate Card Set',
        description: 'Creates a set of cards with consistent styling',
        trigger: { type: 'manual', config: {} },
        actions: [
          {
            id: 'create-card-container',
            type: 'create',
            config: {
              type: 'layout',
              name: 'Card Container',
              tag: 'div',
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6',
              styles: {
                display: 'grid',
                gap: '1.5rem',
                padding: '1.5rem'
              }
            }
          }
        ],
        isActive: true,
        priority: 1
      },
      {
        name: 'Style Cards Based on Theme',
        description: 'Applies styling based on selected card style',
        trigger: { type: 'event', config: { event: 'element:created', elementType: 'component' } },
        actions: [
          {
            id: 'apply-card-styling',
            type: 'style',
            config: {
              styles: {
                borderRadius: 'var(--card-border-radius)',
                boxShadow: 'var(--card-shadow)'
              }
            }
          }
        ],
        isActive: true,
        priority: 2
      }
    ],
    templates: [
      {
        name: 'Modern Card Template',
        description: 'Modern card with rounded corners and subtle shadow',
        category: 'component',
        template: {
          id: '',
          type: 'component',
          name: 'Modern Card {{index}}',
          tag: 'div',
          className: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300',
          styles: {
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease'
          },
          content: `
            <div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Card Title</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">This is a description for the card. It provides context and information about the card content.</p>
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">Learn More</button>
            </div>
          `,
          children: [],
          isVisible: true,
          isLocked: false,
          responsive: {
            mobile: { padding: '16px' },
            tablet: { padding: '20px' },
            desktop: { padding: '24px' }
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            author: 'template',
            tags: ['card', 'modern', 'component']
          }
        },
        variables: [
          { name: 'index', type: 'number', default: 1, description: 'Card index' },
          { name: 'hasImage', type: 'boolean', default: true, description: 'Include image' },
          { name: 'hasButton', type: 'boolean', default: true, description: 'Include button' }
        ],
        preview: '<svg>...</svg>'
      }
    ],
    preview: `
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl shadow-lg p-4">
          <div class="h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded mb-3"></div>
          <h3 class="font-bold">Card 1</h3>
          <p class="text-sm text-gray-600">Description</p>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-4">
          <div class="h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded mb-3"></div>
          <h3 class="font-bold">Card 2</h3>
          <p class="text-sm text-gray-600">Description</p>
        </div>
      </div>
    `,
    tags: ['cards', 'components', 'modern', 'responsive']
  },
  {
    id: 'responsive-navigation',
    name: 'Responsive Navigation',
    description: 'Creates a responsive navigation bar with mobile hamburger menu and dropdown support',
    category: 'component',
    icon: <Layout className="h-5 w-5" />,
    complexity: 'advanced',
    estimatedTime: '5-8 minutes',
    variables: [
      { name: 'brandName', type: 'string', default: 'Brand', description: 'Brand/logo name', required: true },
      { name: 'menuItems', type: 'number', default: 5, description: 'Number of menu items', required: true },
      { name: 'hasDropdown', type: 'boolean', default: true, description: 'Include dropdown menus', required: false },
      { name: 'navStyle', type: 'select', default: 'modern', options: ['modern', 'classic', 'minimal'], description: 'Navigation style', required: true },
      { name: 'position', type: 'select', default: 'sticky', options: ['static', 'sticky', 'fixed'], description: 'Navigation position', required: true }
    ],
    rules: [
      {
        name: 'Create Navigation Structure',
        description: 'Creates the main navigation structure with responsive behavior',
        trigger: { type: 'manual', config: {} },
        actions: [
          {
            id: 'create-nav-container',
            type: 'create',
            config: {
              type: 'component',
              name: 'Navigation Bar',
              tag: 'nav',
              className: 'bg-white dark:bg-gray-900 shadow-md {{position}} top-0 z-50 w-full',
              styles: {
                position: '{{position}}',
                top: '0',
                zIndex: '50',
                width: '100%'
              }
            }
          }
        ],
        isActive: true,
        priority: 1
      },
      {
        name: 'Add Mobile Responsiveness',
        description: 'Adds mobile hamburger menu and responsive behavior',
        trigger: { type: 'event', config: { event: 'element:created', elementType: 'component' } },
        actions: [
          {
            id: 'add-mobile-menu',
            type: 'modify',
            config: {
              responsive: {
                mobile: { 
                  flexDirection: 'column',
                  padding: '1rem'
                },
                tablet: { 
                  flexDirection: 'row',
                  padding: '1rem 2rem'
                },
                desktop: { 
                  flexDirection: 'row',
                  padding: '1rem 3rem'
                }
              }
            }
          }
        ],
        isActive: true,
        priority: 2
      }
    ],
    templates: [
      {
        name: 'Modern Navigation Template',
        description: 'Modern navigation with clean design and smooth animations',
        category: 'component',
        template: {
          id: '',
          type: 'component',
          name: 'Modern Navigation',
          tag: 'nav',
          className: 'bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50',
          styles: {
            position: 'sticky',
            top: '0',
            zIndex: '50'
          },
          content: `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                  <div class="text-xl font-bold text-gray-900 dark:text-white">{{brandName}}</div>
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <!-- Navigation items will be generated here -->
                  </div>
                </div>
                <div class="md:hidden">
                  <button class="text-gray-500 hover:text-gray-600 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `,
          children: [],
          isVisible: true,
          isLocked: false,
          responsive: {
            mobile: { padding: '1rem' },
            tablet: { padding: '1rem 2rem' },
            desktop: { padding: '1rem 3rem' }
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            author: 'template',
            tags: ['navigation', 'responsive', 'modern']
          }
        },
        variables: [
          { name: 'brandName', type: 'string', default: 'Brand', description: 'Brand name' }
        ],
        preview: '<svg>...</svg>'
      }
    ],
    preview: `
      <nav class="bg-white shadow-md">
        <div class="flex justify-between items-center p-4">
          <div class="font-bold">Brand</div>
          <div class="hidden md:flex space-x-4">
            <a href="#" class="text-gray-600">Home</a>
            <a href="#" class="text-gray-600">About</a>
            <a href="#" class="text-gray-600">Services</a>
            <a href="#" class="text-gray-600">Contact</a>
          </div>
          <div class="md:hidden">☰</div>
        </div>
      </nav>
    `,
    tags: ['navigation', 'responsive', 'mobile', 'hamburger']
  },
  {
    id: 'animation-workflow',
    name: 'CSS Animation Workflow',
    description: 'Automatically adds CSS animations and transitions to elements based on user interactions',
    category: 'animation',
    icon: <Zap className="h-5 w-5" />,
    complexity: 'intermediate',
    estimatedTime: '3-4 minutes',
    variables: [
      { name: 'animationType', type: 'select', default: 'fadeIn', options: ['fadeIn', 'slideIn', 'scaleIn', 'bounceIn', 'rotateIn'], description: 'Animation type', required: true },
      { name: 'duration', type: 'select', default: '0.3s', options: ['0.1s', '0.3s', '0.5s', '1s', '2s'], description: 'Animation duration', required: true },
      { name: 'easing', type: 'select', default: 'ease-out', options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'], description: 'Animation easing', required: true },
      { name: 'trigger', type: 'select', default: 'hover', options: ['hover', 'click', 'scroll', 'load'], description: 'Animation trigger', required: true },
      { name: 'delay', type: 'select', default: '0s', options: ['0s', '0.1s', '0.2s', '0.5s', '1s'], description: 'Animation delay', required: false }
    ],
    rules: [
      {
        name: 'Add Base Animation Classes',
        description: 'Adds base animation classes to elements',
        trigger: { type: 'manual', config: {} },
        actions: [
          {
            id: 'add-animation-classes',
            type: 'modify',
            config: {
              className: 'transition-all duration-{{duration}} {{easing}} animate-{{animationType}}',
              styles: {
                transition: 'all {{duration}} {{easing}}',
                animationDelay: '{{delay}}'
              }
            }
          }
        ],
        isActive: true,
        priority: 1
      },
      {
        name: 'Add Hover Effects',
        description: 'Adds hover effects based on animation type',
        trigger: { type: 'event', config: { event: 'element:modified' } },
        actions: [
          {
            id: 'add-hover-effects',
            type: 'modify',
            config: {
              className: 'hover:scale-105 hover:shadow-lg',
              styles: {
                cursor: 'pointer'
              }
            }
          }
        ],
        isActive: true,
        priority: 2,
        conditions: {
          type: 'and',
          rules: [
            { property: 'trigger', operator: 'equals', value: 'hover' }
          ]
        }
      }
    ],
    templates: [],
    preview: `
      <div class="space-y-4">
        <div class="bg-blue-500 text-white p-4 rounded transform transition-all duration-300 hover:scale-105">
          Hover Animation
        </div>
        <div class="bg-green-500 text-white p-4 rounded animate-pulse">
          Pulse Animation
        </div>
      </div>
    `,
    tags: ['animation', 'css', 'transitions', 'hover', 'effects']
  },
  {
    id: 'form-builder',
    name: 'Dynamic Form Builder',
    description: 'Generates forms with validation, styling, and responsive layout automatically',
    category: 'component',
    icon: <Code className="h-5 w-5" />,
    complexity: 'advanced',
    estimatedTime: '6-10 minutes',
    variables: [
      { name: 'formName', type: 'string', default: 'Contact Form', description: 'Form name', required: true },
      { name: 'fieldCount', type: 'number', default: 5, description: 'Number of form fields', required: true },
      { name: 'formStyle', type: 'select', default: 'modern', options: ['modern', 'classic', 'minimal'], description: 'Form styling', required: true },
      { name: 'hasValidation', type: 'boolean', default: true, description: 'Include validation', required: false },
      { name: 'layout', type: 'select', default: 'single-column', options: ['single-column', 'two-column', 'grid'], description: 'Form layout', required: true }
    ],
    rules: [
      {
        name: 'Create Form Structure',
        description: 'Creates the main form structure with proper semantics',
        trigger: { type: 'manual', config: {} },
        actions: [
          {
            id: 'create-form-container',
            type: 'create',
            config: {
              type: 'component',
              name: '{{formName}}',
              tag: 'form',
              className: 'max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg',
              styles: {
                maxWidth: '42rem',
                margin: '0 auto',
                padding: '1.5rem'
              }
            }
          }
        ],
        isActive: true,
        priority: 1
      },
      {
        name: 'Generate Form Fields',
        description: 'Generates form fields based on configuration',
        trigger: { type: 'event', config: { event: 'element:created', elementType: 'component' } },
        actions: [
          {
            id: 'create-form-fields',
            type: 'create',
            config: {
              type: 'content',
              name: 'Form Field {{index}}',
              tag: 'div',
              className: 'mb-4',
              content: `
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Field Label {{index}}
                </label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter value..."
                  {{hasValidation}} && 'required'
                />
                {{hasValidation}} && '<p class="mt-1 text-sm text-red-600 hidden">This field is required</p>'
              `
            }
          }
        ],
        isActive: true,
        priority: 2
      }
    ],
    templates: [
      {
        name: 'Modern Form Template',
        description: 'Modern form with clean styling and validation',
        category: 'component',
        template: {
          id: '',
          type: 'component',
          name: '{{formName}}',
          tag: 'form',
          className: 'max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg',
          styles: {
            maxWidth: '42rem',
            margin: '0 auto',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          },
          content: `
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{{formName}}</h2>
            <!-- Form fields will be generated here -->
            <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Submit
            </button>
          `,
          children: [],
          isVisible: true,
          isLocked: false,
          responsive: {
            mobile: { padding: '1rem' },
            tablet: { padding: '1.5rem' },
            desktop: { padding: '2rem' }
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            author: 'template',
            tags: ['form', 'modern', 'validation']
          }
        },
        variables: [
          { name: 'formName', type: 'string', default: 'Contact Form', description: 'Form name' }
        ],
        preview: '<svg>...</svg>'
      }
    ],
    preview: `
      <form class="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Contact Form</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Name</label>
          <input type="text" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Email</label>
          <input type="email" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <button class="w-full bg-blue-500 text-white py-2 rounded-md">Submit</button>
      </form>
    `,
    tags: ['form', 'validation', 'responsive', 'dynamic']
  }
];

interface DivWorkflowTemplatesProps {
  onTemplateSelect?: (template: WorkflowTemplate) => void;
  className?: string;
}

export default function DivWorkflowTemplates({ onTemplateSelect, className }: DivWorkflowTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterComplexity, setFilterComplexity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('browse');

  const filteredTemplates = workflowTemplates.filter(template => {
    if (filterCategory !== 'all' && template.category !== filterCategory) return false;
    if (filterComplexity !== 'all' && template.complexity !== filterComplexity) return false;
    return true;
  });

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    
    // Initialize variables with defaults
    const initialVariables: Record<string, any> = {};
    template.variables.forEach(variable => {
      initialVariables[variable.name] = variable.default;
    });
    setTemplateVariables(initialVariables);
    
    onTemplateSelect?.(template);
  };

  const handleVariableChange = (variableName: string, value: any) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  const executeTemplate = async () => {
    if (!selectedTemplate) return;

    setIsExecuting(true);
    
    try {
      const context: ExecutionContext = {
        workflowId: `template-${selectedTemplate.id}`,
        timestamp: new Date(),
        user: 'current-user',
        variables: templateVariables
      };

      // Add templates to the service
      for (const template of selectedTemplate.templates) {
        const templateId = `${selectedTemplate.id}-${template.name.toLowerCase().replace(/\s+/g, '-')}`;
        // Note: In a real implementation, you'd add these templates to the service
      }

      // Execute rules in sequence
      for (const rule of selectedTemplate.rules) {
        const ruleId = divAutomationService.addRule(rule);
        await divAutomationService.executeRule(ruleId, context);
      }

      console.log(`Template "${selectedTemplate.name}" executed successfully`);
    } catch (error) {
      console.error('Error executing template:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'layout':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'component':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'responsive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'animation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'utility':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workflow Templates</h2>
          <p className="text-muted-foreground">
            Pre-built automation workflows for common div patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Templates
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Templates
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="category-filter">Category:</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="layout">Layout</SelectItem>
              <SelectItem value="component">Component</SelectItem>
              <SelectItem value="responsive">Responsive</SelectItem>
              <SelectItem value="animation">Animation</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="complexity-filter">Complexity:</Label>
          <Select value={filterComplexity} onValueChange={setFilterComplexity}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-2">
          <div className="h-[700px] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {template.icon}
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated time:</span>
                        <span className="font-medium">{template.estimatedTime}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rules:</span>
                        <span className="font-medium">{template.rules.length}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Variables:</span>
                        <span className="font-medium">{template.variables.length}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Preview */}
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        <div dangerouslySetInnerHTML={{ __html: template.preview }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          </div>

        {/* Template Configuration */}
        <div>
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Workflow className="h-5 w-5" />
                  <span>Configure Template</span>
                </CardTitle>
                <CardDescription>
                  {selectedTemplate.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable.name}>
                        <Label htmlFor={variable.name} className="text-sm font-medium">
                          {variable.name}
                          {variable.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          {variable.description}
                        </p>
                        
                        {variable.type === 'string' && (
                          <Input
                            id={variable.name}
                            value={templateVariables[variable.name] || ''}
                            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                            placeholder={`Enter ${variable.name}`}
                          />
                        )}
                        
                        {variable.type === 'number' && (
                          <Input
                            id={variable.name}
                            type="number"
                            value={templateVariables[variable.name] || ''}
                            onChange={(e) => handleVariableChange(variable.name, parseInt(e.target.value))}
                            placeholder={`Enter ${variable.name}`}
                          />
                        )}
                        
                        {variable.type === 'boolean' && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={templateVariables[variable.name] || false}
                              onCheckedChange={(checked) => handleVariableChange(variable.name, checked)}
                            />
                            <Label>{variable.name}</Label>
                          </div>
                        )}
                        
                        {variable.type === 'select' && variable.options && (
                          <Select 
                            value={templateVariables[variable.name]} 
                            onValueChange={(value) => handleVariableChange(variable.name, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {variable.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        {variable.type === 'color' && (
                          <Input
                            id={variable.name}
                            type="color"
                            value={templateVariables[variable.name] || '#000000'}
                            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Button 
                    onClick={executeTemplate} 
                    disabled={isExecuting}
                    className="w-full"
                  >
                    {isExecuting ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute Template
                      </>
                    )}
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Clone
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a template to configure</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}