import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectedDB } from './db/db.js'
import authRoutes from './routes/authRoute.js'
import checkRoute from './routes/checkRoutes.js'
import keyRoute from './routes/keyRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://api-rate-limiter-production-cd85.up.railway.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean)

console.log('Allowed CORS origins:', allowedOrigins)

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Health check endpoint (for Railway)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api', authRoutes)
app.use('/api', checkRoute)
app.use('/api', keyRoute)

// Frontend location
const clientPath = path.join(__dirname, '../client/dist')

console.log('Frontend path:', clientPath)

// Serve frontend files
app.use(express.static(clientPath))

// Serve React app (catch-all for SPA)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`)

  try {
    await connectedDB()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
  }
})