import  express  from 'express'
 import { signUp, login , verifyEmail , resetPassword, googleAuth , forgotPassword, logout } from '../controllers/authController.js'
  import { verifyToken } from '../middleware/verifyToken.js'
 const  router  =  express.Router(
     
 )
   router.post('/signUp', signUp)
  router.post('/login', login)
  router.post('/verifyEmail', verifyEmail)
  router.post('/resetPassword', resetPassword)
  router.post('/googleAuth', googleAuth)
  router.post('/forgotPassword', forgotPassword)
  router.post('/logout', logout)
  
  export default router
