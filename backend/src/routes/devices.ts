import { Router, Request, Response } from 'express'
import type { Device } from '../types'

const router = Router()

// Default test devices
const DEFAULT_DEVICES: Device[] = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Laptop', width: 1440, height: 900 },
  { name: 'Large Tablet', width: 1366, height: 768 },
  { name: 'Tablet', width: 1024, height: 768 },
  { name: 'iPad', width: 820, height: 1180 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Large Mobile', width: 430, height: 932 },
  { name: 'Mobile', width: 390, height: 844 },
  { name: 'iPhone 12', width: 375, height: 812 },
  { name: 'Small Mobile', width: 360, height: 800 },
]

// GET /devices - Get all available devices
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      devices: DEFAULT_DEVICES,
      total: DEFAULT_DEVICES.length,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' })
  }
})

// GET /devices/:name - Get specific device
router.get('/:name', (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const device = DEFAULT_DEVICES.find(d => d.name.toLowerCase() === name.toLowerCase())

    if (!device) {
      return res.status(404).json({ error: 'Device not found' })
    }

    res.json(device)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device' })
  }
})

export default router
