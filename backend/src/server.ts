import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import validateRouter from './routes/validate'
import reportRouter from './routes/reports'
import deviceRouter from './routes/devices'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/validate', validateRouter)
app.use('/reports', reportRouter)
app.use('/devices', deviceRouter)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`)
  console.log(`✓ Frontend should be available on http://localhost:5173`)
})

export default app
