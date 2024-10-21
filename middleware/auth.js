const dotenv=require("dotenv");
const jwt=require("jsonwebtoken");
dotenv.config();
const authMidlleware=async (req,res,next)=>{
    const token = req.header("Authorization");
    if(!token){
        res.status(400).json({message:`acess denied or token not provided`});
    }

    try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
    } catch (error) {
        
    }
}

module.exports=authMidlleware;