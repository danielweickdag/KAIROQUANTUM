'use client';

import { EventEmitter } from 'events';

export interface DivElement {
  id: string;
  type: 'container' | 'content' | 'layout' | 'component';
  name: string;
  tag: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'form';
  className: string;
  styles: Record<string, string>;
  content?: string;
  children: DivElement[];
  isVisible: boolean;
  isLocked: boolean;
  responsive: {
    mobile: Record<string, string>;
    tablet: Record<string, string>;
    desktop: Record<string, string>;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author: string;
    tags: string[];
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'event' | 'condition' | 'manual';
    config: Record<string, any>;
  };
  actions: AutomationAction[];
  isActive: boolean;
  priority: number;
  conditions?: {
    type: 'and' | 'or';
    rules: ConditionRule[];
  };
}

export interface AutomationAction {
  id: string;
  type: 'create' | 'modify' | 'delete' | 'style' | 'animate' | 'clone' | 'move';
  target?: string; // element ID or selector
  config: Record<string, any>;
  delay?: number;
  retries?: number;
}

export interface ConditionRule {
  property: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

export interface GenerationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'component' | 'pattern' | 'utility';
  template: DivElement;
  variables: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'color' | 'size';
    default: any;
    description: string;
  }[];
  preview: string; // SVG or HTML preview
}

export interface AutomationMetrics {
  totalElements: number;
  elementsCreated: number;
  elementsModified: number;
  elementsDeleted: number;
  automationRuns: number;
  successRate: number;
  averageExecutionTime: number;
  errorCount: number;
  lastExecution?: Date;
}

export interface ExecutionContext {
  workflowId: string;
  elementId?: string;
  variables: Record<string, any>;
  timestamp: Date;
  user: string;
}

export class DivAutomationService extends EventEmitter {
  private elements: Map<string, DivElement> = new Map();
  private rules: Map<string, AutomationRule> = new Map();
  private templates: Map<string, GenerationTemplate> = new Map();
  private executionHistory: Array<{
    id: string;
    ruleId: string;
    timestamp: Date;
    status: 'success' | 'error' | 'partial';
    duration: number;
    result?: any;
    error?: string;
  }> = [];
  private metrics: AutomationMetrics = {
    totalElements: 0,
    elementsCreated: 0,
    elementsModified: 0,
    elementsDeleted: 0,
    automationRuns: 0,
    successRate: 100,
    averageExecutionTime: 0,
    errorCount: 0
  };

  constructor() {
    super();
    this.initializeDefaultTemplates();
    this.initializeDefaultRules();
  }

