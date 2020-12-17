//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
app.use(express.static("publoc"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));



mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});


const users = mongoose.model("user", userSchema);

app.get("/", (req,res) =>{
    res.render("home");
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});
app.post("/register", (req, res)=>{
    const user = new users({
        email: req.body.username,
        password: req.body.password
    });
    user.save((err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.render("secrets");
        }
    })
})

app.post("/login", (req, res)=>{
    users.findOne({email: req.body.username}, (err,result)=>{
        if(err){
            res.send(err);
        }
        if(result){
            if(result.password === req.body.password){
                res.render("secrets");
            }
            else{
                res.redirect("/login");
            }
        }
        else{
            res.status(404).redirect("/login");
        }
    });
})





app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});