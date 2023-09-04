require('dotenv').config();

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');


/*const initializePassport = require('../passport-config');
initializePassport(
    passport, 
    username => {
        return User.findOne({username: new RegExp('^' + username + '$', "i") });
    },
    id => {
        return User.findById(id);
    }
);


router.use(flash());
router.use(session( {
    secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());


router.use(function(req,res,next){
    res.locals.user = req.user;
    next();
})*/

router.get('/' /*, authenticateToken*/, async (req, res) => {
    let events;
    try {
        events = await Event.find().sort({ date: 'desc' }).populate('location').limit(3).exec();

    } catch {
        events = [];
    }
    res.render('index', { events: events });

    //res.status(500).json(req.user);
});

/*router.get('/login', checkNotAuthenticated, async (req, res) => {
    res.render('login');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
}));

router.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
  });

router.get('/register', checkNotAuthenticated, async (req, res) => {
    res.render('register');
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.organiser != null ? 'Organiser' : 'User'
        });
        const newUser = await user.save();
        //res.status(201).json(newUser);
        res.redirect('login');
    } catch (err) {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
});

router.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
});

/*function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}*/

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

module.exports = router;