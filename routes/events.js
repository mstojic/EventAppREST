const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Reservation = require('../models/Reservation');
const { eventNames } = require('../models/Chat');

const imageTypes = ['image/jpeg', 'image/png', 'images/gif'];

//Get All Events (Admin)
router.get('/admin', checkAuthenticatedAdmin, async (req, res) => {
    let query = Event.find().populate('location').populate('category').populate('organizer').populate('reservations');
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
        res.render('events/index_admin', {
            events: events,
            searchOptions: req.query
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
        //res.redirect('/')
    }
});

//Get All Events (Organiser)
router.get('/organizer', checkAuthenticatedOrganiser, async (req, res) => {
    let query = Event.find({ organizer: req.user.id }).populate('location').populate('category').populate('organizer').populate('reservations');
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
        res.render('events/index_organizer', {
            events: events,
            searchOptions: req.query
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
        //res.redirect('/')
    }
});

//Get All Events (User)
router.get('/user', checkAuthenticatedUser, async (req, res) => {
    const reservations = await Reservation.find({ user: req.user.id }).exec();
    let result = reservations.map(a => a.event);
    let query = Event.find({ _id: { $in: result } }).populate('location').populate('category').populate('organizer').populate('reservations');
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
        res.render('events/index_user', {
            events: events,
            searchOptions: req.query
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
        //res.redirect('/')
    }
});

//Get All Events
router.get('/', async (req, res) => {
    let query = Event.find().populate('location').populate('category').populate('organizer').populate('reservations');
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
router.get('/new', checkAuthenticatedAdmin, async (req, res) => {
    renderNewPage(res, new Event())
});

//New Event Route (Organizer)
router.get('/new_organizer', checkAuthenticatedOrganiser, async (req, res) => {
    renderNewPageOrganizer(res, new Event())
});

//Show Event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('location').populate('category').populate('organizer').populate('reservations').exec();
        let reservation;
        if (req.user != null) {
            reservation = await Reservation.findOne({ event: event.id, user: req.user.id });
        }

        let reserved = false;
        if (reservation == null && req.user == true) {
            reserved = false;
        } else if (reservation != null) {
            reserved = true;
        }

        res.render('events/show', {
            event: event,
            reserved: reserved
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Create Event
router.post('/', checkAuthenticatedAdminOrOrganiser, async (req, res) => {
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
        if(req.user) {
            if (req.user.role == 'Organiser') {
                res.redirect(`/events/${newEvent.id}`);
            } else if(req.user.role == 'Admin') {
                res.redirect('/events/admin');
            } else {
                res.redirect('/events');
            }
        } else {
            res.redirect('/events');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
        //renderNewPage(res, event, false, true);
    }
});

//Edit Event
router.get('/:id/edit', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        renderNewPage(res, event, true)
    } catch {
        res.render('/events')
    }

});

//Edit Event (Organizer)
router.get('/:id/edit_organizer', checkAuthenticatedOrganiser,async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        renderNewPageOrganizer(res, event, true)
    } catch {
        res.render('/events')
    }

});

//Update Event
router.put('/:id', checkAuthenticatedAdminOrOrganiser, async (req, res) => {
    let event;
    try {
        event = await Event.findById(req.params.id);
        event.name = req.body.name;
        event.date = req.body.date;
        event.organizer = req.body.organizer;
        event.category = req.body.category;
        event.location = req.body.location;
        event.description = req.body.description;
        if (req.body.poster != null && req.body.poster !== '') {
            savePoster(event, req.body.poster)
        }
        await event.save();
        //res.status(201).json(event);
        if(req.user) {
            if (req.user.role == 'Organiser') {
                res.redirect(`/events/${event.id}`);
            } else if(req.user.role == 'Admin') {
                res.redirect('/events/admin');
            } else {
                res.redirect('/events');
            }
        } else {
            res.redirect('/events');
        }
    } catch {
        if (event == null) {
            res.redirect('/');
        } else {
            renderNewPage(res, event, true, true);
        }
    }
});

//Delete Event
router.delete('/:id', checkAuthenticatedAdminOrOrganiser, async (req, res) => {
    let event;
    try {
        event = await Event.findById(req.params.id);
        await event.deleteOne({ _id: req.params.id });
        //res.status(201).json(newUser);
        if(req.user) {
            if (req.user.role == 'Organiser') {
                res.redirect('/events/organizer');
            } else if(req.user.role == 'Admin') {
                res.redirect('/events/admin');
            } else {
                res.redirect('/events');
            }
        } else {
            res.redirect('/events');
        }
    } catch (err) {
        if (event == null) {
            res.redirect('/');
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
});



//Reserve Event
router.post('/reserve/:id', checkAuthenticatedUser, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        const user = await User.findById(req.user.id)
        const reservation = new Reservation({
            event: event.id,
            user: user.id
        });
        const newReservation = await reservation.save();
        res.redirect(`/events/${newReservation.event}`);
        //res.redirect('/events');
    } catch (err) {
        res.status(500).json({ message: err.message });
        //renderNewPage(res, event, false, true);
    }
});

//Unreserve Event
router.delete('/unreserve/:id', checkAuthenticatedUser, async (req, res) => {
    let reservation;
    try {
        reservation = await Reservation.findOne({ event: req.params.id, user: req.user.id });
        await reservation.deleteOne({ _id: reservation.id });
        //res.status(201).json(newUser);
        res.redirect(`/events/${req.params.id}`);
        //res.redirect('/events');
    } catch (err) {
        if (reservation == null) {
            res.redirect('/');
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
});

//Chat
router.get('/:id/chat', async (req, res) => {
    res.render('events/chat');
});

async function renderNewPage(res, event, edit = false, hasError = false) {
    try {
        const organizers = await User.find({ role: "Organiser" }).exec();
        const categories = await Category.find({});
        const locations = await Location.find({});
        const params = {
            organizers: organizers,
            categories: categories,
            locations: locations,
            event: event
        };

        if (hasError) {
            if (edit) {
                params.errorMessage = 'Error Editing Event'
            } else {
                params.errorMessage = 'Error Creating Event'
            }
        };
        if (edit == true) {
            res.render('events/edit', params)
        } else {
            res.render('events/new', params);
        }

        //res.render('events/new', params);
    } catch {
        res.redirect('/events')
    }
}

async function renderNewPageOrganizer(res, event, edit = false, hasError = false) {
    try {
        const organizers = await User.find({ role: "Organiser" }).exec();
        const categories = await Category.find({});
        const locations = await Location.find({});
        const params = {
            organizers: organizers,
            categories: categories,
            locations: locations,
            event: event,
            edit: edit
        };

        if (hasError) {
            if (edit) {
                params.errorMessage = 'Error Editing Event'
            } else {
                params.errorMessage = 'Error Creating Event'
            }
        };
        if (edit == true) {
            res.render('events/edit_organizer', params)
        } else {
            res.render('events/new_organizer', params);
        }

        //res.render('events/new', params);
    } catch {
        res.redirect('/events/organizer')
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

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkAuthenticatedUser(req, res, next) {
    if (req.isAuthenticated()) {
        if(req.user.role == 'User') {
            return next();
        }
    }
    res.redirect('/');
}

function checkAuthenticatedOrganiser(req, res, next) {
    if (req.isAuthenticated()) {
        if(req.user.role == 'Organiser') {
            return next();
        }
    }
    res.redirect('/');
}

function checkAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if(req.user.role == 'Admin') {
            return next();
        }
    }
    res.redirect('/');
}

function checkAuthenticatedAdminOrOrganiser(req, res, next) {
    if (req.isAuthenticated()) {
        if(req.user.role == 'Admin' || req.user.role == 'Organiser') {
            return next();
        }
    }
    res.redirect('/');
}

module.exports = router;