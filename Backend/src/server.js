require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const collection = require("./config");

//routes
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const dashboardRoutes = require('./routes/dashboard');

//express app
const app = express();
app.set('view engine','ejs');



//middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) =>{
    console.log(`${req.ip} requested : ${req.path} - ${req.method}`);
    next();
});     //for logging

app.use(express.static('public'));  //for setting template directory

app.use(express.json());            //converting to json for api endpoints

app.use(express.urlencoded({extended: false}));     //converting to json for html forms



//routing 
//index
app.get('/', (req, res) => {
    res.render("index");
});

//login
app.use('/login', loginRoutes);

//signup 
app.use('/signup', signupRoutes);

//dashboard
app.use('/dashboard', dashboardRoutes);

//logout
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        // Redirect the user to the login page or any other desired route
        res.redirect('/login');
    });
});





//listen for requests
app.listen(process.env.PORT,() => {
    console.log(`Server running on ${process.env.PORT}`);
});