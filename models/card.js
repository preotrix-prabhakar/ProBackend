const mongoose=require("mongoose");
const Schema=mongoose.Schema;
// const taskSchema=require("./task");

const taskSchema=new Schema({
    desc:{
        type:String,
        required:true,
    },
    isChecked:{
        type:Boolean,
        default: false,
    },
})
const cardSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    tasks:{
      type:[taskSchema],
      require:true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type:String,
      default:'toDo'      
    },
    priority: {
      type:String,
      required:true,
      default:'low',
      enum: ['low', 'medium', 'high'],
    },
    userId: {
      type:mongoose.Types.ObjectId,
      required:true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });
  
module.exports = {
    Card: mongoose.model('Card', cardSchema), 
    Task: mongoose.model('Task', taskSchema)
};