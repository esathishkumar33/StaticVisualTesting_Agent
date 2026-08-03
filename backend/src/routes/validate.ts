import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { executionService } from '../services/executionService'
import { UIValidator } from '../validators/ui-validator'
import { ValidationRequest, ValidationResult } from '../types/index'

const router = Router()

// Function to run validation asynchronously
async function runValidation(executionId: string, urls: string[], options: any): Promise<void> {
  try {
    executionService.updateExecutionStatus(executionId, 'running', 0)

    const uiValidator = new UIValidator()
    await uiValidator.initialize()

    const results: ValidationResult[] = []
    const urlCount = urls.length

    for (let idx = 0; idx < urlCount; idx++) {
      const url = urls[idx]
      const progress = Math.round((idx / urlCount) * 100)

      executionService.updateExecutionStatus(executionId, 'running', progress, url)

      try {
        // Run UI validation if enabled
        let uiResult = undefined
        if (options.validateUI) {
          uiResult = await uiValidator.validateURL(url)
        }

        const result: ValidationResult = {
          id: `result_${idx}`,
          url,
          status: 'completed',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: 5000, // Placeholder
          results: {
            ui: uiResult || { total: 0, passed: 0, failed: 0, components: [] },
            links: {
              total: 0,
              valid: 0,
              broken: 0,
              links: [],
            },
            images: {
              total: 0,
              valid: 0,
              broken: 0,
              images: [],
            },
            accessibility: {
              violations: 0,
              passes: 0,
              incomplete: 0,
              issues: [],
            },
            responsive: {
              devices: [],
            },
          },
          screenshots: [],
          errors: [],
        }

        results.push(result)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        executionService.addError(executionId, `Error validating ${url}: ${errorMessage}`)

        results.push({
          id: `result_${idx}`,
          url,
          status: 'failed',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          duration: 0,
          results: {
            ui: { total: 0, passed: 0, failed: 0, components: [] },
            links: { total: 0, valid: 0, broken: 0, links: [] },
            images: { total: 0, valid: 0, broken: 0, images: [] },
            accessibility: { violations: 0, passes: 0, incomplete: 0, issues: [] },
            responsive: { devices: [] },
          },
          screenshots: [],
          errors: [errorMessage],
        })
      }
    }

    await uiValidator.close()

    executionService.setResults(executionId, results)
    executionService.updateExecutionStatus(executionId, 'completed', 100)

    console.log(`✓ Validation completed for execution ${executionId}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    executionService.addError(executionId, errorMessage)
    executionService.updateExecutionStatus(executionId, 'failed', 0)
    console.error(`✗ Validation failed for execution ${executionId}:`, error)
  }
}

// POST /validate - Start validation
router.post('/', (req: Request, res: Response) => {
  try {
    const { urls, options } = req.body as ValidationRequest

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array is required' })
    }

    // Validate URLs format
    const validUrls = urls.filter((url) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    })

    if (validUrls.length === 0) {
      return res.status(400).json({ error: 'No valid URLs provided' })
    }

    // Validate options
    if (!options || typeof options !== 'object') {
      return res.status(400).json({ error: 'Options object is required' })
    }

    const executionId = `exec_${uuidv4()}`

    // Create execution
    const execution = executionService.createExecution(executionId, validUrls, options)

    // Start async validation (don't await)
    runValidation(executionId, validUrls, options).catch((error) => {
      console.error(`Error in background validation for ${executionId}:`, error)
    })

    console.log(`✓ Validation started for ${validUrls.length} URL(s)`)
    console.log(`✓ Execution ID: ${executionId}`)

    res.json({
      message: 'Validation started successfully',
      executionId,
      urls: validUrls,
      options,
      status: 'pending',
    })
  } catch (error) {
    console.error('Validation error:', error)
    res.status(500).json({ error: 'Validation failed' })
  }
})

// POST /validate/bulk - Bulk validation from file
router.post('/bulk', (req: Request, res: Response) => {
  try {
    res.json({ message: 'Bulk validation endpoint' })
  } catch (error) {
    res.status(500).json({ error: 'Bulk validation failed' })
  }
})

// GET /validate/:executionId - Get validation status/result
router.get('/:executionId', (req: Request, res: Response) => {
  try {
    const { executionId } = req.params

    const execution = executionService.getExecution(executionId)

    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' })
    }

    res.json(execution)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get validation result' })
  }
})

// GET /validate - Get all executions
router.get('/', (req: Request, res: Response) => {
  try {
    const executions = executionService.getAllExecutions()
    res.json({
      executions,
      total: executions.length,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get executions' })
  }
})

export default router
