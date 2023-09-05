const express = require('express');
const router = express.Router();
const Category = require('../models/Category')

//Get All Categories
router.get('/', checkAuthenticatedAdmin, async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const categories = await Category.find(searchOptions);
        res.render('categories/index', { 
            categories: categories, 
            searchOptions: req.query 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//New Category Route
router.get('/new', checkAuthenticatedAdmin, (req, res) => {
    res.render('categories/new', { category: new Category() });
});

//Create Category
router.post('/', checkAuthenticatedAdmin, async (req, res) => {
    const category = new Category({
        name: req.body.name
    });

    try {
        const newCategory = await category.save();
        //res.status(201).json(newCategory);
        res.redirect('/categories');
    } catch (err) {
        res.render('categories/new', {
            category: category,
            errorMessage: 'Error creating Category'
        })
    }
});

//Edit Category
router.get('/:id/edit', checkAuthenticatedAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.render('categories/edit', { category: category });
    } catch {
        res.redirect('/categories')
    }
    
});

//Update Category
router.put('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        category.name = req.body.name;
        await category.save();
        //res.status(201).json(newUser);
        res.redirect('/categories');
    } catch (err) {
        if (category == null) {
            res.redirect('/');
        } else {
            res.render('categories/new', {
                category: category,
                errorMessage: 'Error updating Category'
            });
        }
    }
});

//Delete Category
router.delete('/:id', checkAuthenticatedAdmin, async (req, res) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        await category.deleteOne({_id: req.params.id});
        //res.status(201).json(newUser);
        res.redirect('/categories');
    } catch (err) {
        if (category == null) {
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