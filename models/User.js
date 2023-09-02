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
    }
});


userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const userId = this._id;
        const hasEvent = await Event.exists({ organizer: userId });
        if (hasEvent) {
            next(new Error("This user still has events."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

userSchema.pre("deleteOne", { document: false, query: true }, (next) => {
    const userId = this.getFilter()["_id"];
    if (typeof userId === "undefined") {
        // no way to make cascade deletion since there is no _id
        // in the delete query
        // I would throw an exception, but it's up to you how to deal with it
        // to ensure data integrity
    }
});

module.exports = mongoose.model('User', userSchema);