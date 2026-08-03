import { ValidationResult, ValidationOptions } from '../types/index'

export interface Execution {
  id: string
  urls: string[]
  options: ValidationOptions
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number // 0-100
  startTime: string
  endTime?: string
  duration?: number
  results?: ValidationResult[]
  errors: string[]
  currentUrl?: string
}

export class ExecutionService {
  private executions: Map<string, Execution> = new Map()

  createExecution(id: string, urls: string[], options: ValidationOptions): Execution {
    const execution: Execution = {
      id,
      urls,
      options,
      status: 'pending',
      progress: 0,
      startTime: new Date().toISOString(),
      errors: [],
    }
    this.executions.set(id, execution)
    return execution
  }

  getExecution(id: string): Execution | undefined {
    return this.executions.get(id)
  }

  updateExecutionStatus(
    id: string,
    status: 'pending' | 'running' | 'completed' | 'failed',
    progress: number,
    currentUrl?: string
  ): void {
    const execution = this.executions.get(id)
    if (execution) {
      execution.status = status
      execution.progress = Math.min(100, progress)
      if (currentUrl) execution.currentUrl = currentUrl
      if (status === 'completed' || status === 'failed') {
        execution.endTime = new Date().toISOString()
        execution.duration = new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()
      }
    }
  }

  addError(id: string, error: string): void {
    const execution = this.executions.get(id)
    if (execution) {
      execution.errors.push(error)
    }
  }

  setResults(id: string, results: ValidationResult[]): void {
    const execution = this.executions.get(id)
    if (execution) {
      execution.results = results
    }
  }

  getAllExecutions(): Execution[] {
    return Array.from(this.executions.values()).sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
  }

  deleteExecution(id: string): boolean {
    return this.executions.delete(id)
  }
}

export const executionService = new ExecutionService()
