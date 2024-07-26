let mongoose = require("mongoose");
const { type } = require("../schema");
const { date } = require("joi");

let reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },

    createdAt: {
        type: Date,
        default: Date.now(),

    }


})


let Review = mongoose.model("Review", reviewSchema);

module.exports = Review;