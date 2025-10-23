export interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  createdAt: Date;
  updatedAt: Date;
  executionCount: number;
  successRate: number;
  lastExecuted?: Date;
  status: 'active' | 'inactive' | 'error' | 'paused';
}

export interface WorkflowTrigger {
  id: string;
  type: 'price_alert' | 'time_based' | 'technical_indicator' | 'news_event' | 'portfolio_change';
  config: Record<string, any>;
}

export interface WorkflowAction {
  id: string;
  type: 'place_order' | 'send_notification' | 'update_portfolio' | 'execute_strategy' | 'log_event';
  config: Record<string, any>;
}

export interface WorkflowCondition {
  id: string;
  type: 'price_condition' | 'time_condition' | 'portfolio_condition' | 'market_condition';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  value: any;
  field: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
  logs: WorkflowLog[];
}

export interface WorkflowLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: any;
}

export interface WorkflowTriggerEvent {
  type: string;
  data: Record<string, any>;
  timestamp: Date;
}

class WorkflowAutomationService {
  private workflows: Map<string, AutomatedWorkflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  async getWorkflows(): Promise<AutomatedWorkflow[]> {
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: string): Promise<AutomatedWorkflow | null> {
    return this.workflows.get(id) || null;
  }

  async createWorkflow(workflow: Omit<AutomatedWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successRate'>): Promise<string> {
    const id = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newWorkflow: AutomatedWorkflow = {
      ...workflow,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 0,
    };
    
    this.workflows.set(id, newWorkflow);
    this.notifyListeners('workflow_created', newWorkflow);
    return id;
  }

  async updateWorkflow(id: string, updates: Partial<AutomatedWorkflow>): Promise<boolean> {
    const workflow = this.workflows.get(id);
    if (!workflow) return false;

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date(),
    };

    this.workflows.set(id, updatedWorkflow);
    this.notifyListeners('workflow_updated', updatedWorkflow);
    return true;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      this.notifyListeners('workflow_deleted', { id });
    }
    return deleted;
  }

  async executeWorkflow(workflowId: string, triggerData?: Record<string, any>): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.isActive) {
      throw new Error('Workflow not found or inactive');
    }

    const executionId = `execution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'pending',
      startedAt: new Date(),
      logs: [],
    };

    this.executions.set(executionId, execution);
    this.notifyListeners('execution_started', execution);

    // Simulate workflow execution
    setTimeout(async () => {
      try {
        execution.status = 'running';
        this.notifyListeners('execution_updated', execution);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        execution.status = 'completed';
        execution.completedAt = new Date();
        execution.result = { success: true, data: triggerData };

        // Update workflow stats
        workflow.executionCount++;
        workflow.lastExecuted = new Date();
        this.workflows.set(workflowId, workflow);

        this.notifyListeners('execution_completed', execution);
      } catch (error) {
        execution.status = 'failed';
        execution.error = error instanceof Error ? error.message : 'Unknown error';
        execution.completedAt = new Date();
        this.notifyListeners('execution_failed', execution);
      }
    }, 100);

    return executionId;
  }

  async getExecution(id: string): Promise<WorkflowExecution | null> {
    return this.executions.get(id) || null;
  }

  async getWorkflowExecutions(workflowId: string): Promise<WorkflowExecution[]> {
    return Array.from(this.executions.values()).filter(exec => exec.workflowId === workflowId);
  }

  async stopExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status === 'completed' || execution.status === 'failed') {
      return false;
    }

    execution.status = 'cancelled';
    execution.completedAt = new Date();
    this.notifyListeners('execution_cancelled', execution);
    return true;
  }

  addEventListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in workflow event listener:', error);
        }
      });
    }
  }

  async getActiveWorkflows(): Promise<AutomatedWorkflow[]> {
    return Array.from(this.workflows.values()).filter(w => w.isActive);
  }

  async getRecentExecutions(limit: number = 10): Promise<WorkflowExecution[]> {
    return Array.from(this.executions.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }
}

export const workflowAutomationService = new WorkflowAutomationService();