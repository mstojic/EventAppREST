const mongoose = require('mongoose');
const Event = require('./Event')
const User = require('./User')

const reservationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);