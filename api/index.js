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

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ],
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

// API routes
app.use('/api', authRoutes)
app.use('/api', checkRoute)
app.use('/api', keyRoute)

// Test route
app.get('/', (req, res) => {
  res.send('Server is working 🚀')
})

// Serve React/Vite frontend
const clientPath = path.join(__dirname, '../client/dist')

app.use(express.static(clientPath))

// React Router fallback
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

// Start server
app.listen(PORT, async () => {
  try {
    await connectedDB()
    console.log(`Server started on port ${PORT}`)
  } catch (error) {
    console.error('Database connection failed:', error)
  }
})