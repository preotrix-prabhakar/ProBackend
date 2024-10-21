const express=require("express");
const userModel=require("./models/user");
const mongo=require("./config/mongo")
const authRouter=require("./routes/auth");
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRouter);

app.listen(3000,console.log(`server is running on port 3000`));
