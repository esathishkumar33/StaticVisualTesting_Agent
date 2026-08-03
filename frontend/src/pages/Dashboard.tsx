import { useState, useEffect } from 'react'
import { BarChart3, Zap, AlertCircle, Download, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { validationService } from '@services/validationService'

interface Execution {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  urls: string[]
  startTime: string
  endTime?: string
  duration?: number
  progress: number
}

export default function Dashboard() {
  const location = useLocation()
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [totalExecutions, setTotalExecutions] = useState(0)
  const [completedExecutions, setCompletedExecutions] = useState(0)

  // Fetch recent executions
  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        setLoading(true)
        const response = await validationService.getAllExecutions()
        console.log('📊 API Response:', response)
        console.log('📊 Response keys:', Object.keys(response))
        console.log('📊 response.executions:', response.executions)
        console.log('📊 response.reports:', response.reports)
        console.log('📊 response.total:', response.total)
        
        setExecutions(response.executions || [])
        setTotalExecutions(response.total || 0)
        setCompletedExecutions((response.executions || []).filter((e: Execution) => e.status === 'completed').length)
      } catch (error) {
        console.error('Failed to fetch executions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExecutions()

    // Refresh every 5 seconds
    const interval = setInterval(fetchExecutions, 5000)
    return () => clearInterval(interval)
  }, [])

  const calculatePassRate = () => {
    if (totalExecutions === 0) return 0
    return Math.round((completedExecutions / totalExecutions) * 100)
  }

  const handleDownloadReport = async (executionId: string) => {
    try {
      console.log(`📥 Starting download for ${executionId}`)
      
      // Method 1: Try using fetch API for more control
      const response = await fetch(`/api/reports/${executionId}/download?format=html`)
      console.log(`📥 Response status: ${response.status}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Get the HTML content
      const blob = await response.blob()
      console.log(`📥 Blob size: ${blob.size}`)
      
      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${executionId}.html`
      link.style.display = 'none'
      document.body.appendChild(link)
      
      // Trigger the download
      link.click()
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
      
      console.log('✓ Download initiated successfully')
    } catch (error) {
      console.error('Failed to download report:', error)
      alert(`Failed to download report: ${error}`)
    }
  }

  const handleDeleteReport = async (executionId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await validationService.deleteExecution(executionId)
        setExecutions(executions.filter(e => e.id !== executionId))
        setTotalExecutions(totalExecutions - 1)
      } catch (error) {
        console.error('Failed to delete report:', error)
      }
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'running':
        return 'text-blue-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/20 border-green-700'
      case 'running':
        return 'bg-blue-900/20 border-blue-700'
      case 'failed':
        return 'bg-red-900/20 border-red-700'
      default:
        return 'bg-gray-900/20 border-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your testing campaigns</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Executions</p>
              <p className="text-3xl font-bold text-white mt-2">{totalExecutions}</p>
            </div>
            <Zap className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pass Rate</p>
              <p className={`text-3xl font-bold mt-2 ${calculatePassRate() >= 80 ? 'text-green-500' : calculatePassRate() >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {calculatePassRate()}%
              </p>
            </div>
            <BarChart3 className="text-green-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">{completedExecutions}</p>
            </div>
            <AlertCircle className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Executions */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Recent Executions</h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading executions...</p>
          </div>
        ) : executions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No executions yet. Start by validating a URL.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {executions.slice(0, 10).map((execution) => (
              <div key={execution.id} className={`border rounded-lg p-4 transition-colors ${getStatusBgColor(execution.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-semibold ${getStatusColor(execution.status)}`}>
                        {execution.status.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">{execution.id}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      URLs: {execution.urls.slice(0, 2).map((url) => url.replace('https://', '').replace('http://', '')).join(', ')}
                      {execution.urls.length > 2 && ` +${execution.urls.length - 2} more`}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Started: {formatDate(execution.startTime)}</span>
                      {execution.endTime && <span>Duration: {formatDuration(execution.duration)}</span>}
                    </div>
                    {execution.status === 'running' && (
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-400">Progress</span>
                          <span className="text-xs text-blue-400">{execution.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${execution.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {execution.status === 'completed' && (
                      <>
                        <button
                          onClick={() => handleDownloadReport(execution.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="text-blue-400" size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(execution.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="text-red-400" size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/validate" className="btn-primary">
            Start Validation
          </a>
          <a href="/reports" className="btn-secondary">
            View All Reports
          </a>
        </div>
      </div>
    </div>
  )
}
