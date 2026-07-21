import  express  from  'express' 
import  dotenv from 'dotenv'
 import { connectedDB } from './db/db.js';
dotenv.config();
 
 const app=  express()
  const  PORT =  process.env.PORT ||3000;
   
   
  app.use(express()) 
  app.get('/', (req, res) => { 
    res.send("Welcome to the Home Page!") 
  }) 
  app.listen(PORT, () => { 
     connectedDB()
    
    console.log("Server started on port 3000") 
  })
