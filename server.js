const express=require("express");
const userModel=require("./models/user");
const mongo=require("./config/mongo")
const authRouter=require("./routes/auth");
const cardRouter=require("./routes/cardRoutes")
const shareRoute=require("./routes/shareRoute")
const dotenv=require("dotenv");
const app=express();
const cors=require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/card',cardRouter);
app.use('/',authRouter);
app.use("/share",shareRoute);
PORT=process.env.PORT
app.listen(PORT,console.log(`server is running on port ${PORT}`));
