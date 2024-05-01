const express = require('express');
const router = express.Router();
const {_, diagnosisCollection} = require("../config");
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { activeSession, activeUser, activeAdmin, activeMedic } = require('../sessionAuth');


const upload = multer();

router.get('/', activeSession, (req,res) => {
    const name = req.session.name;
    const email = req.session.email;
    switch(req.session.type){
        case 'user':
            res.render('user_dashboard',{name: name, email: email, page: 'new'});
            break;
        case 'medic':
            res.render('medic_dashboard',{name: name, email: email});
            break;
        case 'admin':
            res.render('admin_dashboard',{name: name, email: email});
            break;
    }
});


async function savePatientDiagnosis(imageBuffer, predClass, userID){
    try {
        const filename = `${userID}_${Date.now()}.jpg`; // You can use any suitable filename format
        // Specify the directory where you want to save the image file
        const uploadDir = path.join(__dirname, 'diagnose_ecg'); // Change 'uploads' to your desired directory
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // Write the image buffer to the file system
        const imagePath = path.join(uploadDir, filename);
        fs.writeFileSync(imagePath, imageBuffer);

        const newDiagnosis = new diagnosisCollection({
            userid: userID,
            image: filename,
            predClass: predClass,
            verified: false,
            opinionReq: false,
            createdAt: new Date()
        });

        // Save the patient diagnosis to the database
        await newDiagnosis.save();
        
        console.log("Patient diagnosis saved successfully!");
    } catch (error) {
        console.error('Error saving patient diagnosis:', error);
    }
}

router.post('/upload', activeUser, upload.single('ecg'), async (req, res) => {
    try {
        const apiUrl = 'http://127.0.0.1:5000/predict';
        const userID = req.session.email;
        const formData = new FormData();
        formData.append('file', req.file.buffer, { filename: req.file.originalname });
        const saveDiagnosis = req.body.save === 'save';
        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        if(saveDiagnosis){
            savePatientDiagnosis(req.file.buffer, response.data.class, userID);
        }
        res.send(response.data);
    } catch (error) {
        console.error('Error:', error);
        setTimeout(() => {
            res.status(500).json({ error: "Couldn't connect to predictor, Try again later!" });
        }, 2000); // Adjust the delay time as needed
    }
});


router.get('/history', activeUser, async (req, res) => {
    try {
        const name = req.session.name;
        const email = req.session.email;

        // Query patient diagnoses matching the userID equal email
        const diagnoses = await diagnosisCollection.find({ userid: email });

        // Render the user_dashboard EJS template and pass the queried data
        res.render('user_dashboard', { name: name, email: email, page: 'history', diagnoses: diagnoses });
    } catch (error) {
        console.error('Error querying patient diagnoses:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/opinion/requests', activeUser, (req,res) =>{
    const name = req.session.name;
    const email = req.session.email;
    res.render('user_dashboard',{name: name, email: email, page: 'opinion'});
});


router.get('/images/:filename', activeUser, (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'diagnose_ecg', filename);

    // Check if the filename starts with the session email
    if (filename.startsWith(req.session.email)) {
        // Check if the image file exists
        if (fs.existsSync(imagePath)) {
            // Serve the image file
            res.sendFile(imagePath);
        } else {
            // Image not found
            res.status(404).send('Image not found');
        }
    } else {
        // Unauthorized access
        res.status(403).send('Unauthorized access');
    }
});

module.exports = router;