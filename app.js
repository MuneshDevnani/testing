const express = require("express")
const app = express()
const mongoose = require ('mongoose')
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/task2',{useNewUrlParser: true},()=>{
    console.log("mongodb connected");
})

require('./models/user')

app.use(express.json())

app.use(require('./routes/user'));

app.listen(PORT,()=>{
    console.log("serving on port", PORT);
})
