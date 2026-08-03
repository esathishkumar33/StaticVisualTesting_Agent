import { useState, useEffect } from 'react'
import { Upload, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { validationService } from '@services/validationService'

interface ExecutionStatus {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  currentUrl?: string
  startTime: string
  endTime?: string
  duration?: number
  errors: string[]
}

export default function Validation() {
  const navigate = useNavigate()
  const [urls, setUrls] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [executionId, setExecutionId] = useState<string | null>(null)
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus | null>(null)
  const [elapsedTime, setElapsedTime] = useState<string>('0s')

  // Validation options
  const [options, setOptions] = useState({
    validateUI: true,
    validateLinks: true,
    validateImages: true,
    validateText: true,
    validateResponsive: true,
    validateAccessibility: true,
    validatePerformance: false,
  })

  // Selected devices
  const [selectedDevices, setSelectedDevices] = useState<string[]>(['Desktop', 'Laptop', 'Tablet', 'Mobile'])

  const defaultDevices = [
    { name: 'Desktop', res: '1920x1080' },
    { name: 'Laptop', res: '1440x900' },
    { name: 'Tablet', res: '768x1024' },
    { name: 'Mobile', res: '390x844' },
  ]

  // Poll for execution status
  useEffect(() => {
    if (!executionId) return

    const pollInterval = setInterval(async () => {
      try {
        const status = await validationService.getValidationStatus(executionId)
        setExecutionStatus(status)

        // Calculate elapsed time
        const startTime = new Date(status.startTime).getTime()
        const now = new Date().getTime()
        const elapsed = Math.floor((now - startTime) / 1000)
        
        if (elapsed < 60) {
          setElapsedTime(`${elapsed}s`)
        } else {
          setElapsedTime(`${Math.floor(elapsed / 60)}m ${elapsed % 60}s`)
        }

        // If completed or failed, navigate to reports
        if (status.status === 'completed' || status.status === 'failed') {
          setIsLoading(false)
          // Auto-navigate after 2 seconds
          setTimeout(() => {
            navigate('/reports', { state: { executionId } })
          }, 2000)
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
      }
    }, 1000) // Poll every second

    return () => clearInterval(pollInterval)
  }, [executionId, navigate])

  const handleAddUrl = () => {
    setUrls([...urls, ''])
  }

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleDeviceToggle = (deviceName: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceName)
        ? prev.filter(d => d !== deviceName)
        : [...prev, deviceName]
    )
  }

  const handleReset = () => {
    setUrls([''])
    setSelectedDevices(['Desktop', 'Laptop', 'Tablet', 'Mobile'])
    setMessage(null)
    setExecutionId(null)
    setExecutionStatus(null)
    setElapsedTime('0s')
  }

  const handleValidate = async () => {
    setMessage(null)

    // Validate URLs
    const validUrls = urls.filter(u => u.trim())
    if (validUrls.length === 0) {
      setMessage({ type: 'error', text: 'Please enter at least one URL' })
      return
    }

    // Validate devices
    if (selectedDevices.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one device' })
      return
    }

    setIsLoading(true)
    try {
      const response = await validationService.startValidation({
        urls: validUrls,
        options: {
          ...options,
          devices: selectedDevices,
        }
      })

      setExecutionId(response.executionId)
      setMessage({
        type: 'success',
        text: 'Validation started! Progress will update in real-time.'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation failed'
      setMessage({ type: 'error', text: errorMessage })
      console.error('Validation failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Validate URLs</h1>
        <p className="text-gray-400">Add URLs to validate UI, performance, and accessibility</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-900 border border-green-700'
            : 'bg-red-900 border border-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
          )}
          <p className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Progress Section */}
      {isLoading && executionStatus && (
        <div className="card bg-blue-900/20 border border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="animate-spin text-blue-400" size={24} />
            <div>
              <h3 className="text-white font-semibold">Validation in Progress</h3>
              <p className="text-gray-400 text-sm">Elapsed time: {elapsedTime}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Progress</span>
              <span className="text-blue-400 font-semibold">{executionStatus.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${executionStatus.progress}%` }}
              />
            </div>
          </div>

          {/* Current URL Being Validated */}
          {executionStatus.currentUrl && (
            <p className="text-gray-300 text-sm">
              Currently validating: <span className="text-blue-300 font-mono break-all">{executionStatus.currentUrl}</span>
            </p>
          )}
        </div>
      )}

      {/* Form Section - Hidden during validation */}
      {!isLoading && (
        <>
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Enter URLs</h2>

            <div className="space-y-3 mb-6">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="input-field flex-1"
                  />
                  {urls.length > 1 && (
                    <button
                      onClick={() => handleRemoveUrl(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddUrl}
              className="btn-secondary mb-6 flex items-center gap-2"
            >
              <Plus size={20} />
              Add URL
            </button>

            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Or Upload File</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-gray-400">Drag and drop CSV or TXT file here</p>
                <p className="text-gray-500 text-sm">or click to select</p>
              </div>
            </div>
          </div>

          {/* Validation Options */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Validation Options</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ui-validation"
                  checked={options.validateUI}
                  onChange={() => handleOptionChange('validateUI')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="ui-validation" className="ml-3 text-gray-300">
                  UI Component Validation
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="link-validation"
                  checked={options.validateLinks}
                  onChange={() => handleOptionChange('validateLinks')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="link-validation" className="ml-3 text-gray-300">
                  Link Validation
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="image-validation"
                  checked={options.validateImages}
                  onChange={() => handleOptionChange('validateImages')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="image-validation" className="ml-3 text-gray-300">
                  Image Validation
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="text-validation"
                  checked={options.validateText}
                  onChange={() => handleOptionChange('validateText')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="text-validation" className="ml-3 text-gray-300">
                  Text Validation
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accessibility"
                  checked={options.validateAccessibility}
                  onChange={() => handleOptionChange('validateAccessibility')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="accessibility" className="ml-3 text-gray-300">
                  Accessibility Audit (axe-core)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="responsive"
                  checked={options.validateResponsive}
                  onChange={() => handleOptionChange('validateResponsive')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="responsive" className="ml-3 text-gray-300">
                  Responsive Testing
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="performance"
                  checked={options.validatePerformance}
                  onChange={() => handleOptionChange('validatePerformance')}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="performance" className="ml-3 text-gray-300">
                  Performance Metrics
                </label>
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Test Devices</h2>
            <p className="text-gray-400 text-sm mb-4">Select devices to test responsive layout</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {defaultDevices.map((device) => (
                <label key={device.name} className={`flex items-center p-3 border rounded-lg hover:bg-gray-800 cursor-pointer transition-colors ${
                  selectedDevices.includes(device.name)
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.name)}
                    onChange={() => handleDeviceToggle(device.name)}
                    className="w-4 h-4 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-white text-sm font-medium">{device.name}</p>
                    <p className="text-gray-400 text-xs">{device.res}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleValidate}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? 'Validating...' : 'Start Validation'}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>

          {/* Execution ID Display */}
          {executionId && (
            <div className="card bg-gray-800">
              <p className="text-gray-400 text-sm mb-1">Current Execution ID:</p>
              <p className="text-green-400 font-mono text-lg break-all">{executionId}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
