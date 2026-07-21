import  express  from  'express' 
import  dotenv from 'dotenv'
 import { connectedDB } from './db/db.js';
  import  cookieParser from 'cookie-parser'
  import  cors from  cors
   import  authRoutes  from './routes/authRoute.js';
dotenv.config();
 
 const app=  express()
  const  PORT =  process.env.PORT ||3000;
   app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
   
   
  app.use(express())
   app.use(cookieParser()) 
    app.use('/api/auth',authRoutes)
  app.get('/', (req, res) => { 
    res.send("Welcome to the Home Page!") 
  }) 
  app.listen(PORT, () => { 
     connectedDB()
    
    console.log("Server started on port 3000") 
  })
