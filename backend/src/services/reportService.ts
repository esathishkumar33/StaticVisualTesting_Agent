import { Execution } from './executionService'
import { ValidationResult } from '../types/index'

export class ReportService {
  generateHTMLReport(execution: Execution): string {
    const results = execution.results || []
    const passedResults = results.filter((r) => r.status === 'completed').length
    const totalResults = results.length
    const passRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0
    const duration = execution.duration || 0
    const durationSeconds = Math.round(duration / 1000)

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Testing Report - ${execution.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }
    .summary-card.success {
      border-left-color: #10b981;
    }
    .summary-card.warning {
      border-left-color: #f59e0b;
    }
    .summary-card.error {
      border-left-color: #ef4444;
    }
    .summary-card h3 {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .summary-card .value {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }
    .details {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }
    .details h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #333;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    .url-result {
      margin-bottom: 30px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .url-result h3 {
      font-size: 1.2em;
      color: #333;
      margin-bottom: 15px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.85em;
      margin-bottom: 15px;
    }
    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }
    .status-badge.running {
      background: #fef3c7;
      color: #92400e;
    }
    .status-badge.failed {
      background: #fee2e2;
      color: #991b1b;
    }
    .validation-section {
      margin: 20px 0;
    }
    .validation-section h4 {
      font-size: 1.1em;
      color: #555;
      margin-bottom: 10px;
    }
    .stats {
      display: flex;
      gap: 15px;
      margin: 10px 0;
      flex-wrap: wrap;
    }
    .stat {
      padding: 8px 15px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      font-size: 0.9em;
    }
    .stat.success {
      color: #10b981;
      font-weight: bold;
    }
    .stat.error {
      color: #ef4444;
      font-weight: bold;
    }
    footer {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
      margin-top: 30px;
      border-top: 1px solid #e5e7eb;
    }
    .timestamp {
      color: #999;
      font-size: 0.9em;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Visual Testing Report</h1>
      <p>Execution ID: <code>${execution.id}</code></p>
    </header>

    <div class="summary">
      <div class="summary-card ${passRate >= 80 ? 'success' : passRate >= 50 ? 'warning' : 'error'}">
        <h3>Pass Rate</h3>
        <div class="value">${passRate}%</div>
      </div>
      <div class="summary-card">
        <h3>URLs Tested</h3>
        <div class="value">${execution.urls.length}</div>
      </div>
      <div class="summary-card">
        <h3>Duration</h3>
        <div class="value">${durationSeconds}s</div>
      </div>
      <div class="summary-card">
        <h3>Status</h3>
        <div class="value" style="font-size: 1.5em;">${execution.status === 'completed' ? '✓' : '✗'}</div>
      </div>
    </div>

    <div class="details">
      <h2>Validation Details</h2>
      ${
        execution.urls.length > 0
          ? execution.urls
              .map((url, idx) => {
                const result = results[idx]
                return `
        <div class="url-result">
          <h3>${url}</h3>
          <span class="status-badge ${result?.status || 'running'}">
            ${result?.status ? result.status.toUpperCase() : 'RUNNING'}
          </span>
          ${
            result
              ? `
            <div class="validation-section">
              <h4>UI Components</h4>
              <div class="stats">
                <div class="stat success">Passed: ${result.results.ui.passed}</div>
                <div class="stat error">Failed: ${result.results.ui.failed}</div>
                <div class="stat">Total: ${result.results.ui.total}</div>
              </div>
            </div>
            <div class="validation-section">
              <h4>Links</h4>
              <div class="stats">
                <div class="stat success">Valid: ${result.results.links.valid}</div>
                <div class="stat error">Broken: ${result.results.links.broken}</div>
                <div class="stat">Total: ${result.results.links.total}</div>
              </div>
            </div>
            <div class="validation-section">
              <h4>Images</h4>
              <div class="stats">
                <div class="stat success">Valid: ${result.results.images.valid}</div>
                <div class="stat error">Broken: ${result.results.images.broken}</div>
                <div class="stat">Total: ${result.results.images.total}</div>
              </div>
            </div>
            <div class="validation-section">
              <h4>Accessibility</h4>
              <div class="stats">
                <div class="stat error">Violations: ${result.results.accessibility.violations}</div>
                <div class="stat success">Passes: ${result.results.accessibility.passes}</div>
              </div>
            </div>
          `
              : '<p style="color: #999;">Validation in progress...</p>'
          }
        </div>
        `
              })
              .join('')
          : '<p>No URLs to validate</p>'
      }
    </div>

    <footer>
      <p>Generated: ${new Date(execution.startTime).toLocaleString()}</p>
      <div class="timestamp">
        Start: ${new Date(execution.startTime).toLocaleString()}
        ${execution.endTime ? ` | End: ${new Date(execution.endTime).toLocaleString()}` : ''}
      </div>
    </footer>
  </div>
</body>
</html>
    `.trim()
  }
}

export const reportService = new ReportService()
