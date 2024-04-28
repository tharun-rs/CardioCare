require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const collection = require("./config");
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');

//routes
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const dashboardRoutes = require('./routes/dashboard');

//express app
const app = express();
const upload = multer();
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

//user upload
app.post('/user/upload', upload.single('ecg'), async (req, res) => {
    try {
        const apiUrl = 'http://127.0.0.1:5000/predict';
        
        const formData = new FormData();
        formData.append('file', req.file.buffer, { filename: req.file.originalname });

        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        res.send(response.data);
    } catch (error) {
        console.error('Error:', error);
        setTimeout(() => {
            res.status(500).json({ error: "Couldn't connect to predictor, Try again later!" });
        }, 2000); // Adjust the delay time as needed
    }
});





//listen for requests
app.listen(process.env.PORT,() => {
    console.log(`Server running on ${process.env.PORT}`);
});