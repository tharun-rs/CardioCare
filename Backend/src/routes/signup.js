const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {collection, _} = require("../config");


//load page using get method
router.get('/', (req,res) => {
    res.render("signup", {message: null});
});

//submit form using post method
router.post('/', async (req, res) => {
    const data = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.pwd,
        usertype: 'user'
    };

    //check whether user already exists
    const existingUser = await collection.findOne({email: data.email});

    if(existingUser){
        res.render("signup", {message: "User already exists"});
    }
    else{
        const saltRounds = 10; //number of salting rounds for bcrypt
        const hash = await bcrypt.hash(data.password, saltRounds);
        data.password = hash;

        const userdata = await collection.insertMany(data);
        console.log('New User created');
        res.redirect('/login');
    }
});

module.exports = router;