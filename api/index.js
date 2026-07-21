import  express  from  'express' 
import  dotenv from 'dotenv'
dotenv.config();
 
 const app=  express()
  const  PORT =  process.env.PORT ||3000;
   
   
  app.use(express()) 
  app.get('/', (req, res) => { 
    res.send("Welcome to the Home Page!") 
  }) 
  app.listen(PORT, () => { 
    
    console.log("Server started on port 3000") 
  })
