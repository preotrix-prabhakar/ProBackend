const mongoose=require("mongosse");
const Schema=mongoose.Schema;

const taskSchema=new Schema({
    task:{
        type:String,
        required:true,
    },
    isChecked:{
        type:Boolean,
        default: false,
    },
    

});
module.exports=mongoose.model('task',taskSchema);