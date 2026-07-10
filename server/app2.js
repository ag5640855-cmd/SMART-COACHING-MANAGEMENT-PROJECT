require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");

const studentRoute = require("./routes/studentAuth");

app.use("/api/student-auth",studentRoute);

app.get("/",(req,res)=>{
    res.send("Server Running");
});

app.listen(process.env.PORT,()=>{

    console.log("Server Started");

});