'use client';

import { EventEmitter } from 'events';

// Page automation types
export interface PageAutomation {
  id: string;
  pageRoute: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  schedule?: AutomationSchedule;
  conditions?: AutomationCondition[];
  executionCount: number;
  successRate: number;
  lastExecuted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  id: string;
  type: 'page_load' | 'user_action' | 'data_change' | 'time_based' | 'api_response' | 'form_submit' | 'scroll' | 'click' | 'hover';
  element?: string;
  event?: string;
  condition?: string;
  delay?: number;
  isActive: boolean;
}

export interface AutomationAction {
  id: string;
  type: 'navigate' | 'fill_form' | 'click_element' | 'scroll_to' | 'api_call' | 'notification' | 'data_update' | 'ui_update' | 'modal_open' | 'modal_close';
  target?: string;
  value?: any;
  parameters?: Record<string, any>;
  delay?: number;
  retries?: number;
}

export interface AutomationSchedule {
  type: 'interval' | 'cron' | 'once';
  value: string | number;
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AutomationCondition {
  id: string;
  type: 'element_exists' | 'data_equals' | 'user_role' | 'time_range' | 'device_type' | 'browser_type';
  target: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  value: any;
}

export interface AutomationExecution {
  id: string;
  automationId: string;
  pageRoute: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  triggeredBy: string;
  results: AutomationResult[];
  error?: string;
}

export interface AutomationResult {
  actionId: string;
  status: 'success' | 'failed' | 'skipped';
  message?: string;
  data?: any;
  duration: number;
}

export interface PageAutomationMetrics {
  totalAutomations: number;
  activeAutomations: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  automationsByPage: Record<string, number>;
  executionsByHour: Record<string, number>;
  lastUpdated: Date;
}

class PageAutomationService extends EventEmitter {
  private automations: Map<string, PageAutomation> = new Map();
  private executions: Map<string, AutomationExecution> = new Map();
  private activeExecutions: Set<string> = new Set();
  private scheduledTasks: Map<string, NodeJS.Timeout> = new Map();
  private isInitialized = false;
  private currentPage = '';
  private pageObservers: Map<string, MutationObserver> = new Map();

  constructor() {
    super();
    this.initializeDefaultAutomations();
    this.setupPageObserver();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Initializing Page Automation Service');
    
    // Set up global event listeners
    this.setupGlobalEventListeners();
    
    // Start scheduled automations
    this.startScheduledAutomations();
    
    this.isInitialized = true;
    this.emit('service:initialized');
  }

  private setupGlobalEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Page navigation detection
    window.addEventListener('popstate', this.handlePageChange.bind(this));
    
    // Global click tracking
    document.addEventListener('click', this.handleGlobalClick.bind(this));
    
