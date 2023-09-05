const express = require('express');
const router = express.Router();
const Role = require('../models/Role')

//Get All Roles
router.get('/', checkAuthenticatedAdmin, async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const roles = await Role.find(searchOptions);
        res.render('roles/index', { 
            roles: roles, 
            searchOptions: req.query 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Get Role
/*router.get('/:id', getRole, (req, res) => {
    res.json(res.role);
});*/

//New Role Route
router.get('/new', checkAuthenticatedAdmin, (req, res) => {
    res.render('roles/new', { role: new Role() });
});

//Create Role
router.post('/', checkAuthenticatedAdmin, async (req, res) => {
    const role = new Role({
        name: req.body.name
    });

    try {
        const newRole = await role.save();
        //res.status(201).json(newRole);
        res.redirect('/roles');
    } catch (err) {
        res.render('roles/new', {
            role: role,
            errorMessage: 'Error creating Role'
        })
    }
});

//Edit Role
router.get('/:id/edit', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const role = await Role.findById(req.params.id)
        res.render('roles/edit', { role: role });
    } catch {
        res.redirect('/roles')
    }
    
});

//Update Role
router.put('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let role;
    try {
        role = await Role.findById(req.params.id);
        role.name = req.body.name;
        await role.save();
        //res.status(201).json(newUser);
        res.redirect('/roles');
    } catch (err) {
        if (role == null) {
            res.redirect('/');
        } else {
            res.render('roles/new', {
                role: role,
                errorMessage: 'Error updating Role'
            });
        }
    }
});

//Delete Role
router.delete('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let role;
    try {
        role = await Role.findById(req.params.id);
        await role.deleteOne({_id: req.params.id});
        //res.status(201).json(newUser);
        res.redirect('/roles');
    } catch (err) {
        if (role == null) {
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