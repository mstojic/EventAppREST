const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat')
const Event = require('../models/Event')
const Message = require('../models/Message')

//Get All Chats
router.get('/', async (req, res) => {
    /* let searchOptions = {};
     if (req.query.name != null && req.query.name !== '') {
         searchOptions.name = new RegExp(req.query.name, 'i');
     }*/
    try {
        const chats = await Chat.find({ $or: [{ 'user': req.user.id }, { 'organizer': req.user.id }] }).populate('event').populate('organizer').exec();
        res.render('chats/index', {
            chats: chats
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Show Chat
router.get('/:id', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id).populate('organizer').populate('user').exec();
        const messages = await Message.find({ chat: chat.id });
        res.render('chats/show', {
            messages: messages,
            chat: chat
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Create Chat
router.post('/', async (req, res) => {
    const event = await Event.findById(req.body.event);
    const chat = new Chat({
        event: event.id,
        organizer: event.organizer,
        user: req.user.id
    });

    try {
        const newLocation = await chat.save();
        //res.status(201).json(newLocation);
        res.redirect('/chats');
    } catch (err) {
        res.render('chats/new', {
            chat: chat,
            errorMessage: 'Error creating Chat'
        })
    }
});

//Edit Chat
router.get('/:id/edit', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
        res.render('chats/edit', { chat: chat });
    } catch {
        res.redirect('/chats')
    }

});

//Update Chat
router.put('/:id', async (req, res) => {
    let chat;
    try {
        chat = await Chat.findById(req.params.id);
        chat.name = req.body.name;
        await chat.save();
        //res.status(201).json(newUser);
        res.redirect('/chats');
    } catch (err) {
        if (chat == null) {
            res.redirect('/');
        } else {
            res.render('chats/new', {
                chat: chat,
                errorMessage: 'Error updating Chat'
            });
        }
    }
});

//Delete Chat
router.delete('/:id', async (req, res) => {
    let chat;
    try {
        chat = await Chat.findById(req.params.id);
        await chat.deleteOne({ _id: req.params.id });
        //res.status(201).json(newUser);
        res.redirect('/chats');
    } catch (err) {
        if (chat == null) {
            res.redirect('/');
        } else {
            return res.status(500).json({ message: err.message });
        }
    }
});

async function getLocation(req, res, next) {
    let chat;
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            chat = await Chat.findById(req.params.id)
        }

        if (chat == null) {
            return res.status(404).json('Cannot find chat');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.chat = chat;
    next();
}

module.exports = router;