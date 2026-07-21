import  jwt  from  'jsonwebtoken';
export  const  generateToken =  async(res, userId) =>{
    if(!process.env.JWT_SECRET){
        return res.status(401).json({message:"No JWT secret found"});
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie(
         'token'  ,token , {         
                httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             sameSite:  'lax' , 
             
          }
    )
    return token;
}
  