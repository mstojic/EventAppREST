const mongoose = require('mongoose');
const Event = require('./Event')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

categorySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const categoryId = this._id;
        const hasEvent = await Event.exists({ category: categoryId });
        if (hasEvent) {
            next(new Error("There are events with this category."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

categorySchema.pre("deleteOne", { document: false, query: true }, (next) => {
    const categoryId = this.getFilter()["_id"];
    if (typeof categoryId === "undefined") {
        // no way to make cascade deletion since there is no _id
        // in the delete query
        // I would throw an exception, but it's up to you how to deal with it
        // to ensure data integrity
    }
});

module.exports = mongoose.model('Category', categorySchema);