const mongoose = require('mongoose');
const Message = require('./Message')

const chatSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

chatSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const chatId = this._id;
        const hasMessage = await Message.exists({ chat: chatId });
        if (hasMessage) {
            next(new Error("This chat still has messages."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

chatSchema.pre("deleteOne", { document: false, query: true }, (next) => {
    const chatId = this.getFilter()["_id"];
    if (typeof chatId === "undefined") {
        // no way to make cascade deletion since there is no _id
        // in the delete query
        // I would throw an exception, but it's up to you how to deal with it
        // to ensure data integrity
    }
});

module.exports = mongoose.model('Chat', chatSchema);