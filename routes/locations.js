const express = require('express');
const router = express.Router();
const Location = require('../models/Location')

//Get All Locations
router.get('/', async (req, res) => {
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

//Get Location
/*router.get('/:id', getLocation, (req, res) => {
    res.json(res.location);
});*/

//New Location Route
router.get('/new', (req, res) => {
    res.render('locations/new', { location: new Location() });
});

//Create Location
router.post('/', async (req, res) => {
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

//Update Location
router.patch('/:id', getLocation, async (req, res) => {
    if (req.body.name != null) {
        res.location.name = req.body.name;
    }
    try {
        const updatedLocation = await res.location.save();
        res.json(updatedLocation)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Delete Location
router.delete('/:id', getLocation, async (req, res) => {
    try {
        await res.location.deleteOne();
        res.json({ message: 'Deleted location' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getLocation(req, res, next) {
    let location;
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            location = await Location.findById(req.params.id)
        }

        if (location == null) {
            return res.status(404).json('Cannot find location');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.location = location;
    next();
}

module.exports = router;