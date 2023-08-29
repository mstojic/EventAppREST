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

//Get Category
/*router.get('/:id', getCategory, (req, res) => {
    res.json(res.category);
});*/

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

//Update Category
router.patch('/:id', getCategory, async (req, res) => {
    if (req.body.name != null) {
        res.category.name = req.body.name;
    }
    try {
        const updatedCategory = await res.category.save();
        res.json(updatedCategory)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Delete Category
router.delete('/:id', getCategory, async (req, res) => {
    try {
        await res.category.deleteOne();
        res.json({ message: 'Deleted category' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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