const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
  

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Pull the review ID from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document from the Review model
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    // Redirect to the listing's page after the review is deleted
    res.redirect(`/listings/${id}`);
};
