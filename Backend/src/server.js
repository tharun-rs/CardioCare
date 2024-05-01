require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');


//routes
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const dashboardRoutes = require('./routes/dashboard');
const logoutRoutes = require('./routes/logout')

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
app.use('/logout', logoutRoutes);





//listen for requests
app.listen(process.env.PORT,() => {
    console.log(`Server running on ${process.env.PORT}`);
});