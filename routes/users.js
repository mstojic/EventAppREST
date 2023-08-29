const express = require('express');
const router = express.Router();
const User = require('../models/User')

//Get All Users
router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.username != null && req.query.username !== '') {
        searchOptions.username = new RegExp(req.query.username, 'i');
    }
    try {
        const users = await User.find(searchOptions);
        res.render('users/index', { 
            users: users, 
            searchOptions: req.query 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Get User
/*router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});*/

//New User Route
router.get('/new', (req, res) => {
    res.render('users/new', { user: new User() });
});

//Create User
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        //res.status(201).json(newUser);
        res.redirect('/');
    } catch (err) {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
});

//Update User
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Delete User
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        res.json({ message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(req.params.id)
        }

        if (user == null) {
            return res.status(404).json('Cannot find user');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;