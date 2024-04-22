require('dotenv').config();
const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.CONNECTION_STRING);


//log connection
connect.then( () => {
    console.log("Database connected!!")
})
.catch( (err) => {
    console.log("Database connection failed!!",err)
});

//create schema
const loginSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    }
});

//Collection model
const collection = new mongoose.model("user", loginSchema);


module.exports = collection;