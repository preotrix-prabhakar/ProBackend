const express=require("express");
const userModel=require("./models/user");
const mongo=require("./config/mongo")
const authRouter=require("./routes/auth");
const cardRouter=require("./routes/cardRoutes")
const dotenv=require("dotenv");
const app=express();
const cors=require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/card',cardRouter);
app.use('/',authRouter);

app.listen(5000,console.log(`server is running on port 5000`));
