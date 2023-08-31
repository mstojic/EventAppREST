const mongoose = require('mongoose');
const Event = require('./Event')

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

locationSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const locationId = this._id;
        const hasEvent = await Event.exists({ location: locationId });
        if (hasEvent) {
            next(new Error("There are still events with this location."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

locationSchema.pre("deleteOne", { document: false, query: true }, (next) => {
    const locationId = this.getFilter()["_id"];
    if (typeof locationId === "undefined") {
        // no way to make cascade deletion since there is no _id
        // in the delete query
        // I would throw an exception, but it's up to you how to deal with it
        // to ensure data integrity
    }
});

module.exports = mongoose.model('Location', locationSchema);