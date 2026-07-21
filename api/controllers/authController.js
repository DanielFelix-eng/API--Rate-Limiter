import  User from  './models/User.js' 
import { generateToken } from '../utils/setCookies.js'
import { welcomeEmail } from '../mail/mail.js'
   
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

  const  token =   await  generateToken(res ,user._id)
 } 
  export  const  verifyEmail =  async (req,res) =>{
     try {
        const  {code} =  req.body
if(!code){
     return res.status(400).json({message:"verification code required" })
}
 const  user =  await User.findOne({
     verificationCode:code , 
      verificationTokenExpire: { $gt: Date.now() },

 }) 
  if(!user)  return res.statu(400).json({messgae : "Invalid or expired  verificationCode"})
 
    user.isVerified = true , 
    user.verificationCode = undefined , 
     user.verificationTokenExpire = undefined , 
     await  user.save()
      try {
        await  welcomeEmail(user.emai , user.name)
      } catch (error) {
        console.error(Error)
      }
     } catch (error) {
        console.error(Error)
     }

     }