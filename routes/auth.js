const express=require("express");
const userModel=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const router=express.Router()
const authMidlleware=require("../middleware/auth")
dotenv.config();

router.get('/',(req,res)=>{
    res.json("hello");
})
router.post('/register',async (req,res)=>{
    const {email,name,password}=req.body;
    if(!email || !password || !name){
        console.log(`enter all fileds this`);
    }
    // if(confirmPassword!=password){
    //     return res.status(400).json({message:`password and confirm password can't be different`})
    // }
    console.log(email);
    let already=await userModel.findOne({email:email});
    if(already){
        console.log(`user already exists`);
        res.status(400).json({message:`user alreasy exists`});
    }

    const hashedPassword= await bcrypt.hash(password,10);
    const newUser=new userModel({  
        name:name, 
        email:email,
        password:hashedPassword,
        confirmPassword:password
    })
    const user=await newUser.save()
    res.status(200).json({user});
    console.log(user); 
 
})
router.get('/checkRoute', authMidlleware, (req, res) => {
    res.json({ message: "This is a protected route",  user: {
        id: req.user.id,
        email: req.user.email
    }});
}); 
router.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    if(!(email || password)){return res.status(400).json({message:`both fields are necessary`})}
    const user=await userModel.findOne({email:email});
    if(!user){
        return res.status(400).json({message:`user not found`});
    }
    let validPass=await bcrypt.compare(password,user.password);

    if(!validPass){
        res.status(401).json({message:`invalid credentials`});
    }
    let token = await jwt.sign({id: user.id}, process.env.SECRET_KEY);
    res.header('Authorization', `Bearer ${token}`).json({
        message: 'Logged in successfully',
        token: token
    });
    console.log(validPass);
    console.log(token);
}) 
router.patch('/update/password',authMidlleware,async (req,res)=>{
    try {
        const {newPassword,oldPassword}=req.body;
        if(!newPassword || !oldPassword){
            return res.status(400).json({message:"Bad Request"});
        }
        const userId=req.user.id;
        const userDetails=await userModel.findOne({_id:userId});
        console.log(userDetails.password,oldPassword,newPassword);

        let isCorrectPass= await bcrypt.compare(oldPassword,userDetails.password);
        console.log("asdf",isCorrectPass);
        
        if(!isCorrectPass){return res.json({error:"invalid credentials"})}

        let newHashedPass=await bcrypt.hash(newPassword,10);

        await userModel.updateOne({_id:userId},{$set:{password:newHashedPass}});
        res.status(200).json({message:'password reset successfullly'});
    } catch (error) {
     console.log(error);
     res.status(500).json({message:"Internal server Error"});   
    } 
})
router.patch('/update/name',authMidlleware,async (req,res)=>{

        try{
          let {name}=req.body;
          if(!name){
            return res.status(400).json({ error: "bad request" });
          }
          const userId = req.user.id;
          await userModel.updateOne(
            { _id: userId },
            { $set: { name } }
          );
      
          res.status(200).json({message:"name set successfully"});
      
        }
        catch(error){
          console.log(error);
        }

})

module.exports=router;
// $2b$10$ul9F0I8Uf04rAMOymu75Ie4DZeld.mjxWwHKOpLa9r8ROn90cP6ca  