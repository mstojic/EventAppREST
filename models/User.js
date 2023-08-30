const mongoose = require('mongoose');
const Event = require('./Event')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    },
});


userSchema.pre("deleteOne", { document: true }, async function (next) {
    
    try {
        const query = this.getFilter();
        const hasEvent = await Event.exists({ organizer: query._id });
        if (hasEvent) {
            next(new Error("This user still has events."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);