const express=require("express");
const router=express.Router();
const {Card,Task}=require("../models/card");

router.get('/',async(req,res)=>{
    const data=await Card.find();
    res.json(data);
})
router.post('/',async(req,res)=>{
try {
    const {userId,title,tasks,dueDate,status,priority}=req.body;
    let newTasks=[];
    if(!title || !tasks){
        return res.status(400).json({message:'bad request'});
    }
    tasks.forEach((taskObj)=>{
        const { desc, isChecked } = taskObj;
        if (!desc) {
            return res.status(400).json({ message: 'Bad request: Each desc must have a "desc" description' });
        }
        const newTask=new Task({desc,isChecked});
        newTasks.push(newTask);
    }) 

    let newCard=new Card({
       userId, title,tasks:newTasks,dueDate,status,priority
    })
    await newCard.save();
    res.status(200).json(newCard);
} catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ message: "Internal server error" });
} 
  
})
router.put('/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const {title,tasks,dueDate,status,priority}=req.body;
    } catch (error) {
        
    }
})
module.exports=router;