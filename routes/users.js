const express = require('express');
const router = express.Router();
const User = require('../models/User')

//Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

//Get User
router.get('/:id', (req, res) => {

});

//Create User
router.post('/', (req, res) => {
    
});

//Update User
router.patch('/:id',  (req, res) => {
    
});

//Delete User
router.delete('/:id', (req, res) => {
   
});

module.exports = router;