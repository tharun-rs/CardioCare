const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {collection, _ } = require("../config");


//render page
router.get('/', (req,res) => {
    if(req.session.name){
        res.redirect('/dashboard');
    }
    else{
        res.render('login', {message: null});
    }
});

//login form submit
router.post('/', async (req, res) => {
    try {
        if(req.session.name){
            res.redirect('/dashboard');
        }
        const checkExisting = await collection.findOne({email: req.body.email});
        if(!checkExisting){
            res.render('login', {message: 'User not found'});
        }
        else{
            const passMatch = await bcrypt.compare(req.body.pwd, checkExisting.password);
            if(passMatch){
                req.session.name = checkExisting.fname + ' ' + checkExisting.lname;
                req.session.type = checkExisting.usertype;
                req.session.email = checkExisting.email;
                res.redirect('/dashboard');
            }
            else{
                res.render('login', {message: 'Wrong password'});
            }
        }
    } catch (error) {
        console.log(error);
        res.render('login', {message: 'Unknown Error. Try again'});
    }
});


module.exports = router;