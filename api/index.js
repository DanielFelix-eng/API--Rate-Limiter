import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectedDB } from './db/db.js'
import authRoutes from './routes/authRoute.js'
import checkRoute from './routes/checkRoutes.js'
import keyRoute from './routes/keyRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.static(path.join(__dirname, "../client/dist"))
)

app.use(express.json())
app.use(cookieParser())

app.get('*', (req, res) => {

  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
}
)
app.use('/api', authRoutes)
app.use('/api', checkRoute)
app.use('/api', keyRoute)

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!')
})

app.listen(PORT, () => {
  connectedDB()
  console.log(`Server started on port ${PORT}`)
})