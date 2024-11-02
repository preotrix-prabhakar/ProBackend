const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();


const mongo= mongoose.connect(process.env.CONNETCTION_STRING)
.then(() => console.log("MongoDB connection successful"))
.catch((error) => {
  console.error("MongoDB connection error:", error);
});

module.exports=mongo;