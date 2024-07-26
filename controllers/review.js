const Listing = require("../Models/listings.js");
const listing = require("../Models/listings.js");
const Review = require("../Models/review.js");


module.exports.creatingReview = async (req, res) => {
    let listingData = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listingData.reviews.push(newReview);

    await listingData.save();
    await newReview.save();

    console.log("new Review Saved");
    req.flash("success", "New Review Created!!");
    // res.send("New Review Saved");
    // res.redirect("/listings");
    res.redirect(`/listings/${listingData._id}`)
}




module.exports.deletingReview = async (req, res) => {
    let { id, reviewId } = req.params;
    // console.log(id);
    reviewId = reviewId.trim();
    // console.log(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!!");
    res.redirect(`/listings/${id}`);
}