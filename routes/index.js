const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.get('/', async (req, res) => {
    let events;
    try {
        events = await Event.find().sort({ date: 'desc' }).limit(10).exec();
        
    } catch {
        events = [];
    }
    res.render('index', { events: events });
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.get('/register', async (req, res) => {
    res.render('register');
});

module.exports = router;