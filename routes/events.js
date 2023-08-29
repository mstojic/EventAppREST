const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');
const User = require('../models/User');

const uploadPath = path.join('public', Event.posterImagePath);
const imageTypes = ['image/jpeg', 'image/png', 'images/gif'];

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageTypes.includes(file.mimetype))
    }
});

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
router.post('/', upload.single('poster'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const event = new Event({
        name: req.body.name,
        date: req.body.date,
        organizer: req.body.organizer,
        description: req.body.description,
        eventPoster: fileName
    });

    try {
        const newEvent = await event.save();
        //res.redirect(`events/${newEvent.id}`);
        res.redirect('events');
    } catch (err) {
        if (event.eventPoster != null) {
            removeEventPoster(event.eventPoster)
        }
        //res.status(500).json({ message: err.message });
        renderNewPage(res, event, true);
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

function removeEventPoster(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    });
}

module.exports = router;