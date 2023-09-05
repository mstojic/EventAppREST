require('dotenv').config();

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/', async (req, res) => {
    let events;
    try {
        events = await Event.find().sort({ date: 'desc' }).populate('location').populate('reservations').limit(3).exec();
    } catch (e) {
        //res.status(500).json(e);
        events = [];
    }
    res.render('index', { events: events });
    //res.status(500).json(req.user);
});

module.exports = router;