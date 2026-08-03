import axios from 'axios'

export interface ValidationRequest {
  urls: string[]
  options: {
    validateUI: boolean
    validateLinks: boolean
    validateImages: boolean
    validateText: boolean
    validateResponsive: boolean
    validateAccessibility: boolean
    validatePerformance: boolean
    devices: string[]
  }
}

export interface ValidationResponse {
  message: string
  executionId: string
  urls: string[]
  options: ValidationRequest['options']
  status: string
}

export const validationService = {
  async startValidation(request: ValidationRequest): Promise<ValidationResponse> {
    try {
      const response = await axios.post<ValidationResponse>(
        '/api/validate',
        request
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Validation failed')
      }
      throw error
    }
  },

  async getValidationStatus(executionId: string) {
    try {
      const response = await axios.get(
        `/api/validate/${executionId}`
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch status')
      }
      throw error
    }
  },

  async getDevices() {
    try {
      const response = await axios.get(
        '/api/devices'
      )
      return response.data.devices
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch devices')
      }
      throw error
    }
  },

  async getAllExecutions() {
    try {
      const response = await axios.get('/api/reports')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch executions')
      }
      throw error
    }
  },

  async deleteExecution(executionId: string) {
    try {
      const response = await axios.delete(`/api/reports/${executionId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to delete execution')
      }
      throw error
    }
  },
}
