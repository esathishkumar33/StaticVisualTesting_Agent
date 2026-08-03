import { Router, Request, Response } from 'express'
import { executionService } from '../services/executionService'
import { reportService } from '../services/reportService'

const router = Router()

// GET /reports - Get all reports
router.get('/', (req: Request, res: Response) => {
  try {
    const { filter = 'all' } = req.query

    const allExecutions = executionService.getAllExecutions()
    console.log(`📊 [Reports API] Total executions in storage: ${allExecutions.length}`)
    
    const filteredExecutions =
      filter === 'completed'
        ? allExecutions.filter((e) => e.status === 'completed')
        : filter === 'failed'
          ? allExecutions.filter((e) => e.status === 'failed')
          : allExecutions

    const response = {
      executions: filteredExecutions.map((e) => ({
        id: e.id,
        status: e.status,
        urls: e.urls,
        startTime: e.startTime,
        endTime: e.endTime,
        duration: e.duration,
        progress: e.progress,
      })),
      total: filteredExecutions.length,
      filter,
    }
    
    console.log(`📊 [Reports API] Returning ${response.executions.length} executions with total=${response.total}`)
    res.json(response)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

// GET /reports/:reportId - Get specific report
router.get('/:reportId', (req: Request, res: Response) => {
  try {
    const { reportId } = req.params

    const execution = executionService.getExecution(reportId)

    if (!execution) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json(execution)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' })
  }
})

// GET /reports/:reportId/download - Download report (HTML/PDF)
router.get('/:reportId/download', (req: Request, res: Response) => {
  try {
    const { reportId } = req.params
    const { format = 'html' } = req.query

    const execution = executionService.getExecution(reportId)

    if (!execution) {
      return res.status(404).json({ error: 'Report not found' })
    }

    if (format === 'html') {
      const htmlReport = reportService.generateHTMLReport(execution)

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="report-${reportId}.html"`)
      res.send(htmlReport)
    } else {
      res.status(400).json({ error: 'Unsupported format. Use html or pdf' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to download report' })
  }
})

// DELETE /reports/:reportId - Delete report
router.delete('/:reportId', (req: Request, res: Response) => {
  try {
    const { reportId } = req.params

    const deleted = executionService.deleteExecution(reportId)

    if (!deleted) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({
      message: 'Report deleted successfully',
      reportId,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report' })
  }
})

export default router
