const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const Category = require('../models/Category');
const Location = require('../models/Location');

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

//Show Event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer').exec();
        const user = await User.findById(event.organizer);
        res.render('events/show', { 
            event: event
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Create Event
router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        date: req.body.date,
        organizer: req.body.organizer,
        category: req.body.category,
        location: req.body.location,
        description: req.body.description,
    });
    savePoster(event, req.body.poster)

    try {
        const newEvent = await event.save();
        //res.redirect(`events/${newEvent.id}`);
        res.redirect('events');
    } catch (err) {
        //res.status(500).json({ message: err.message });
        renderNewPage(res, event, false, true);
    }
});

//Edit Event
router.get('/:id/edit', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        renderNewPage(res, event, true)
    } catch {
        res.render('/events')
    }
    
});

//Update Event
router.put('/:id', async (req, res) => {
    let event;
    try {
        event = await Event.findById(req.params.id);
        event.name = req.body.name;
        event.date = req.body.date;
        event.organizer = req.body.organizer;
        event.category = req.body.category;
        event.location = req.body.location;
        event.description = req.body.description;
        if(req.body.poster != null && req.body.poster !== ''){
            savePoster(event, req.body.poster)
        }
        await event.save();
        //res.status(201).json(event);
        res.redirect('/events');
    } catch {
        if (event == null) {
            res.redirect('/');
        } else {
            renderNewPage(res, event, true, true);
        }
    }
});

//Delete Event
router.delete('/:id', async (req, res) => {
    let event;
    try {
        event = await Event.findById(req.params.id);
        await event.deleteOne({_id: req.params.id});
        //res.status(201).json(newUser);
        res.redirect('/events');
    } catch (err) {
        if (event == null) {
            res.redirect('/');
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
});

//Reserve Event
router.post('/:id/reserve', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        const newEvent = await event.save();
        //res.redirect(`events/${newEvent.id}`);
        res.redirect('events');
    } catch (err) {
        //res.status(500).json({ message: err.message });
        renderNewPage(res, event, false, true);
    }
});

async function renderNewPage(res, event, edit = false, hasError = false) {
    try {
        const organizers = await User.find({});
        const categories = await Category.find({});
        const locations = await Location.find({});
        const params = {
            organizers: organizers,
            categories: categories,
            locations: locations,
            event: event
        };

        if (hasError){
            if (edit) {
                params.errorMessage = 'Error Editing Event'
            } else {
                params.errorMessage = 'Error Creating Event'
            }
        } ;
        if (edit == true) {
            res.render('events/edit', params)
        } else {
            res.render('events/new', params);
        }

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