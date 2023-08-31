const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Event = require('../models/Event')

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

//New User Route
router.get('/new', (req, res) => {
    res.render('users/new', { user: new User() });
});

//Show User
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    try {
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
router.get('/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('users/edit', { user: user });
    } catch {
        res.redirect('/users')
    }
    
});

//Update User
router.put('/:id', async (req, res) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        user.username = req.body.username;
        user.password = req.body.password;
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
router.delete('/:id', async (req, res) => {
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

/*async function getUser(req, res, next) {
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
}*/

module.exports = router;