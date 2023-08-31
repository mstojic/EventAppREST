const mongoose = require('mongoose');

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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'
    },
    description: {
        type: String,
    },
    eventPoster: {
        type: Buffer,
        required: true
    },
    eventPosterType: {
        type: String,
        required: true
    }
});

eventSchema.virtual('posterImagePath').get(function() {
    if (this.eventPoster != null && this.eventPosterType != null) {
        return `data:${this.eventPosterType};charset=utf-8;base64,${this.eventPoster.toString('base64')}`;
    }
});

module.exports = mongoose.model('Event', eventSchema);