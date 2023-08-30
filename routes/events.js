const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

const imageTypes = ['image/jpeg', 'image/png', 'images/gif'];

//Get All Events
router.get('/', async (req, res) => {
    let query = Event.find();
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.dateAfter != null && req.query.dateAfter != '') {
        query = query.gte('date', req.query.dateAfter);
    }
    if (req.query.dateBefore != null && req.query.dateBefore != '') {
        query = query.lte('date', req.query.dateBefore);
    }
    try {
        const events = await query.exec();
        res.render('events/index', {
            events: events,
            searchOptions: req.query
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
        //res.redirect('/')
    }
});

//New Event Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Event())
});

//Create Event
router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        date: req.body.date,
        organizer: req.body.organizer,
        description: req.body.description,
    });
    savePoster(event, req.body.poster)

    try {
        const newEvent = await event.save();
        //res.redirect(`events/${newEvent.id}`);
        res.redirect('events');
    } catch (err) {
        res.status(500).json({ message: err.message });
        //renderNewPage(res, event, true);
    }
});

//Update Event
router.patch('/:id', async (req, res) => {

});

//Delete Event
router.delete('/:id', async (req, res) => {

});

async function renderNewPage(res, event, hasError = false) {
    try {
        const organizers = await User.find({});
        const params = {
            organizers: organizers,
            event: event
        };

        if (hasError) params.errorMessage = 'Error Creating Event';
        res.render('events/new', params);
    } catch {
        res.redirect('/events')
    }
}

function savePoster(event, posterEncoded) {
    if (posterEncoded == null) return;
    const poster = JSON.parse(posterEncoded);
    if (poster != null && imageTypes.includes(poster.type)) {
        event.eventPoster = new Buffer.from(poster.data, 'base64');
        event.eventPosterType = poster.type;
    }
}

module.exports = router;