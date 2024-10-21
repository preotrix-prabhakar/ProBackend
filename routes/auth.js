const express=require("express");
const userModel=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const router=express.Router()

dotenv.config();

router.get('/',(req,res)=>{
    res.json("hello");
})
router.post('/register',async (req,res)=>{
    const {email,name,password}=req.body;
    if(!email || !password || !name){
        console.log(`enter all fileds`);
    }
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
        // password:password,
        password:hashedPassword
    })
    const token=jwt.sign({userId:newUser._id},process.env.SECRET_KEY)
    const user=await newUser.save()
       
    res.status(200).json({token:token});
    console.log(user);

})

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
    res.json(user) 
    console.log(validPass);
})
module.exports=router;
// $2b$10$ul9F0I8Uf04rAMOymu75Ie4DZeld.mjxWwHKOpLa9r8ROn90cP6ca  