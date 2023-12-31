const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Event = require('../models/Event')
const bcrypt = require('bcrypt');

//Get All Users
router.get('/', checkAuthenticatedAdmin, async (req, res) => {
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

//New User Route
router.get('/new', checkAuthenticatedAdmin, (req, res) => {
    res.render('users/new', { user: new User() });
});

//Show User
router.get('/:id', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const events = await Event.find({ organizer: user.id }).exec();
        res.render('users/show', { 
            user: user, 
            eventsByUser: events
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Create User
router.post('/', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            name: req.body.name,
            password: hashedPassword,
            role: req.body.role
        });
        const newUser = await user.save();
        //res.status(201).json(newUser);
        res.redirect('users');
    } catch (err) {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
});

//Edit User
router.get('/:id/edit', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('users/edit', { user: user });
    } catch {
        res.redirect('/users')
    }
    
});

//Update User
router.put('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        user.username = req.body.username;
        user.password =  hashedPassword;
        user.name = req.body.name,
        user.role = req.body.role;
        await user.save();
        //res.status(201).json(newUser);
        res.redirect('/users');
    } catch (err) {
        if (user == null) {
            res.redirect('/');
        } else {
            res.render('users/new', {
                user: user,
                errorMessage: 'Error updating User'
            });
        }
    }
});

//Delete User
router.delete('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        await user.deleteOne({_id: req.params.id});
        //res.status(201).json(newUser);
        res.redirect('/users');
    } catch (err) {
        if (user == null) {
            res.redirect('/');
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
});

function checkAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if(req.user.role == 'Admin') {
            return next();
        }
    }
    res.redirect('/');
}


module.exports = router;