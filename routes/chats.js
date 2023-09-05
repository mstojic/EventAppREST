const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat')
const Event = require('../models/Event')
const Message = require('../models/Message')

//Get All Chats
router.get('/', checkAuthenticated, async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const chats = await Chat.find({ $or: [{ 'user': req.user.id }, { 'organizer': req.user.id }] }).populate('event').populate('organizer').populate('user').exec();
        res.render('chats/index', {
            chats: chats
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Show Chat
router.get('/:id', checkAuthenticated, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id).populate('organizer').populate('user').populate('event').exec();
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
router.post('/', checkAuthenticated, async (req, res) => {
    const event = await Event.findById(req.body.event);
    const existingChat = await Chat.findOne( {event: event.id, user: req.user.id} )
    const chat = new Chat({
        event: event.id,
        organizer: event.organizer,
        user: req.user.id
    });

    try {
        if(!existingChat) {
            const newChat = await chat.save();
            res.redirect(`/chats/${newChat.id}`);
            //res.redirect('/chats');
        } else {
            res.redirect(`/chats/${existingChat.id}`);
        }
        
        //res.status(201).json(newChat);
        
    } catch (err) {
        res.render('chats/new', {
            chat: chat,
            errorMessage: 'Error creating Chat'
        })
    }
});

//Edit Chat
router.get('/:id/edit', checkAuthenticated, async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
        res.render('chats/edit', { chat: chat });
    } catch {
        res.redirect('/chats')
    }

});

//Update Chat
router.put('/:id', checkAuthenticated, async (req, res) => {
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
router.delete('/:id', checkAuthenticated, async (req, res) => {
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

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;