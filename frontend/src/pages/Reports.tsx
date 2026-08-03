import { Download, Trash2, Eye, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
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

export default function Reports() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        const response = await validationService.getAllExecutions()
        console.log('📋 Reports API Response:', response)
        setExecutions(response.executions || [])
      } catch (error) {
        console.error('Failed to fetch reports:', error)
        setExecutions([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()

    // Refresh every 10 seconds (reduced frequency to allow better interaction)
    const interval = setInterval(fetchReports, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleDownloadHTML = async (executionId: string) => {
    try {
      console.log(`📥 Starting HTML download for ${executionId}`)
      
      // Use fetch API for better control over file download
      const response = await fetch(`/api/reports/${executionId}/download?format=html`)
      console.log(`📥 Response status: ${response.status}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Get the blob (binary data)
      const blob = await response.blob()
      console.log(`📥 Blob size: ${blob.size} bytes`)
      
      // Create temporary URL for blob
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${executionId}.html`
      link.style.display = 'none'
      document.body.appendChild(link)
      
      // Trigger download
      link.click()
      
      // Cleanup after download
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
      
      console.log('✓ HTML download initiated successfully')
    } catch (error) {
      console.error('Failed to download HTML report:', error)
      alert(`Failed to download HTML report: ${error}`)
    }
  }

  const handleDownloadPDF = async (executionId: string) => {
    try {
      console.log(`📥 Downloading PDF report for ${executionId}`)
      alert('PDF download is coming soon! Currently only HTML is supported.')
    } catch (error) {
      console.error('Failed to download PDF report:', error)
    }
  }

  const handleViewReport = async (executionId: string) => {
    try {
      console.log(`👁️ Opening report ${executionId}`)
      window.open(`/api/reports/${executionId}/download?format=html`, '_blank')
    } catch (error) {
      console.error('Failed to view report:', error)
    }
  }

  const handleDeleteReport = async (executionId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      console.log(`🗑️ Deleting report ${executionId}`)
      await validationService.deleteExecution(executionId)
      setExecutions(executions.filter((e) => e.id !== executionId))
      console.log('✓ Report deleted successfully')
    } catch (error) {
      console.error('Failed to delete report:', error)
      alert('Failed to delete report')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-200'
      case 'running':
        return 'bg-blue-900 text-blue-200'
      case 'failed':
        return 'bg-red-900 text-red-200'
      default:
        return 'bg-gray-700 text-gray-200'
    }
  }

  const filteredExecutions = executions.filter((e) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'completed') return e.status === 'completed'
    if (selectedFilter === 'failed') return e.status === 'failed'
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-gray-400">View and download validation reports</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter size={20} />
            <span>Filter:</span>
          </div>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setSelectedFilter('failed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFilter === 'failed'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Execution History</h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">URL</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExecutions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <p className="text-gray-400">No reports yet. Start a validation to generate reports.</p>
                    </td>
                  </tr>
                ) : (
                  filteredExecutions.map((execution) => (
                    <tr key={execution.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4 text-gray-300">
                        <div className="truncate max-w-md">{execution.urls.join(', ')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(execution.status)}`}>
                          {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{formatDate(execution.startTime)}</td>
                      <td className="py-3 px-4 text-gray-300">{formatDuration(execution.duration)}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDownloadHTML(execution.id)}
                            className="p-2 hover:bg-gray-600 rounded transition-colors"
                            title="Download HTML"
                          >
                            <Download size={18} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleViewReport(execution.id)}
                            className="p-2 hover:bg-gray-600 rounded transition-colors"
                            title="View Report"
                          >
                            <Eye size={18} className="text-green-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(execution.id)}
                            className="p-2 hover:bg-gray-600 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sample Report Layout */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Sample Report Preview</h2>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Validation Summary</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Total Checks</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Passed</p>
                <p className="text-2xl font-bold text-green-500">0</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-500">0</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pass Rate</p>
                <p className="text-2xl font-bold text-blue-500">0%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium mb-2">UI Components</h4>
                <div className="bg-gray-700 rounded p-3 text-gray-300 text-sm">No data available</div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Accessibility Issues</h4>
                <div className="bg-gray-700 rounded p-3 text-gray-300 text-sm">No data available</div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Broken Links</h4>
                <div className="bg-gray-700 rounded p-3 text-gray-300 text-sm">No data available</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn-primary flex items-center gap-2">
              <Download size={20} />
              Download HTML
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Download size={20} />
              Download PDF
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Eye size={20} />
              View Full Report
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
