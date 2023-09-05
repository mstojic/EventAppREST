const express = require('express');
const router = express.Router();
const Location = require('../models/Location')

//Get All Locations
router.get('/', checkAuthenticatedAdmin, async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const locations = await Location.find(searchOptions);
        res.render('locations/index', { 
            locations: locations, 
            searchOptions: req.query 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//New Location Route
router.get('/new', checkAuthenticatedAdmin, (req, res) => {
    res.render('locations/new', { location: new Location() });
});

//Create Location
router.post('/', checkAuthenticatedAdmin, async (req, res) => {
    const location = new Location({
        name: req.body.name
    });

    try {
        const newLocation = await location.save();
        //res.status(201).json(newLocation);
        res.redirect('/locations');
    } catch (err) {
        res.render('locations/new', {
            location: location,
            errorMessage: 'Error creating Location'
        })
    }
});

//Edit Location
router.get('/:id/edit', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
        res.render('locations/edit', { location: location });
    } catch {
        res.redirect('/locations')
    }
    
});

//Update Location
router.put('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let location;
    try {
        location = await Location.findById(req.params.id);
        location.name = req.body.name;
        await location.save();
        //res.status(201).json(newUser);
        res.redirect('/locations');
    } catch (err) {
        if (location == null) {
            res.redirect('/');
        } else {
            res.render('locations/new', {
                location: location,
                errorMessage: 'Error updating Location'
            });
        }
    }
});

//Delete Location
router.delete('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let location;
    try {
        location = await Location.findById(req.params.id);
        await location.deleteOne({_id: req.params.id});
        //res.status(201).json(newUser);
        res.redirect('/locations');
    } catch (err) {
        if (location == null) {
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