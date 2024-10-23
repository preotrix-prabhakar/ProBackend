const express=require("express");
const userModel=require("./models/user");
const mongo=require("./config/mongo")
const authRouter=require("./routes/auth");
const cardRouter=require("./routes/cardRoutes")
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/card',cardRouter);

app.listen(3000,console.log(`server is running on port 3000`));
