const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const taskSchema=require("./task");

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
  
  module.exports = mongoose.model('card', cardSchema);
  