  // Element Management
  createElement(template: Partial<DivElement>, context?: ExecutionContext): string {
    const id = `div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const element: DivElement = {
      id,
      type: template.type || 'container',
      name: template.name || `Element ${this.elements.size + 1}`,
      tag: template.tag || 'div',
      className: template.className || '',
      styles: template.styles || {},
      content: template.content,
      children: template.children || [],
      isVisible: template.isVisible !== false,
      isLocked: template.isLocked || false,
      responsive: template.responsive || {
        mobile: {},
        tablet: {},
        desktop: {}
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        author: context?.user || 'system',
        tags: []
      }
    };

    this.elements.set(id, element);
    this.metrics.totalElements++;
    this.metrics.elementsCreated++;
    
    this.emit('element:created', { element, context });
    return id;
  }

  modifyElement(id: string, updates: Partial<DivElement>, context?: ExecutionContext): boolean {
    const element = this.elements.get(id);
    if (!element || element.isLocked) return false;

    const updatedElement: DivElement = {
      ...element,
      ...updates,
      metadata: {
        ...element.metadata,
        updatedAt: new Date(),
        version: element.metadata.version + 1
      }
    };

    this.elements.set(id, updatedElement);
    this.metrics.elementsModified++;
    
    this.emit('element:modified', { element: updatedElement, context });
    return true;
  }

  deleteElement(id: string, context?: ExecutionContext): boolean {
    const element = this.elements.get(id);
    if (!element || element.isLocked) return false;

    this.elements.delete(id);
    this.metrics.totalElements--;
    this.metrics.elementsDeleted++;
    
    this.emit('element:deleted', { elementId: id, context });
    return true;
  }

  cloneElement(id: string, context?: ExecutionContext): string | null {
    const element = this.elements.get(id);
    if (!element) return null;

    const clonedElement = {
      ...element,
      name: `${element.name} (Copy)`,
      children: element.children.map(child => ({ ...child }))
    };

    return this.createElement(clonedElement, context);
  }

  // Template Management
  createFromTemplate(templateId: string, variables: Record<string, any> = {}, context?: ExecutionContext): string | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const processedTemplate = this.processTemplate(template.template, variables);
    return this.createElement(processedTemplate, context);
  }

  private processTemplate(template: DivElement, variables: Record<string, any>): DivElement {
    const processed = { ...template };
    
    // Process template variables
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      
      // Replace in name
      if (processed.name.includes(placeholder)) {
        processed.name = processed.name.replace(new RegExp(placeholder, 'g'), String(value));
      }
      
      // Replace in content
      if (processed.content && processed.content.includes(placeholder)) {
        processed.content = processed.content.replace(new RegExp(placeholder, 'g'), String(value));
      }
      
      // Replace in className
      if (processed.className.includes(placeholder)) {
        processed.className = processed.className.replace(new RegExp(placeholder, 'g'), String(value));
      }
      
      // Replace in styles
      Object.entries(processed.styles).forEach(([styleKey, styleValue]) => {
        if (typeof styleValue === 'string' && styleValue.includes(placeholder)) {
          processed.styles[styleKey] = styleValue.replace(new RegExp(placeholder, 'g'), String(value));
        }
      });
    });

    return processed;
  }

  // Automation Rules
  addRule(rule: Omit<AutomationRule, 'id'>): string {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRule: AutomationRule = { ...rule, id };
    
    this.rules.set(id, newRule);
    this.emit('rule:added', newRule);
    
    return id;
  }

  executeRule(ruleId: string, context?: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve) => {
      const rule = this.rules.get(ruleId);
      if (!rule || !rule.isActive) {
        resolve(false);
        return;
      }

      const executionId = `exec-${Date.now()}`;
      const startTime = Date.now();

      try {
        // Check conditions
        if (rule.conditions && !this.evaluateConditions(rule.conditions, context)) {
          resolve(false);
          return;
        }

        // Execute actions
        for (const action of rule.actions) {
          await this.executeAction(action, context);
          
          if (action.delay) {
            await new Promise(resolve => setTimeout(resolve, action.delay));
          }
        }

        const duration = Date.now() - startTime;
        this.executionHistory.push({
          id: executionId,
          ruleId,
          timestamp: new Date(),
          status: 'success',
          duration
        });

        this.metrics.automationRuns++;
        this.metrics.averageExecutionTime = 
          (this.metrics.averageExecutionTime * (this.metrics.automationRuns - 1) + duration) / this.metrics.automationRuns;
        this.metrics.lastExecution = new Date();

        this.emit('rule:executed', { ruleId, executionId, duration });
        resolve(true);

      } catch (error) {
        const duration = Date.now() - startTime;
        this.executionHistory.push({
          id: executionId,
          ruleId,
          timestamp: new Date(),
          status: 'error',
          duration,
          error: String(error)
        });

        this.metrics.errorCount++;
        this.emit('rule:error', { ruleId, error });
        resolve(false);
      }
    });
  }

  private async executeAction(action: AutomationAction, context?: ExecutionContext): Promise<void> {
    switch (action.type) {
      case 'create':
        this.createElement(action.config, context);
        break;
        
      case 'modify':
        if (action.target) {
          this.modifyElement(action.target, action.config, context);
        }
        break;
        
      case 'delete':
        if (action.target) {
          this.deleteElement(action.target, context);
        }
        break;
        
      case 'clone':
        if (action.target) {
          this.cloneElement(action.target, context);
        }
        break;
        
      case 'style':
        if (action.target) {
          const element = this.elements.get(action.target);
          if (element) {
            this.modifyElement(action.target, {
              styles: { ...element.styles, ...action.config.styles }
            }, context);
          }
        }
        break;
        
      case 'animate':
        // Animation logic would be implemented here
        this.emit('animation:triggered', { target: action.target, config: action.config });
        break;
        
      case 'move':
        // Move element logic
        if (action.target && action.config.parentId) {
          const element = this.elements.get(action.target);
          const parent = this.elements.get(action.config.parentId);
          if (element && parent) {
            // Remove from current parent and add to new parent
            this.emit('element:moved', { elementId: action.target, newParentId: action.config.parentId });
          }
        }
        break;
    }
  }

  private evaluateConditions(conditions: AutomationRule['conditions'], context?: ExecutionContext): boolean {
    if (!conditions) return true;

    const results = conditions.rules.map(rule => this.evaluateConditionRule(rule, context));
    
    return conditions.type === 'and' 
      ? results.every(result => result)
      : results.some(result => result);
  }

  private evaluateConditionRule(rule: ConditionRule, context?: ExecutionContext): boolean {
    // This would evaluate conditions based on element properties, context, etc.
    // For now, return true as a placeholder
    return true;
  }

  // Batch Operations
  batchCreate(templates: Array<{ templateId?: string; element?: Partial<DivElement>; variables?: Record<string, any> }>, context?: ExecutionContext): string[] {
    const ids: string[] = [];
    
    templates.forEach(template => {
      if (template.templateId) {
        const id = this.createFromTemplate(template.templateId, template.variables, context);
        if (id) ids.push(id);
      } else if (template.element) {
        const id = this.createElement(template.element, context);
        ids.push(id);
      }
    });

    return ids;
  }

  batchModify(updates: Array<{ id: string; changes: Partial<DivElement> }>, context?: ExecutionContext): boolean[] {
    return updates.map(update => this.modifyElement(update.id, update.changes, context));
  }

  batchDelete(ids: string[], context?: ExecutionContext): boolean[] {
    return ids.map(id => this.deleteElement(id, context));
  }

  // Query and Search
  findElements(query: {
    type?: DivElement['type'];
    tag?: DivElement['tag'];
    className?: string;
    hasContent?: boolean;
    isVisible?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
  }): DivElement[] {
    return Array.from(this.elements.values()).filter(element => {
      if (query.type && element.type !== query.type) return false;
      if (query.tag && element.tag !== query.tag) return false;
      if (query.className && !element.className.includes(query.className)) return false;
      if (query.hasContent !== undefined && (!!element.content) !== query.hasContent) return false;
      if (query.isVisible !== undefined && element.isVisible !== query.isVisible) return false;
      if (query.createdAfter && element.metadata.createdAt < query.createdAfter) return false;
      if (query.createdBefore && element.metadata.createdAt > query.createdBefore) return false;
      return true;
    });
  }

  // Analytics and Reporting
  getMetrics(): AutomationMetrics {
    // Update success rate
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(exec => exec.status === 'success').length;
    this.metrics.successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100;

    return { ...this.metrics };
  }

  getExecutionHistory(limit = 100): typeof this.executionHistory {
    return this.executionHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Export and Import
  exportElements(ids?: string[]): DivElement[] {
    if (ids) {
      return ids.map(id => this.elements.get(id)).filter(Boolean) as DivElement[];
    }
    return Array.from(this.elements.values());
  }

  importElements(elements: DivElement[], context?: ExecutionContext): string[] {
    const importedIds: string[] = [];
    
    elements.forEach(element => {
      const id = this.createElement(element, context);
      importedIds.push(id);
    });

    return importedIds;
  }

  // Getters
  getElement(id: string): DivElement | undefined {
    return this.elements.get(id);
  }

  getAllElements(): DivElement[] {
    return Array.from(this.elements.values());
  }

  getRule(id: string): AutomationRule | undefined {
    return this.rules.get(id);
  }

  getAllRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  getTemplate(id: string): GenerationTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): GenerationTemplate[] {
    return Array.from(this.templates.values());
  }

  // Initialize default templates and rules
  private initializeDefaultTemplates(): void {
    const defaultTemplates: GenerationTemplate[] = [
      {
        id: 'card-container',
        name: 'Card Container',
        description: 'A responsive card container with shadow and padding',
        category: 'component',
        template: {
          id: '',
          type: 'component',
          name: '{{name}}',
          tag: 'div',
          className: 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6',
          styles: {
            width: '{{width}}',
            maxWidth: '400px',
            margin: '16px'
          },
          content: '{{content}}',
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
            author: 'system',
            tags: ['card', 'container']
          }
        },
        variables: [
          { name: 'name', type: 'string', default: 'Card', description: 'Card name' },
          { name: 'width', type: 'size', default: '100%', description: 'Card width' },
          { name: 'content', type: 'string', default: 'Card content', description: 'Card content' }
        ],
        preview: '<svg>...</svg>'
      },
      {
        id: 'flex-container',
        name: 'Flex Container',
        description: 'A flexible container with customizable direction and alignment',
        category: 'layout',
        template: {
          id: '',
          type: 'layout',
          name: '{{name}}',
          tag: 'div',
          className: 'flex {{direction}} {{justify}} {{align}}',
          styles: {
            gap: '{{gap}}',
            padding: '{{padding}}'
          },
          children: [],
          isVisible: true,
          isLocked: false,
          responsive: {
            mobile: { flexDirection: 'column' },
            tablet: {},
            desktop: {}
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            author: 'system',
            tags: ['flex', 'layout']
          }
        },
        variables: [
          { name: 'name', type: 'string', default: 'Flex Container', description: 'Container name' },
          { name: 'direction', type: 'string', default: 'flex-row', description: 'Flex direction' },
          { name: 'justify', type: 'string', default: 'justify-start', description: 'Justify content' },
          { name: 'align', type: 'string', default: 'items-start', description: 'Align items' },
          { name: 'gap', type: 'size', default: '16px', description: 'Gap between items' },
          { name: 'padding', type: 'size', default: '16px', description: 'Container padding' }
        ],
        preview: '<svg>...</svg>'
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeDefaultRules(): void {
    const defaultRules: AutomationRule[] = [
      {
        id: 'auto-responsive',
        name: 'Auto Responsive Adjustment',
        description: 'Automatically adjust element styles for different screen sizes',
        trigger: {
          type: 'event',
          config: { event: 'element:created' }
        },
        actions: [
          {
            id: 'add-responsive-classes',
            type: 'modify',
            config: {
              className: 'responsive-element'
            }
          }
        ],
        isActive: true,
        priority: 1
      },
      {
        id: 'auto-accessibility',
        name: 'Auto Accessibility Enhancement',
        description: 'Automatically add accessibility attributes to elements',
        trigger: {
          type: 'event',
          config: { event: 'element:created' }
        },
        actions: [
          {
            id: 'add-aria-labels',
            type: 'modify',
            config: {
              'aria-label': 'Auto-generated element'
            }
          }
        ],
        isActive: true,
        priority: 2
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }
}

// Create singleton instance
export const divAutomationService = new DivAutomationService();
export default divAutomationService;