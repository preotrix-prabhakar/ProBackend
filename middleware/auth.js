const dotenv=require("dotenv");
const jwt=require("jsonwebtoken");
dotenv.config();
const authMidlleware=async (req,res,next)=>{
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
      return  res.status(400).json({message:`acess denied or user is not logged in`});
    }

    try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        req.user=decoded;
        next();
    } catch (error) {
        console.log(`error verifying user`,error);
        return res.status(403).json({message:`Invalid token`});
    }
}


module.exports=authMidlleware;