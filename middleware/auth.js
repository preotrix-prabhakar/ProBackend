const dotenv=require("dotenv");
const jwt=require("jsonwebtoken");
dotenv.config();
const authMidlleware=async (req,res,next)=>{
    const token = req.header("Authorization");
    if(!token){
      return  res.status(400).json({message:`acess denied or user is not logged in`});
    }

    try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        req.user=decoded.id;
        if(decoded){
            return res.status(200).json({message:`user verified successfully`,decoded});
        }
        else{
            return res.status(400).json({message:`something went wrong`});
        }
        next();
    } catch (error) {
        console.log(`error verifying user`,error);
    }
}


module.exports=authMidlleware;