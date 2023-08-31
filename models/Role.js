const mongoose = require('mongoose');
const Event = require('./Event')

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

roleSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const roleId = this._id;
        const hasEvent = await Event.exists({ organizer: roleId });
        if (hasEvent) {
            next(new Error("This role still has events."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

roleSchema.pre("deleteOne", { document: false, query: true }, (next) => {
    const roleId = this.getFilter()["_id"];
    if (typeof roleId === "undefined") {
        // no way to make cascade deletion since there is no _id
        // in the delete query
        // I would throw an exception, but it's up to you how to deal with it
        // to ensure data integrity
    }
});

module.exports = mongoose.model('Role', roleSchema);