const mongoose = require('mongoose');
const path = require('path');
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

eventSchema.virtual('posterImagePath').get(function() {
    if (this.eventPoster != null) {
        return path.join('/', posterImagePath, this.eventPoster);
    }
});

module.exports = mongoose.model('Event', eventSchema);
module.exports.posterImagePath = posterImagePath;