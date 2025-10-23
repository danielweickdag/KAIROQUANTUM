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
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Code, 
  Wand2, 
  Copy, 
  Download, 
  Upload, 
  Settings, 
  Eye, 
  Layers, 
  Grid, 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Zap,
  Sparkles,
  RefreshCw,
  Save,
  Play,
  Pause
} from 'lucide-react';

// Interfaces
interface StyleProperty {
  property: string;
  value: string;
  unit?: string;
  responsive?: boolean;
}

interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  styles: StyleProperty[];
}

interface StylingWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'typography' | 'colors' | 'spacing' | 'effects' | 'animations';
  baseStyles: StyleProperty[];
  responsiveBreakpoints: ResponsiveBreakpoint[];
  variables: Record<string, any>;
  isActive: boolean;
  autoGenerate: boolean;
  designSystem?: string;
}

interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'border';
}

interface GeneratedCSS {
  css: string;
  scss: string;
  tailwind: string;
  styledComponents: string;
}

const DivStylingWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<StylingWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<StylingWorkflow | null>(null);
  const [designTokens, setDesignTokens] = useState<DesignToken[]>([]);
  const [generatedCSS, setGeneratedCSS] = useState<GeneratedCSS | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [autoSync, setAutoSync] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize default workflows and design tokens
  useEffect(() => {
    initializeDefaultWorkflows();
    initializeDesignTokens();
  }, []);

  const initializeDefaultWorkflows = () => {
    const defaultWorkflows: StylingWorkflow[] = [
      {
        id: 'responsive-grid',
        name: 'Responsive Grid Layout',
        description: 'Automatically generates responsive grid layouts with breakpoints',
        category: 'layout',
        baseStyles: [
          { property: 'display', value: 'grid' },
          { property: 'gap', value: '1rem' },
          { property: 'grid-template-columns', value: 'repeat(auto-fit, minmax(300px, 1fr))' }
        ],
        responsiveBreakpoints: [
          {
            name: 'mobile',
            minWidth: 0,
            maxWidth: 768,
            styles: [
              { property: 'grid-template-columns', value: '1fr' },
              { property: 'gap', value: '0.5rem' }
            ]
          },
          {
            name: 'tablet',
            minWidth: 768,
            maxWidth: 1024,
            styles: [
              { property: 'grid-template-columns', value: 'repeat(2, 1fr)' },
              { property: 'gap', value: '0.75rem' }
            ]
          }
        ],
        variables: {
          columns: 3,
          gap: '1rem',
          minColumnWidth: '300px'
        },
        isActive: true,
        autoGenerate: true,
        designSystem: 'material'
      },
      {
        id: 'card-component',
        name: 'Card Component Styling',
        description: 'Generates consistent card styling with hover effects',
        category: 'effects',
        baseStyles: [
          { property: 'background', value: 'white' },
          { property: 'border-radius', value: '8px' },
          { property: 'box-shadow', value: '0 2px 4px rgba(0,0,0,0.1)' },
          { property: 'padding', value: '1.5rem' },
          { property: 'transition', value: 'all 0.3s ease' }
        ],
        responsiveBreakpoints: [
          {
            name: 'mobile',
            minWidth: 0,
            maxWidth: 768,
            styles: [
              { property: 'padding', value: '1rem' },
              { property: 'border-radius', value: '6px' }
            ]
          }
        ],
        variables: {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '1.5rem',
          shadowIntensity: 0.1
        },
        isActive: true,
        autoGenerate: true
      },
      {
        id: 'typography-scale',
        name: 'Typography Scale',
        description: 'Generates responsive typography with consistent scaling',
        category: 'typography',
        baseStyles: [
          { property: 'font-family', value: 'Inter, sans-serif' },
          { property: 'line-height', value: '1.6' },
          { property: 'color', value: '#333333' }
        ],
        responsiveBreakpoints: [
          {
            name: 'mobile',
            minWidth: 0,
            maxWidth: 768,
            styles: [
              { property: 'font-size', value: '0.875rem' },
              { property: 'line-height', value: '1.5' }
            ]
          },
          {
            name: 'desktop',
            minWidth: 768,
            styles: [
              { property: 'font-size', value: '1rem' },
              { property: 'line-height', value: '1.6' }
            ]
          }
        ],
        variables: {
          baseFontSize: '1rem',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.6,
          color: '#333333'
        },
        isActive: true,
        autoGenerate: true
      }
    ];

    setWorkflows(defaultWorkflows);
    setSelectedWorkflow(defaultWorkflows[0]);
  };

  const initializeDesignTokens = () => {
    const tokens: DesignToken[] = [
      // Colors
      { name: 'primary-500', value: '#3B82F6', category: 'color' },
      { name: 'secondary-500', value: '#6B7280', category: 'color' },
      { name: 'success-500', value: '#10B981', category: 'color' },
      { name: 'warning-500', value: '#F59E0B', category: 'color' },
      { name: 'error-500', value: '#EF4444', category: 'color' },
      
      // Spacing
      { name: 'space-xs', value: '0.25rem', category: 'spacing' },
      { name: 'space-sm', value: '0.5rem', category: 'spacing' },
      { name: 'space-md', value: '1rem', category: 'spacing' },
      { name: 'space-lg', value: '1.5rem', category: 'spacing' },
      { name: 'space-xl', value: '2rem', category: 'spacing' },
      
      // Typography
      { name: 'text-xs', value: '0.75rem', category: 'typography' },
      { name: 'text-sm', value: '0.875rem', category: 'typography' },
      { name: 'text-base', value: '1rem', category: 'typography' },
      { name: 'text-lg', value: '1.125rem', category: 'typography' },
      { name: 'text-xl', value: '1.25rem', category: 'typography' },
      
      // Shadows
      { name: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)', category: 'shadow' },
      { name: 'shadow-md', value: '0 4px 6px rgba(0,0,0,0.1)', category: 'shadow' },
      { name: 'shadow-lg', value: '0 10px 15px rgba(0,0,0,0.1)', category: 'shadow' },
      
      // Borders
      { name: 'border-sm', value: '1px', category: 'border' },
      { name: 'border-md', value: '2px', category: 'border' },
      { name: 'radius-sm', value: '0.25rem', category: 'border' },
      { name: 'radius-md', value: '0.5rem', category: 'border' },
      { name: 'radius-lg', value: '0.75rem', category: 'border' }
    ];

    setDesignTokens(tokens);
  };

  const generateCSS = async (workflow: StylingWorkflow) => {
    setIsGenerating(true);
    
    // Simulate CSS generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseCSS = workflow.baseStyles
      .map(style => `  ${style.property}: ${style.value};`)
      .join('\n');
    
    const responsiveCSS = workflow.responsiveBreakpoints
      .map(breakpoint => {
        const styles = breakpoint.styles
          .map(style => `    ${style.property}: ${style.value};`)
          .join('\n');
        
        if (breakpoint.maxWidth) {
          return `@media (min-width: ${breakpoint.minWidth}px) and (max-width: ${breakpoint.maxWidth}px) {\n  .${workflow.id} {\n${styles}\n  }\n}`;
        } else {
          return `@media (min-width: ${breakpoint.minWidth}px) {\n  .${workflow.id} {\n${styles}\n  }\n}`;
        }
      })
      .join('\n\n');

    const css = `.${workflow.id} {\n${baseCSS}\n}\n\n${responsiveCSS}`;
    
    const scss = `$${workflow.id}-variables: (\n${Object.entries(workflow.variables)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join(',\n')}\n);\n\n.${workflow.id} {\n${baseCSS}\n}\n\n${responsiveCSS}`;
    
    const tailwind = `<!-- Tailwind classes for ${workflow.name} -->\n<div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">\n  <!-- Content -->\n</div>`;
    
    const styledComponents = `import styled from 'styled-components';\n\nconst ${workflow.name.replace(/\s+/g, '')} = styled.div\`\n${baseCSS}\n\n  @media (min-width: 768px) {\n    /* Tablet styles */\n  }\n\n  @media (min-width: 1024px) {\n    /* Desktop styles */\n  }\n\`;\n\nexport default ${workflow.name.replace(/\s+/g, '')};`;

    setGeneratedCSS({
      css,
      scss,
      tailwind,
      styledComponents
    });
    
    setIsGenerating(false);
  };

  const handleWorkflowUpdate = (updatedWorkflow: StylingWorkflow) => {
    setWorkflows(prev => 
      prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w)
    );
    setSelectedWorkflow(updatedWorkflow);
    
    if (autoSync && updatedWorkflow.autoGenerate) {
      generateCSS(updatedWorkflow);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'layout': return <Grid className="w-4 h-4" />;
      case 'typography': return <Type className="w-4 h-4" />;
      case 'colors': return <Palette className="w-4 h-4" />;
      case 'spacing': return <Square className="w-4 h-4" />;
      case 'effects': return <Sparkles className="w-4 h-4" />;
      case 'animations': return <Zap className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getPreviewIcon = (mode: string) => {
    switch (mode) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Div Styling Workflows</h1>
          <p className="text-gray-600">Automate responsive design and styling for div elements</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
            <Label>Auto-sync</Label>
          </div>
          <Button onClick={() => selectedWorkflow && generateCSS(selectedWorkflow)}>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate CSS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Styling Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWorkflow?.id === workflow.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(workflow.category)}
                        <div>
                          <h3 className="font-medium text-sm">{workflow.name}</h3>
                          <p className="text-xs text-gray-600">{workflow.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {workflow.autoGenerate && (
                          <Badge variant="outline" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedWorkflow && (
            <Tabs defaultValue="configuration" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="responsive">Responsive</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              {/* Configuration Tab */}
              <TabsContent value="configuration">
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Configuration</CardTitle>
                    <CardDescription>
                      Configure base styles and variables for {selectedWorkflow.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Base Styles */}
                    <div>
                      <Label className="text-sm font-medium">Base Styles</Label>
                      <div className="mt-2 space-y-2">
                        {selectedWorkflow.baseStyles.map((style, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              placeholder="Property"
                              value={style.property}
                              className="flex-1"
                              onChange={(e) => {
                                const updatedStyles = [...selectedWorkflow.baseStyles];
                                updatedStyles[index].property = e.target.value;
                                handleWorkflowUpdate({
                                  ...selectedWorkflow,
                                  baseStyles: updatedStyles
                                });
                              }}
                            />
                            <Input
                              placeholder="Value"
                              value={style.value}
                              className="flex-1"
                              onChange={(e) => {
                                const updatedStyles = [...selectedWorkflow.baseStyles];
                                updatedStyles[index].value = e.target.value;
                                handleWorkflowUpdate({
                                  ...selectedWorkflow,
                                  baseStyles: updatedStyles
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Variables */}
                    <div>
                      <Label className="text-sm font-medium">Variables</Label>
                      <div className="mt-2 space-y-2">
                        {Object.entries(selectedWorkflow.variables).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Label className="w-24 text-sm">{key}:</Label>
                            <Input
                              value={value}
                              onChange={(e) => {
                                const updatedVariables = {
                                  ...selectedWorkflow.variables,
                                  [key]: e.target.value
                                };
                                handleWorkflowUpdate({
                                  ...selectedWorkflow,
                                  variables: updatedVariables
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedWorkflow.isActive}
                            onCheckedChange={(checked) => {
                              handleWorkflowUpdate({
                                ...selectedWorkflow,
                                isActive: checked
                              });
                            }}
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedWorkflow.autoGenerate}
                            onCheckedChange={(checked) => {
                              handleWorkflowUpdate({
                                ...selectedWorkflow,
                                autoGenerate: checked
                              });
                            }}
                          />
                          <Label>Auto-generate</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Responsive Tab */}
              <TabsContent value="responsive">
                <Card>
                  <CardHeader>
                    <CardTitle>Responsive Breakpoints</CardTitle>
                    <CardDescription>
                      Configure responsive styles for different screen sizes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedWorkflow.responsiveBreakpoints.map((breakpoint, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium capitalize">{breakpoint.name}</h3>
                            <Badge variant="outline">
                              {breakpoint.minWidth}px{breakpoint.maxWidth ? ` - ${breakpoint.maxWidth}px` : '+'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {breakpoint.styles.map((style, styleIndex) => (
                              <div key={styleIndex} className="flex items-center space-x-2">
                                <Input
                                  placeholder="Property"
                                  value={style.property}
                                  className="flex-1"
                                />
                                <Input
                                  placeholder="Value"
                                  value={style.value}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Live Preview</span>
                      <div className="flex items-center space-x-2">
                        {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                          <Button
                            key={mode}
                            variant={previewMode === mode ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreviewMode(mode)}
                          >
                            {getPreviewIcon(mode)}
                          </Button>
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`border rounded-lg p-4 transition-all ${
                      previewMode === 'mobile' ? 'max-w-sm mx-auto' :
                      previewMode === 'tablet' ? 'max-w-2xl mx-auto' :
                      'w-full'
                    }`}>
                      <div 
                        className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg"
                        style={{
                          ...Object.fromEntries(
                            selectedWorkflow.baseStyles.map(style => [
                              style.property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
                              style.value
                            ])
                          )
                        }}
                      >
                        <h3 className="text-lg font-semibold mb-2">Preview Component</h3>
                        <p className="text-gray-600">
                          This is a preview of how your div element will look with the applied styles.
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded shadow-sm">Item 1</div>
                          <div className="bg-white p-3 rounded shadow-sm">Item 2</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Export Tab */}
              <TabsContent value="export">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Generated CSS</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectedWorkflow && generateCSS(selectedWorkflow)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4 mr-2" />
                          )}
                          {isGenerating ? 'Generating...' : 'Regenerate'}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedCSS ? (
                      <Tabs defaultValue="css" className="space-y-4">
                        <TabsList>
                          <TabsTrigger value="css">CSS</TabsTrigger>
                          <TabsTrigger value="scss">SCSS</TabsTrigger>
                          <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                          <TabsTrigger value="styled">Styled Components</TabsTrigger>
                        </TabsList>

                        <TabsContent value="css">
                          <div className="relative">
                            <Textarea
                              value={generatedCSS.css}
                              readOnly
                              className="font-mono text-sm min-h-[300px]"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2"
                              onClick={() => navigator.clipboard.writeText(generatedCSS.css)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="scss">
                          <div className="relative">
                            <Textarea
                              value={generatedCSS.scss}
                              readOnly
                              className="font-mono text-sm min-h-[300px]"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2"
                              onClick={() => navigator.clipboard.writeText(generatedCSS.scss)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="tailwind">
                          <div className="relative">
                            <Textarea
                              value={generatedCSS.tailwind}
                              readOnly
                              className="font-mono text-sm min-h-[300px]"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2"
                              onClick={() => navigator.clipboard.writeText(generatedCSS.tailwind)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="styled">
                          <div className="relative">
                            <Textarea
                              value={generatedCSS.styledComponents}
                              readOnly
                              className="font-mono text-sm min-h-[300px]"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2"
                              onClick={() => navigator.clipboard.writeText(generatedCSS.styledComponents)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="text-center py-8">
                        <Code className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Click "Generate CSS" to see the generated styles</p>
                      </div>
                    )}
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

export default DivStylingWorkflows;