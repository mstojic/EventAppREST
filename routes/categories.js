const express = require('express');
const router = express.Router();
const Category = require('../models/Category')

//Get All Locations
router.get('/', async (req, res) => {
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
router.get('/new', (req, res) => {
    res.render('categories/new', { category: new Category() });
});

//Create Category
router.post('/', async (req, res) => {
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
router.get('/:id/edit', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.render('categories/edit', { category: category });
    } catch {
        res.redirect('/categories')
    }
    
});

//Update Category
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

async function getCategory(req, res, next) {
    let category;
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(req.params.id)
        }

        if (category == null) {
            return res.status(404).json('Cannot find category');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.category = category;
    next();
}

module.exports = router;