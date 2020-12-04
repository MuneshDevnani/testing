const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res)=>{
    const {username, email, password,profilepic} = req.body
    if(!email || !password || !username){
       return res.status(422).json({error: "please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=> {
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password:hashedpassword,
                username,
                profilepic
            })
    
            user.save()
            .then(user=> {
                res.json({message: "saved successfully"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
        
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/signin', (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add Email or Password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
          return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
            const token = jwt.sign({_id:savedUser._id},'munesh')
            const {_id,name,email,profilepic} =savedUser
            res.json({token,user:{_id,name,email,profilepic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })

})
module.exports= router