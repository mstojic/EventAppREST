const mongoose = require('mongoose');

const posterImagePath = "uploads/eventPosters";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
    },
    eventPoster: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);
module.exports.posterImagePath = posterImagePath;