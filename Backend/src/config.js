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
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    usertype: {type: String, required: true}
});


const patientDiagnosisSchema = new mongoose.Schema({
    userid: {type: String, required: true},
    image: { type: String, required: true },
    predClass: { type: String, required: true },
    verified: {type: Boolean, required: true},
    newPred: {type: String, required: false},
    opinionReq: {type: Boolean, required: true},
    createdAt: { type: Date, default: Date.now }
});

//Collection model
const collection = new mongoose.model("user", loginSchema);
const diagnosisCollection = new mongoose.model("diagnosis", patientDiagnosisSchema);


module.exports = {collection, diagnosisCollection};