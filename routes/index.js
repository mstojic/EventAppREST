const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


router.get('/', authenticateToken, async (req, res) => {
    /*
    let events;
    try {
        events = await Event.find().sort({ date: 'desc' }).limit(10).exec();
        
    } catch {
        events = [];
    }
    res.render('index', { events: events });
    */
   res.status(500).json(req.user);
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.get('/register', async (req, res) => {
    res.render('register');
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = router;