const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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

module.exports = router;