export interface ValidationRequest {
  urls: string[]
  options: ValidationOptions
}

export interface ValidationOptions {
  validateUI: boolean
  validateLinks: boolean
  validateImages: boolean
  validateText: boolean
  validateResponsive: boolean
  validateAccessibility: boolean
  validatePerformance: boolean
  devices: string[]
}

export interface ValidationResult {
  id: string
  url: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: string
  endTime?: string
  duration?: number
  results: {
    ui: UIValidationResult
    links: LinkValidationResult
    images: ImageValidationResult
    accessibility: AccessibilityResult
    responsive: ResponsiveResult
    performance?: PerformanceResult
  }
  screenshots: ScreenshotInfo[]
  errors: string[]
}

export interface UIValidationResult {
  total: number
  passed: number
  failed: number
  components: ComponentResult[]
}

export interface ComponentResult {
  type: string
  selector: string
  status: 'pass' | 'fail'
  visible: boolean
  enabled: boolean
  clickable: boolean
  issues: string[]
}

export interface LinkValidationResult {
  total: number
  valid: number
  broken: number
  links: LinkResult[]
}

export interface LinkResult {
  url: string
  status: number
  text: string
  type: 'internal' | 'external'
  valid: boolean
}

export interface ImageValidationResult {
  total: number
  valid: number
  broken: number
  images: ImageResult[]
}

export interface ImageResult {
  src: string
  alt: string
  loaded: boolean
  dimensions?: { width: number; height: number }
  issues: string[]
}

export interface AccessibilityResult {
  violations: number
  passes: number
  incomplete: number
  issues: AccessibilityIssue[]
}

export interface AccessibilityIssue {
  id: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  description: string
  nodes: number
}

export interface ResponsiveResult {
  devices: DeviceResult[]
}

export interface DeviceResult {
  name: string
  resolution: string
  status: 'pass' | 'fail'
  issues: string[]
  screenshot?: string
}

export interface PerformanceResult {
  fcp: number
  lcp: number
  cls: number
  tti: number
  pageLoadTime: number
  memoryUsage: number
}

export interface ScreenshotInfo {
  path: string
  device: string
  timestamp: string
  size: number
}

export interface Report {
  id: string
  executionId: string
  title: string
  url: string
  generatedAt: string
  summary: ReportSummary
  format: 'html' | 'pdf'
  path: string
}

export interface ReportSummary {
  totalTests: number
  passed: number
  failed: number
  passRate: number
  duration: number
  device: string
  browser: string
}

export interface Device {
  name: string
  width: number
  height: number
  deviceScaleFactor?: number
  userAgent?: string
}
