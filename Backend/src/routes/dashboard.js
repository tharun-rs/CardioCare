const express = require('express');
const router = express.Router();
const collection = require("../config");
const { activeSession, activeAdmin, activeMedic } = require('../sessionAuth');

router.get('/', activeSession, (req,res) => {
    const name = req.session.name;
    const email = req.session.email;
    switch(req.session.type){
        case 'user':
            res.render('user_dashboard',{name: name, email: email});
            break;
        case 'medic':
            res.render('medic_dashboard',{name: name, email: email});
            break;
        case 'admin':
            res.render('admin_dashboard',{name: name, email: email});
            break;
    }
});

module.exports = router;