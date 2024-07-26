const mongoose = require("mongoose");
const Review = require("./review");
const { object } = require("joi");


// let imageSchema = new mongoose.Schema({
//     url:String,
//     filename:String,
// })

let listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,
    image: {
        filename:String,
        url:String,
        
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }

    ],

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",

    }

})


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

let listing = mongoose.model("listing", listingSchema);

module.exports = listing;




// image:{
//     type: Object;
// }


// image: {
//     filename: {
//         type: String,
//         // required: true
//     },
//     url: {
//         type: String,
//         // required: true
//     }
// },