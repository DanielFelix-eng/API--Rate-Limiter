import  User from  './models/User.js'
   
 export  const  signUp =  async  (req, res)=>{ 
     const{email , name , password} =req.body
    if(!email || !password || !name)  return res.status(400).json({message: 'Please provide the required fields'})
         
         const  userAlreadyExists =  await  User.findOne({email})
          if(userAlreadyExists)  return res.status(400).json({message: 'User already exists'})
         

const verificationCode =  Math.floor(
    100000 + Math.random() * 900000
  ).toString()
   const  user =  new  User({email , name , password , verificationCode , 
    verificationTokenExpire: new Date(Date.now() + 3600000),
     
    })
 await user.save()
  try {
    await   sendVerificationEmail(user.email, verificationCode)
  } catch (error) {
    console.error(error)
  } 

 }