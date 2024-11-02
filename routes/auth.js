const express=require("express");
const userModel=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const router=express.Router()
const authMidlleware=require("../middleware/auth")
dotenv.config();
const jwtKey=process.env.SECRET_KEY;
router.get('/',(req,res)=>{
    res.json("hello from backend");
})

router.post('/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email || !password || !name) {
            console.log(`Enter all fields`);
            return res.status(400).json({ message: 'Please enter all required fields.' });
        }

        // if (!emailPattern.test(email)) {
        //     console.log(`Invalid email format`);
        //     return res.status(400).json({ message: 'Invalid email format.' });
        // }

        let already = await userModel.findOne({ email: email });
        if (already) {
            console.log(`User already exists`);
            return res.status(400).json({ message: `User already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        
        let token = await jwt.sign({ userId: user._id }, jwtKey, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token: token
        });

        console.log(user.name, token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/checkRoute', authMidlleware, (req, res) => {
    res.json({ message: "This is a protected route",  user: {
        id: req.user.id,
        email: req.user.email
    }});
}); 
router.post('/',async (req,res)=>{
    try {
        const {email,password}=req.body;
    if(!(email || password)){return res.status(400).json({message:`both fields are necessary`})}
    
    const user=await userModel.findOne({email:email});
    if(!user){
        return res.status(400).json({message:`invalid credentials`});
    }
    let validPass=await bcrypt.compare(password,user.password);

    if(!validPass){
        res.status(401).json({message:`invalid credentials`});
    }
    let token = await jwt.sign({id: user.id}, jwtKey);
    res.header('Authorization', `Bearer ${token}`).json({
        message: 'Logged in successfully',
        token: token
    });
    console.log(validPass);
    console.log(token);
    } catch (error) {
    console.log(error);
    }
    
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