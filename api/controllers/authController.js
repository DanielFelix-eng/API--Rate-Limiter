import  User from  './models/User.js' 
import { generateToken } from '../utils/setCookies.js'
import { sendVerificationEmail, welcomeEmail } from '../mail/mail.js'
   
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
     //forgotpassword password  logic
      export  const  forgotPassword  = async (req,res) =>{
         const  {email} =req.body 
          if(!email)
             return res.status(400).json({message: "email required" })
             const user =  await User.findOne({email})
              if(!user) return res.json({message: "user does not exist"})
                  const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
      user.resetPasswordToken = resetTokenHash
            user.resetPasswordTokenExpire = new Date(Date.now() + 3600000)
             const resUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
            await user.save()
            try {
              await sendResetPasswordEmail(user.email, resUrl)
            } catch (error) {
              console.error(error)
            }
            res.json({message: "password reset email sent"})
      }
      //resend verification email logic
       export const resendVerificationEmail =  async (req,res) =>{
         const {email} = req.body 
          if(!email){
             return res.status(400).json({message:"email required" })
          }
           const  user =  await User.findOne({email})
            if(user.isVerified) {
                 return  res.status(401).json({message:'email already verified '})
            }
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    user.verificationToken = verificationToken
    user.verificationTokenExpire = new Date(Date.now() + 3600000)
     try {
        await sendVerificationEmail(user.email , verificationToken)
     } catch (error) {

        console.error(error)
     }     
       }
              //resetPassword logic
               export  const  resetPassword =  async (req,res) =>{
                 const {token , password ,confirmPassword}
 if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Token, password, and confirm password are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: 'Password reset successful' })
                   
               }
                //login
                 export const  login = async(req,res) =>{
                     const {email  , password} =req.body 
                    if(!email || !password){ 
                        return  res.status(400).json({message: 'All fields required'})
                    }
                     const  user =   User.findOne({email}).select('+password')
                      if(!user) return res.status(400).json({message:'Invalid credeantils'})
                 const isMatch  =  await  compare(password, user.password)
                if(!isMatch) return res.status(400).json({message:'Invalid credeantils'})
                 if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' })
    }

    generateToken(res, user._id)
    user.lastlogin = new Date()
    await user.save()

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
                 }},) 
                     }
                 

                    // logout
                     export const logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

 export const googleAuth = async (req, res) => {
  try {
    const { email, name, uid, photoURL } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    let user = await User.findOne({ email })

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        name: name || 'User',
        googleId: uid,
        profilePicture: photoURL,
        isVerified: true, // Google users are pre-verified
        password: undefined,
      })
      await user.save()
    } else {
      // Update existing user with Google ID if not already set
      if (!user.googleId) {
        user.googleId = uid
      }
      user.lastlogin = new Date()
      await user.save()
    }

    const token = generateToken(res, user._id)

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: { ...user._doc, password: undefined },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
  export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'user not found' })
    }
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
   