    // Form submission tracking
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Scroll tracking
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private setupPageObserver(): void {
    if (typeof window === 'undefined') return;

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.handleDOMChange(mutation);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private initializeDefaultAutomations(): void {
    const defaultAutomations: PageAutomation[] = [
      // Dashboard automations
      {
        id: 'dashboard-welcome',
        pageRoute: '/dashboard',
        name: 'Dashboard Welcome Flow',
        description: 'Automatically guide new users through dashboard features',
        isActive: true,
        triggers: [{
          id: 'page-load-trigger',
          type: 'page_load',
          isActive: true
        }],
        actions: [{
          id: 'show-welcome-modal',
          type: 'modal_open',
          target: 'welcome-modal',
          delay: 1000
        }],
        executionCount: 0,
        successRate: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Trading platform automations
      {
        id: 'trading-auto-refresh',
        pageRoute: '/trading-platform',
        name: 'Auto Refresh Market Data',
        description: 'Automatically refresh market data every 30 seconds',
        isActive: true,
        triggers: [{
          id: 'time-trigger',
          type: 'time_based',
          isActive: true
        }],
        actions: [{
          id: 'refresh-data',
          type: 'api_call',
          target: '/api/market-data',
          parameters: { refresh: true }
        }],
        schedule: {
          type: 'interval',
          value: 30000 // 30 seconds
        },
        executionCount: 0,
        successRate: 95,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Login automation
      {
        id: 'login-auto-fill',
        pageRoute: '/login',
        name: 'Auto Fill Demo Credentials',
        description: 'Automatically fill demo credentials for testing',
        isActive: false, // Disabled by default for security
        triggers: [{
          id: 'demo-button-click',
          type: 'click',
          element: '[data-demo-login]',
          isActive: true
        }],
        actions: [
          {
            id: 'fill-email',
            type: 'fill_form',
            target: 'input[name="email"]',
            value: 'demo@kairo.com'
          },
          {
            id: 'fill-password',
            type: 'fill_form',
            target: 'input[name="password"]',
            value: 'demo123',
            delay: 500
          }
        ],
        executionCount: 0,
        successRate: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Portfolio automation
      {
        id: 'portfolio-auto-update',
        pageRoute: '/portfolio',
        name: 'Auto Update Portfolio Values',
        description: 'Automatically update portfolio values and calculations',
        isActive: true,
        triggers: [{
          id: 'data-change-trigger',
          type: 'data_change',
          isActive: true
        }],
        actions: [{
          id: 'recalculate-portfolio',
          type: 'data_update',
          target: 'portfolio-calculations',
          parameters: { recalculate: true }
        }],
        executionCount: 0,
        successRate: 98,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Copy trading automation
      {
        id: 'copy-trade-sync',
        pageRoute: '/copy-trade',
        name: 'Auto Sync Copy Trades',
        description: 'Automatically sync copy trading positions',
        isActive: true,
        triggers: [{
          id: 'api-response-trigger',
          type: 'api_response',
          isActive: true
        }],
        actions: [{
          id: 'sync-positions',
          type: 'api_call',
          target: '/api/copy-trade/sync',
          parameters: { autoSync: true }
        }],
        schedule: {
          type: 'interval',
          value: 60000 // 1 minute
        },
        executionCount: 0,
        successRate: 92,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultAutomations.forEach(automation => {
      this.automations.set(automation.id, automation);
    });
  }

  // Automation Management
  createAutomation(automation: Omit<PageAutomation, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successRate'>): string {
    const id = `automation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAutomation: PageAutomation = {
      ...automation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 100
    };

    this.automations.set(id, newAutomation);
    this.emit('automation:created', newAutomation);
    
    // Start scheduled automation if applicable
    if (newAutomation.schedule && newAutomation.isActive) {
      this.scheduleAutomation(newAutomation);
    }
    
    return id;
  }

  updateAutomation(id: string, updates: Partial<PageAutomation>): boolean {
    const automation = this.automations.get(id);
    if (!automation) return false;

    const updatedAutomation = { 
      ...automation, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.automations.set(id, updatedAutomation);
    this.emit('automation:updated', updatedAutomation);
    
    // Reschedule if schedule changed
    if (updates.schedule || updates.isActive !== undefined) {
      this.unscheduleAutomation(id);
      if (updatedAutomation.schedule && updatedAutomation.isActive) {
        this.scheduleAutomation(updatedAutomation);
      }
    }
    
    return true;
  }

  deleteAutomation(id: string): boolean {
    const automation = this.automations.get(id);
    if (!automation) return false;

    this.unscheduleAutomation(id);
    this.automations.delete(id);
    this.emit('automation:deleted', { id, automation });
    
    return true;
  }

  getAutomation(id: string): PageAutomation | undefined {
    return this.automations.get(id);
  }

  getAllAutomations(): PageAutomation[] {
    return Array.from(this.automations.values());
  }

  getAutomationsForPage(pageRoute: string): PageAutomation[] {
    return this.getAllAutomations().filter(a => a.pageRoute === pageRoute);
  }

  getActiveAutomations(): PageAutomation[] {
    return this.getAllAutomations().filter(a => a.isActive);
  }

  // Execution Management
  async executeAutomation(automationId: string, triggerData?: any): Promise<string> {
    const automation = this.automations.get(automationId);
    if (!automation || !automation.isActive) {
      throw new Error(`Automation ${automationId} not found or inactive`);
    }

    // Check conditions
    if (automation.conditions && !this.checkConditions(automation.conditions)) {
      console.log(`Automation ${automationId} conditions not met`);
      return '';
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const execution: AutomationExecution = {
      id: executionId,
      automationId,
      pageRoute: automation.pageRoute,
      status: 'running',
      startTime: new Date(),
      triggeredBy: triggerData?.source || 'manual',
      results: []
    };

    this.executions.set(executionId, execution);
    this.activeExecutions.add(executionId);
    this.emit('execution:started', execution);

    try {
      // Execute actions sequentially
      for (const action of automation.actions) {
        const result = await this.executeAction(action, triggerData);
        execution.results.push(result);
        
        if (result.status === 'failed' && !action.retries) {
          throw new Error(`Action ${action.id} failed: ${result.message}`);
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime();

      // Update automation stats
      automation.executionCount++;
      const successfulResults = execution.results.filter(r => r.status === 'success').length;
      automation.successRate = (automation.successRate * (automation.executionCount - 1) + 
        (successfulResults / execution.results.length * 100)) / automation.executionCount;
      automation.lastExecuted = new Date();

      this.emit('execution:completed', execution);
      
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : String(error);
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime();

      this.emit('execution:failed', execution);
    } finally {
      this.activeExecutions.delete(executionId);
      this.executions.set(executionId, execution);
    }

    return executionId;
  }

  private async executeAction(action: AutomationAction, triggerData?: any): Promise<AutomationResult> {
    const startTime = Date.now();
    
    try {
      if (action.delay) {
        await new Promise(resolve => setTimeout(resolve, action.delay));
      }

      let result: any;
      
      switch (action.type) {
        case 'navigate':
          result = await this.executeNavigateAction(action);
          break;
        case 'fill_form':
          result = await this.executeFillFormAction(action);
          break;
        case 'click_element':
          result = await this.executeClickAction(action);
          break;
        case 'scroll_to':
          result = await this.executeScrollAction(action);
          break;
        case 'api_call':
          result = await this.executeApiCallAction(action);
          break;
        case 'notification':
          result = await this.executeNotificationAction(action);
          break;
        case 'data_update':
          result = await this.executeDataUpdateAction(action);
          break;
        case 'ui_update':
          result = await this.executeUIUpdateAction(action);
          break;
        case 'modal_open':
          result = await this.executeModalAction(action, 'open');
          break;
        case 'modal_close':
          result = await this.executeModalAction(action, 'close');
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      return {
        actionId: action.id!,
        status: 'success',
        message: 'Action executed successfully',
        data: result,
        duration: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        actionId: action.id!,
        status: 'failed',
        message: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      };
    }
  }

  // Action execution methods
  private async executeNavigateAction(action: AutomationAction): Promise<any> {
    if (typeof window === 'undefined') return;
    
    if (action.target) {
      window.location.href = action.target;
    }
    return { navigated: true, target: action.target };
  }

  private async executeFillFormAction(action: AutomationAction): Promise<any> {
    if (typeof document === 'undefined') return;
    
    const element = document.querySelector(action.target!) as HTMLInputElement;
    if (element) {
      element.value = action.value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return { filled: true, target: action.target, value: action.value };
  }

  private async executeClickAction(action: AutomationAction): Promise<any> {
    if (typeof document === 'undefined') return;
    
    const element = document.querySelector(action.target!) as HTMLElement;
    if (element) {
      element.click();
    }
    return { clicked: true, target: action.target };
  }

  private async executeScrollAction(action: AutomationAction): Promise<any> {
    if (typeof window === 'undefined') return;
    
    const element = document.querySelector(action.target!);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    return { scrolled: true, target: action.target };
  }

  private async executeApiCallAction(action: AutomationAction): Promise<any> {
    const response = await fetch(action.target!, {
      method: action.parameters?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...action.parameters?.headers
      },
      body: action.parameters?.body ? JSON.stringify(action.parameters.body) : undefined
    });
    
    const data = await response.json();
    return { apiCall: true, target: action.target, response: data };
  }

  private async executeNotificationAction(action: AutomationAction): Promise<any> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      new Notification(action.value || 'Automation Notification', {
        body: action.parameters?.body,
        icon: action.parameters?.icon
      });
    }
    return { notification: true, message: action.value };
  }

  private async executeDataUpdateAction(action: AutomationAction): Promise<any> {
    // Emit data update event
    this.emit('data:update', {
      target: action.target,
      value: action.value,
      parameters: action.parameters
    });
    return { dataUpdate: true, target: action.target };
  }

  private async executeUIUpdateAction(action: AutomationAction): Promise<any> {
    // Emit UI update event
    this.emit('ui:update', {
      target: action.target,
      value: action.value,
      parameters: action.parameters
    });
    return { uiUpdate: true, target: action.target };
  }

  private async executeModalAction(action: AutomationAction, type: 'open' | 'close'): Promise<any> {
    this.emit(`modal:${type}`, {
      target: action.target,
      parameters: action.parameters
    });
    return { modal: type, target: action.target };
  }

  // Scheduling
  private scheduleAutomation(automation: PageAutomation): void {
    if (!automation.schedule) return;

    let interval: number;
    
    if (automation.schedule.type === 'interval') {
      interval = automation.schedule.value as number;
    } else {
      // For cron and other types, default to 1 minute
      interval = 60000;
    }

    const timeoutId = setInterval(() => {
      this.executeAutomation(automation.id, { source: 'scheduled' });
    }, interval);

    this.scheduledTasks.set(automation.id, timeoutId);
  }

  private unscheduleAutomation(automationId: string): void {
    const timeoutId = this.scheduledTasks.get(automationId);
    if (timeoutId) {
      clearInterval(timeoutId);
      this.scheduledTasks.delete(automationId);
    }
  }

  private startScheduledAutomations(): void {
    this.getActiveAutomations()
      .filter(a => a.schedule)
      .forEach(a => this.scheduleAutomation(a));
  }

  // Condition checking
  private checkConditions(conditions: AutomationCondition[]): boolean {
    return conditions.every(condition => {
      switch (condition.type) {
        case 'element_exists':
          return typeof document !== 'undefined' && 
                 document.querySelector(condition.target) !== null;
        case 'user_role':
          // Check user role from context or localStorage
          return true; // Placeholder
        case 'time_range':
          const now = new Date();
          const [start, end] = condition.value.split('-');
          const startTime = new Date(`1970-01-01T${start}`);
          const endTime = new Date(`1970-01-01T${end}`);
          return now.getHours() >= startTime.getHours() && 
                 now.getHours() <= endTime.getHours();
        default:
          return true;
      }
    });
  }

  // Event handlers
  private handlePageChange(): void {
    const newPage = window.location.pathname;
    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.triggerPageAutomations(newPage, 'page_load');
    }
  }

  private handleGlobalClick(event: Event): void {
    const target = event.target as HTMLElement;
    this.triggerElementAutomations('click', target);
  }

  private handleFormSubmit(event: Event): void {
    const target = event.target as HTMLFormElement;
    this.triggerElementAutomations('form_submit', target);
  }

  private handleScroll(): void {
    this.triggerPageAutomations(window.location.pathname, 'scroll');
  }

  private handleDOMChange(mutation: MutationRecord): void {
    this.triggerPageAutomations(window.location.pathname, 'data_change');
  }

  private triggerPageAutomations(pageRoute: string, triggerType: string): void {
    const pageAutomations = this.getAutomationsForPage(pageRoute);
    
    pageAutomations.forEach(automation => {
      const matchingTriggers = automation.triggers.filter(
        t => t.type === triggerType && t.isActive
      );
      
      if (matchingTriggers.length > 0) {
        this.executeAutomation(automation.id, { 
          source: triggerType, 
          page: pageRoute 
        });
      }
    });
  }

  private triggerElementAutomations(triggerType: string, element: HTMLElement): void {
    const pageRoute = window.location.pathname;
    const pageAutomations = this.getAutomationsForPage(pageRoute);
    
    pageAutomations.forEach(automation => {
      const matchingTriggers = automation.triggers.filter(t => {
        if (t.type !== triggerType || !t.isActive) return false;
        
        if (t.element) {
          return element.matches(t.element) || element.closest(t.element);
        }
        
        return true;
      });
      
      if (matchingTriggers.length > 0) {
        this.executeAutomation(automation.id, { 
          source: triggerType, 
          element: element.tagName,
          page: pageRoute 
        });
      }
    });
  }

  // Metrics and monitoring
  getMetrics(): PageAutomationMetrics {
    const automations = this.getAllAutomations();
    const executions = Array.from(this.executions.values());
    
    const automationsByPage: Record<string, number> = {};
    automations.forEach(a => {
      automationsByPage[a.pageRoute] = (automationsByPage[a.pageRoute] || 0) + 1;
    });

    const executionsByHour: Record<string, number> = {};
    executions.forEach(e => {
      const hour = e.startTime.getHours().toString();
      executionsByHour[hour] = (executionsByHour[hour] || 0) + 1;
    });

    const successfulExecutions = executions.filter(e => e.status === 'completed').length;
    const totalDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0);

    return {
      totalAutomations: automations.length,
      activeAutomations: automations.filter(a => a.isActive).length,
      totalExecutions: executions.length,
      successfulExecutions,
      failedExecutions: executions.length - successfulExecutions,
      averageExecutionTime: executions.length > 0 ? totalDuration / executions.length : 0,
      automationsByPage,
      executionsByHour,
      lastUpdated: new Date()
    };
  }

  getExecutions(automationId?: string): AutomationExecution[] {
    const executions = Array.from(this.executions.values());
    return automationId ? 
      executions.filter(e => e.automationId === automationId) : 
      executions;
  }

  // Cleanup
  destroy(): void {
    // Clear all scheduled tasks
    this.scheduledTasks.forEach(timeoutId => clearInterval(timeoutId));
    this.scheduledTasks.clear();
    
    // Clear observers
    this.pageObservers.forEach(observer => observer.disconnect());
    this.pageObservers.clear();
    
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handlePageChange.bind(this));
      document.removeEventListener('click', this.handleGlobalClick.bind(this));
      document.removeEventListener('submit', this.handleFormSubmit.bind(this));
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
    
    this.removeAllListeners();
  }
}

// Create singleton instance
export const pageAutomationService = new PageAutomationService();

// Initialize on import
if (typeof window !== 'undefined') {
  pageAutomationService.initialize().catch(error => {
    console.error('Failed to initialize page automation service', error);
  });
}

export default pageAutomationService;